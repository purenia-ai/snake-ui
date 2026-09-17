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
const blocks = await server.ssrLoadModule('/src/uni_modules/snake-ui/libs/cms/blocks.ts');
const commerceModule = await server.ssrLoadModule('/src/uni_modules/snake-ui/libs/cms/use-commerce.ts');
const runtime = await server.ssrLoadModule('/src/uni_modules/snake-ui/libs/runtime/index.ts');
const v2Shared = await server.ssrLoadModule('/src/uni_modules/snake-ui/components/snake-cms/blocks/v2/shared.ts');

test('CMS v2 coupon keeps both public and legacy coupon fields for host services', () => {
    const coupon = { id: 'coupon-1' };
    const input = {
        coupon,
        before: { image: 'before.png' },
        after: { link: { httpType: 11, http: 'https://example.com' } }
    };
    const result = v2Shared.v2CouponLegacyData(input);

    assert.equal(result.coupon, coupon);
    assert.equal(result.couponObj, coupon);
    assert.equal(result.beforeImage, 'before.png');
    assert.equal(result.afterUrl, 'https://example.com');
    assert.equal(result.type, '11');
    assert.equal(input.couponObj, undefined);
});

test('CMS v2 carousel resolves indicator defaults and progress for each slide', () => {
    assert.equal(v2Shared.carouselIndicatorType({}), 'bullets');
    for (const type of ['none', 'bullets', 'fraction', 'progressbar']) {
        assert.equal(v2Shared.carouselIndicatorType({ indicator: { type } }), type);
    }
    assert.equal(v2Shared.carouselProgress(0, 0), 0);
    assert.equal(v2Shared.carouselProgress(0, 4), 25);
    assert.equal(v2Shared.carouselProgress(1, 4), 50);
    assert.equal(v2Shared.carouselProgress(3, 4), 100);
});

test('CMS v2 search enables sticky positioning only for position 1', () => {
    assert.equal(v2Shared.searchStickyEnabled({}), false);
    assert.equal(v2Shared.searchStickyEnabled({ style: { position: 0 } }), false);
    assert.equal(v2Shared.searchStickyEnabled({ style: { position: 1 } }), true);
});

test('CMS normalizes aliases, preserves extensions, and keeps only one commerce section', () => {
    const input = [
        { component: 'videoss', setStyle: { src: 'video.mp4' } },
        { component: 'goodslist', setStyle: {} },
        { component: 'goodslist', setStyle: {} },
        { component: 'partner-card', setStyle: { title: 'extension' } }
    ];
    const result = normalize.normalizeCmsComponents(input);
    assert.deepEqual(
        result.components.map(item => item.component),
        ['videos', 'goodslist', 'partner-card']
    );
    assert.equal(result.components.at(-1).builtin, false);
    assert.ok(result.diagnostics.some(item => item.code === 'duplicate-commerce-section'));
    assert.ok(result.diagnostics.some(item => item.code === 'unknown-component'));
    assert.equal(input[0].component, 'videoss');
});

test('CMS block catalog is the source of built-in identities and public component names', () => {
    const expectedTypes = [
        'commoditysearch',
        'auxiliarysegmentation',
        'richtext',
        'graphicnavigation',
        'images',
        'pictureads',
        'magiccube',
        'videos',
        'notice',
        'jumpApplet',
        'follow',
        'suspension',
        'coupon',
        'pagePopup',
        'goodslist',
        'custommodule',
        'v2.carousel',
        'v2.coupon',
        'v2.custom',
        'v2.divider',
        'v2.floatbutton',
        'v2.goodslist',
        'v2.hotzone',
        'v2.images',
        'v2.magiccube',
        'v2.notice',
        'v2.popup',
        'v2.richtext',
        'v2.search',
        'v2.video'
    ];

    assert.deepEqual(Object.keys(blocks.cmsBlocks), expectedTypes);
    assert.equal(blocks.isCmsBuiltinComponent('magiccube'), true);
    assert.equal(blocks.isCmsBuiltinComponent('partner-card'), false);
    assert.equal(normalize.cmsBuiltinComponents, blocks.cmsBuiltinComponents);
    assert.equal(blocks.cmsBlocks.suspension.componentName, 'snake-floating-bubble');
    assert.ok(Object.values(blocks.cmsBlocks).every(block => block.componentName.startsWith('snake-')));
    assert.equal(Object.values(blocks.cmsBlocks).filter(block => block.version === 2).length, 14);
});

