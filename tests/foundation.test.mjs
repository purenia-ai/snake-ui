import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import test, { after } from 'node:test';
import { createServer } from 'vite';

const storage = new Map();
const navigationCalls = [];
const miniProgramCalls = [];
let failNextNavigateTo = false;

function recordNavigation(method) {
    return options => {
        navigationCalls.push({ method, options: { ...options, success: undefined, fail: undefined } });
        if (method === 'navigateTo' && failNextNavigateTo) {
            failNextNavigateTo = false;
            options.fail?.({ errMsg: 'navigateTo:fail' });
            return;
        }
        options.success?.({ errMsg: `${method}:ok` });
    };
}

globalThis.uni = {
    getStorageSync: key => storage.get(key),
    setStorageSync: (key, value) => storage.set(key, value),
    getSystemInfoSync: () => ({ theme: 'light', platform: 'devtools', windowWidth: 375 }),
    onThemeChange: () => {},
    showLoading: () => {},
    hideLoading: () => {},
    showToast: () => {},
    navigateTo: recordNavigation('navigateTo'),
    redirectTo: recordNavigation('redirectTo'),
    switchTab: recordNavigation('switchTab'),
    reLaunch: recordNavigation('reLaunch'),
    navigateBack: recordNavigation('navigateBack'),
    navigateToMiniProgram: options => {
        miniProgramCalls.push({ method: 'navigateToMiniProgram', options: { ...options, success: undefined, fail: undefined } });
        options.success?.({ errMsg: 'navigateToMiniProgram:ok' });
    },
    openCustomerServiceChat: options => {
        miniProgramCalls.push({ method: 'openCustomerServiceChat', options: { ...options, success: undefined, fail: undefined } });
        options.success?.({ errMsg: 'openCustomerServiceChat:ok' });
    }
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
const functions = await server.ssrLoadModule('/src/uni_modules/snake-ui/libs/function/index.ts');
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
    assert.equal(storage.get('snake-ui-locale'), 'test');
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

test('test suite keeps snake semantics and covers the full validator set', () => {
    const { test: suite } = functions;
    // snake 原有 8 个校验器语义不变
    assert.equal(suite.email('a@b.com'), true);
    assert.equal(suite.mobile('13800138000'), true);
    assert.equal(suite.url('https://a.com'), true);
    assert.equal(suite.number('12.5'), true);
    assert.equal(suite.number('abc'), false);
    assert.equal(suite.string('x'), true);
    assert.equal(suite.object({}), true);
    assert.equal(suite.object([]), false);
    assert.equal(suite.array([]), true);
    assert.equal(suite.empty(''), true);
    assert.equal(suite.empty('0'), false);
    // 移植补齐的校验器
    assert.equal(suite.dateISO('2026-09-03'), true);
    assert.equal(suite.digits('123'), true);
    assert.equal(suite.digits('12.3'), false);
    assert.equal(suite.idCard('110101199003077258'), true);
    assert.equal(suite.carNo('京A12345'), true);
    assert.equal(suite.carNo('京AD12345'), true);
    assert.equal(suite.amount('1,234.50'), true);
    assert.equal(suite.chinese('中文'), true);
    assert.equal(suite.letter('abc'), true);
    assert.equal(suite.enOrNum('abc123'), true);
    assert.equal(suite.contains('hello', 'ell'), true);
    assert.equal(suite.range(5, [1, 10]), true);
    assert.equal(suite.rangeLength('abc', [2, 5]), true);
    assert.equal(suite.landline('010-12345678'), true);
    assert.equal(suite.jsonString('{"a":1}'), true);
    assert.equal(suite.code('123456'), true);
    assert.equal(suite.code('12345', 5), true);
    assert.equal(suite.func(() => {}), true);
    assert.equal(suite.promise(Promise.resolve()), true);
    assert.equal(suite.image('a.png?x=1'), true);
    assert.equal(suite.video('a.mp4'), true);
    assert.equal(suite.regExp(/a/), true);
    assert.equal(suite.isEmpty(null), true);
});

test('styleUtils merges css strings and objects in both directions', () => {
    assert.deepEqual(functions.mergeStyles('color: red', { backgroundColor: 'blue' }), {
        color: 'red',
        backgroundColor: 'blue'
    });
    assert.equal(functions.mergeCssStrings({ backgroundColor: '#fff' }, 'color:#000'), 'background-color: #fff; color: #000;');
});

test('$parent walks the instance chain by component name', () => {
    const chain = { type: { name: 'SnakeList' }, parent: { type: { name: 'SnakeForm' } } };
    assert.equal(functions.$parent('SnakeForm', chain), chain.parent);
    assert.equal(functions.$parent(undefined, chain), chain.parent);
    assert.equal(functions.$parent('Missing', chain), null);
    // uView 语义：数字 0 视为「未传」回落父组件值，false 视为「已传」覆盖
    const inherited = functions.getParent.call(
        { $parent: { $options: { name: 'SnakeList' }, gap: 10, bold: true } },
        'SnakeList',
        { gap: 0, bold: false }
    );
    assert.deepEqual(inherited, { gap: 10, bold: false });
});

test('route supports uView Pro aliases and URL parameter encoding', async () => {
    navigationCalls.length = 0;
    await functions.route('/pages/detail?source=home#summary', {
        id: 1,
        enabled: true,
        keyword: '蛇 UI',
        tag: ['new', 'hot'],
        omitted: undefined
    });
    await functions.route({ type: 'redirect', url: '/pages/login' });
    await functions.route({ type: 'tab', url: '/pages/example/components', params: { ignored: true } });
    await functions.route({ type: 'reLaunch', url: '/pages/start' });
    await functions.route({ type: 'back', delta: 2 });

    assert.deepEqual(
        navigationCalls.map(call => ({ method: call.method, options: call.options })),
        [
            {
                method: 'navigateTo',
                options: {
                    url: '/pages/detail?source=home&id=1&enabled=true&keyword=%E8%9B%87%20UI&tag=new&tag=hot#summary',
                    success: undefined,
                    fail: undefined
                }
            },
            {
                method: 'redirectTo',
                options: { url: '/pages/login', success: undefined, fail: undefined }
            },
            {
                method: 'switchTab',
                options: { url: '/pages/example/components', success: undefined, fail: undefined }
            },
            {
                method: 'reLaunch',
                options: { url: '/pages/start', success: undefined, fail: undefined }
            },
            {
                method: 'navigateBack',
                options: { delta: 2, success: undefined, fail: undefined }
            }
        ]
    );
});

test('route validates navigation input and reports platform failures', async () => {
    await assert.rejects(functions.route({ type: 'navigateTo' }), /requires a non-empty url/);
    await assert.rejects(functions.route({ type: 'unknown', url: '/pages/index' }), /Unsupported route type/);

    const navigateBack = uni.navigateBack;
    delete uni.navigateBack;
    await assert.rejects(functions.route({ type: 'back' }), /navigateBack is unavailable/);
    uni.navigateBack = navigateBack;

    const redirectTo = uni.redirectTo;
    uni.redirectTo = options => options.fail?.({ errMsg: 'redirectTo:fail blocked' });
    await assert.rejects(functions.route({ type: 'redirectTo', url: '/blocked' }), /redirectTo:fail blocked/);
    uni.redirectTo = redirectTo;
});

test('navTo preserves navigateTo to switchTab fallback', () => {
    navigationCalls.length = 0;
    failNextNavigateTo = true;
    functions.navTo('/pages/example/components');
    assert.deepEqual(
        navigationCalls.map(call => call.method),
        ['navigateTo', 'switchTab']
    );
});

test('navTo opens cross-mini-program and service-chat links without router fallthrough', () => {
    navigationCalls.length = 0;
    miniProgramCalls.length = 0;

    functions.navTo('/miniprogram?appId=wx123&path=pages%2Findex%2Findex&extra=%7B%22channel%22%3A%22x%22%7D');
    assert.equal(navigationCalls.length, 0, 'must not fall through to navigateTo');
    assert.equal(miniProgramCalls.length, 1);
    assert.equal(miniProgramCalls[0].method, 'navigateToMiniProgram');
    assert.deepEqual(miniProgramCalls[0].options, {
        appId: 'wx123',
        path: 'pages/index/index',
        extraData: { channel: 'x' },
        envVersion: 'release',
        success: undefined,
        fail: undefined
    });

    miniProgramCalls.length = 0;
    functions.navTo('/serviceChat?url=https%3A%2F%2Fwork.weixin.qq.com%2Fkfid%2Fabc&corpId=ww123');
    assert.equal(navigationCalls.length, 0, 'must not fall through to navigateTo');
    assert.equal(miniProgramCalls.length, 1);
    assert.equal(miniProgramCalls[0].method, 'openCustomerServiceChat');
    assert.deepEqual(miniProgramCalls[0].options, {
        extInfo: { url: 'https://work.weixin.qq.com/kfid/abc' },
        corpId: 'ww123',
        success: undefined,
        fail: undefined
    });
});

test('query and time helpers handle encoded and normalized values', () => {
    assert.deepEqual(functions.getQueryParams('/page?name=Snake+UI&empty=&encoded=%E8%9B%87'), {
        name: 'Snake UI',
        empty: '',
        encoded: '蛇'
    });

    const now = new Date('2026-08-20T12:00:00Z').getTime();
    assert.equal(functions.timeFrom((now - 30_000) / 1000, now), '刚刚');
    assert.equal(functions.timeFrom(now - 5 * 60_000, now), '5分钟前');
    assert.equal(functions.timeFrom(new Date(now - 2 * 3_600_000), now), '2小时前');
    assert.equal(functions.timeFrom(now - 3 * 86_400_000, now), '3天前');
    assert.equal(functions.timeFrom(now + 60_000, now), '刚刚');
    assert.equal(functions.timeFrom('not-a-date', now), '');
    assert.equal(functions.timeFrom((now - 31 * 86_400_000) / 1000, now), '2026-07-20');
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

test('theme variables are injected once at the page level via snake-config-provider', async () => {
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
    const injected = [];
    for (const file of await vueFiles(componentsRoot)) {
        const source = await readFile(file, 'utf8');
        if (source.includes('$snakeThemeStyle')) injected.push(file);
    }
    assert.equal(injected.length, 1);
    assert.ok(injected[0].endsWith('snake-config-provider.vue'));
});
