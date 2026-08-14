import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import test, { after } from 'node:test';
import { createServer } from 'vite';

const storage = new Map();
globalThis.uni = {
    getStorageSync: key => storage.get(key),
    setStorageSync: (key, value) => storage.set(key, value),
    getSystemInfoSync: () => ({ theme: 'light', platform: 'devtools', windowWidth: 375 }),
    onThemeChange: () => {},
    showLoading: () => {},
    hideLoading: () => {},
    showToast: () => {}
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

const theme = await server.ssrLoadModule('/src/uni_modules/snake-ui/libs/config/theme.ts');
const locale = await server.ssrLoadModule('/src/uni_modules/snake-ui/locale/index.ts');
const functions = await server.ssrLoadModule('/src/uni_modules/snake-ui/libs/functions/index.ts');
const request = await server.ssrLoadModule('/src/uni_modules/snake-ui/libs/request/index.ts');

test('theme initializes Snake tokens and switches dark mode reactively', () => {
    storage.clear();
    theme.resetSnakeTheme();
    theme.initSnakeTheme({ primary: '#123456' });
    assert.equal(theme.snakeColor.primary, '#123456');
    assert.equal(theme.snakeCssVars.value['--snake-color-primary'], '#123456');
    theme.setSnakeDarkMode('dark');
    assert.equal(theme.isSnakeDarkMode(), true);
    assert.equal(theme.snakeCssVars.value['--snake-theme-mode'], 'dark');
    assert.equal(storage.get('snake-ui-dark-mode'), 'dark');
});

test('theme accepts config-only options without treating them as color tokens', () => {
    storage.clear();
    theme.resetSnakeTheme();
    theme.initSnakeTheme({ defaultDarkMode: 'dark', force: true });
    assert.equal(theme.isSnakeDarkMode(), true);
    assert.equal(theme.snakeColor.primary, theme.snakeDarkPalette.primary);
    assert.equal('defaultDarkMode' in theme.snakeColor, false);
});

test('locale uses current language, Chinese fallback, and replacements', () => {
    storage.clear();
    locale.resetSnakeLocale();
    locale.initSnakeLocale([{ name: 'test', messages: { greeting: 'Hello {name}' } }]);
    assert.equal(locale.setSnakeLocale('test'), true);
    assert.equal(locale.snakeTranslate('greeting', { name: 'Snake' }), 'Hello Snake');
    assert.equal(locale.snakeTranslate('common.confirm'), '确定');
    assert.equal(locale.snakeTranslate('missing.key'), 'missing.key');
});

test('foundation utilities clone, merge, style, and color values', () => {
    const source = { nested: { value: 1 }, list: [1, 2] };
    const clone = functions.deepClone(source);
    clone.nested.value = 2;
    assert.equal(source.nested.value, 1);
    assert.deepEqual(functions.deepMerge(source, { nested: { added: true } }), {
        nested: { value: 1, added: true },
        list: [1, 2]
    });
    assert.equal(functions.toStyle({ backgroundColor: '#fff' }, 'color:#000'), 'background-color:#fff;color:#000');
    assert.equal(functions.colorToRgba('#00a86f', 0.5), 'rgba(0, 168, 111, 0.5)');
});

test('http keeps legacy adapter support and rejects interceptor cancellation', async () => {
    request.snakeHttp.reset();
    request.configureSnakeHttp(
        { config: { baseUrl: '/api' } },
        {
            get: async (url, params) => ({ url, params }),
            post: async (url, data) => ({ url, data })
        }
    );
    assert.deepEqual(await request.snakeHttp.get('/health', { ready: true }), {
        url: '/api/health',
        params: { ready: true }
    });
    request.snakeHttp.setInterceptor({ request: () => false });
    await assert.rejects(
        request.snakeHttp.get('/blocked'),
        error => error instanceof request.SnakeHttpError && error.kind === 'canceled'
    );
});

test('every component root receives Snake theme variables', async () => {
    const componentsRoot = resolve(import.meta.dirname, '../src/uni_modules/snake-ui/components');
    async function vueFiles(directory) {
        const entries = await readdir(directory, { withFileTypes: true });
        return (
            await Promise.all(
                entries.map(async entry => {
                    const path = join(directory, entry.name);
                    if (entry.isDirectory()) return vueFiles(path);
                    return entry.name.endsWith('.vue') ? [path] : [];
                })
            )
        ).flat();
    }
    const delegatedRoots = new Set(['snake-lazy-image.vue', 'snake-popup.vue']);
    const missing = [];
    for (const file of await vueFiles(componentsRoot)) {
        const source = await readFile(file, 'utf8');
        if (!source.includes('$snakeThemeStyle') && !delegatedRoots.has(file.split(/[\\/]/).at(-1))) {
            missing.push(file.replace(`${componentsRoot}\\`, ''));
        }
    }
    assert.deepEqual(missing, []);
});
