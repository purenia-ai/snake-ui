import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import test, { after } from 'node:test';
import { createServer } from 'vite';

const storage = new Map();
globalThis.uni = {
    getStorageSync: key => storage.get(key),
    setStorageSync: (key, value) => storage.set(key, value),
    showToast: () => {},
    getSystemInfoSync: () => ({ platform: 'devtools', windowWidth: 375 })
};

const server = await createServer({
    appType: 'custom',
    configFile: false,
    logLevel: 'silent',
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true }
});

after(async () => {
    await server.close();
    delete globalThis.uni;
});

const normalize = await server.ssrLoadModule('/src/uni_modules/snake-ui/libs/cms/normalize.ts');
const commerceModule = await server.ssrLoadModule('/src/uni_modules/snake-ui/libs/cms/use-commerce.ts');
const runtime = await server.ssrLoadModule('/src/uni_modules/snake-ui/libs/runtime.ts');

test('CMS normalizes aliases, preserves extensions, and keeps only one commerce section', () => {
    const input = [
        { component: 'videoss', setStyle: { src: 'video.mp4' } },
        { component: 'goodslist', setStyle: {} },
        { component: 'goodslist', setStyle: {} },
        { component: 'partner-card', setStyle: { title: 'extension' } }
    ];
    const result = normalize.normalizeSnakeCmsComponents(input);
    assert.deepEqual(
        result.components.map(item => item.component),
        ['videos', 'goodslist', 'partner-card']
    );
    assert.equal(result.components.at(-1).builtin, false);
    assert.ok(result.diagnostics.some(item => item.code === 'duplicate-commerce-section'));
    assert.ok(result.diagnostics.some(item => item.code === 'unknown-component'));
    assert.equal(input[0].component, 'videoss');
});

test('CMS commerce controller paginates through a host service without mutating config', async () => {
    const values = new Map();
    runtime.resetSnakeUIRuntime();
    runtime.configureSnakeUI({
        cache: {
            get: key => values.get(key),
            set: (key, value) => values.set(key, value),
            delete: key => values.delete(key)
        }
    });
    const component = {
        id: 'goods-1',
        component: 'goodslist',
        originalComponent: 'goodslist',
        builtin: true,
        setStyle: { listType: 'sale', filterParams: { pageSize: 2 } }
    };
    const states = [];
    const controller = commerceModule.useSnakeCmsCommerce({
        pageInfo: () => ({ pageId: 'home' }),
        component: () => component,
        options: () => ({
            cachePrefix: 'test:cms',
            services: {
                commerce: {
                    async getGoods({ params }) {
                        return params.page === 1
                            ? { items: [{ id: 1 }, { id: 2 }], hasMore: true }
                            : { items: [{ id: 3 }], hasMore: false };
                    }
                }
            }
        }),
        onStateChange: state => states.push(state.status)
    });
    await controller.init();
    assert.equal(controller.status.value, 'ready');
    await controller.loadMore();
    assert.equal(controller.status.value, 'no-more');
    assert.deepEqual(
        controller.goodsList.value.map(item => item.id),
        [1, 2, 3]
    );
    assert.equal(component.setStyle.listType, 'sale');
    assert.ok(states.includes('loading-more'));
});

test('Joker endpoints, routes, review flags, and CDN assets stay inside the legacy adapter', async () => {
    const roots = [
        resolve(import.meta.dirname, '../src/uni_modules/snake-ui/components'),
        resolve(import.meta.dirname, '../src/uni_modules/snake-ui/libs/cms')
    ];
    const forbidden =
        /cdn\.puresnake|\/v3\/|\/pages\/(?:buy|custom|merchantCenter|consignment)|isContentVisibleInReview|generateUrlScheme/;
    const violations = [];
    async function scan(directory) {
        for (const entry of await readdir(directory, { withFileTypes: true })) {
            const path = join(directory, entry.name);
            if (entry.isDirectory()) await scan(path);
            else if (/\.(?:ts|vue)$/.test(entry.name) && entry.name !== 'legacy-joker.ts') {
                const source = await readFile(path, 'utf8');
                if (forbidden.test(source)) violations.push(path);
            }
        }
    }
    for (const root of roots) await scan(root);
    assert.deepEqual(violations, []);
});

test('libs layer never imports back from components', async () => {
    const libsRoot = resolve(import.meta.dirname, '../src/uni_modules/snake-ui/libs');
    const violations = [];
    async function scan(directory) {
        for (const entry of await readdir(directory, { withFileTypes: true })) {
            const path = join(directory, entry.name);
            if (entry.isDirectory()) await scan(path);
            else if (/\.(?:ts|vue)$/.test(entry.name)) {
                const source = await readFile(path, 'utf8');
                if (source.includes('../../components/')) violations.push(path);
            }
        }
    }
    await scan(libsRoot);
    assert.deepEqual(violations, []);
});