test('CMS normalizes v1 and v2 components without collapsing their data envelopes', () => {
    const result = normalize.normalizeCmsComponents([
        { component: 'images', setStyle: { imageList: [{ src: 'legacy.png' }] } },
        { component: 'v2.images', active: true, props: { layout: { mode: 'grid' }, items: [] } },
        { component: 'v2.notice', active: false, props: { noticeText: 'hidden' } },
        { component: 'v2.video', props: null }
    ]);

    assert.deepEqual(
        result.components.map(item => [item.component, item.version]),
        [
            ['images', 1],
            ['v2.images', 2],
            ['v2.video', 2]
        ]
    );
    assert.equal(result.components[0].setStyle.imageList[0].src, 'legacy.png');
    assert.equal(result.components[1].props.layout.mode, 'grid');
    assert.equal(result.components[2].props.src, '');
    assert.equal(result.components[2].props.style.heightMode, 'auto');
    assert.ok(result.diagnostics.some(item => item.component === 'v2.video' && item.code === 'invalid-component'));
});

test('CMS v2 normalization fills defaults, coerces primitives, and drops undeclared fields', () => {
    const result = normalize.normalizeCmsComponents([
        {
            component: 'v2.search',
            props: { isSearch: 'true', style: { height: 999, position: '1' }, internalOnly: 'drop' }
        }
    ]);
    const props = result.components[0].props;
    assert.equal(props.isSearch, true);
    assert.equal(props.style.height, 80);
    assert.equal(props.style.position, 1);
    assert.equal(props.searchText.length > 0, true);
    assert.equal(props.internalOnly, undefined);
});

test('CMS rich text sanitizer removes executable markup and inline event handlers', () => {
    const dirty =
        '<p onclick="run()" style="color:red">safe</p><script>alert(1)</script><a href=javascript:run()>x</a>';
    const clean = v2Shared.sanitizeRichText(dirty);
    assert.equal(clean.includes('onclick'), false);
    assert.equal(clean.includes('<script'), false);
    assert.equal(clean.includes('javascript:'), false);
    assert.equal(clean.includes('alert(1)'), false);
    assert.equal(clean.includes('style='), false);
    assert.equal(clean.includes('safe'), true);
});

test('CMS v2 links reject executable and invalid external URLs', async () => {
    const actions = [];
    const service = { open: action => actions.push(action) };
    await v2Shared.openV2Link({ httpType: 10, http: 'javascript:run()' }, service);
    await v2Shared.openV2Link({ httpType: 11, http: '/relative' }, service);
    await v2Shared.openV2Link({ httpType: 11, http: 'https://example.com' }, service, {}, { keyword: 'shoe' });
    assert.equal(actions.length, 1);
    assert.equal(actions[0].url, 'https://example.com');
    assert.equal(actions[0].extraData.keyword, 'shoe');
});

test('CMS commerce controller paginates through a host service without mutating config', async () => {
    const values = new Map();
    runtime.resetRuntime();
    runtime.configureRuntime({
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
    const controller = commerceModule.useCmsCommerce({
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

test('CMS v2 commerce builds requests from props.query without reading legacy setStyle', async () => {
    const requests = [];
    const component = {
        id: 'v2-goods',
        version: 2,
        component: 'v2.goodslist',
        originalComponent: 'v2.goodslist',
        builtin: true,
        setStyle: {},
        props: {
            query: {
                source: 'condition',
                activityType: 'auction',
                activityStatus: 'ing',
                userRule: 'new',
                low: 100,
                high: 500,
                categoryId: 'bags',
                brands: [{ id: 1, name: 'Snake' }],
                gender: ['male'],
                pageSize: 12,
                sort: 'newest'
            },
            display: { cardType: 'auction' },
            bars: {},
            style: {},
            empty: { mode: 'default' }
        }
    };
    const controller = commerceModule.useCmsCommerce({
        pageInfo: () => ({ pageId: 'v2' }),
        component: () => component,
        options: () => ({
            services: {
                commerce: {
                    async getGoods({ params }) {
                        requests.push(params);
                        return { items: [], hasMore: false };
                    }
                }
            }
        })
    });

    await controller.init();
    assert.equal(requests[0].size, 12);
    assert.equal(requests[0].low, 100);
    assert.equal(requests[0].cateId, 'bags');
    assert.equal(requests[0].activityType, 'auction');
    assert.equal(requests[0].brandFilter, 'Snake');
    assert.equal(requests[0].genderFilter, 'male');
});

test('every CMS v2 catalog entry has a static snake-cms branch and internal renderer', async () => {
    const cmsRoot = resolve(import.meta.dirname, '../src/uni_modules/snake-ui/components/snake-cms');
    const source = await readFile(join(cmsRoot, 'snake-cms.vue'), 'utf8');
    const v2Blocks = Object.entries(blocks.cmsBlocks).filter(([, definition]) => definition.version === 2);

    for (const [type, definition] of v2Blocks) {
        assert.ok(source.includes(`item.component === '${type}'`), `${type}: static branch`);
        await readFile(join(cmsRoot, 'blocks/v2', `${definition.componentName.slice('snake-'.length)}.vue`), 'utf8');
    }
});

test('CMS package does not contain application-specific endpoints, routes, review flags, or assets', async () => {
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
            else if (/\.(?:ts|vue)$/.test(entry.name)) {
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
