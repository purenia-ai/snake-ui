import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = new URL('../src/uni_modules/snake-ui/', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');

async function sourceFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(
        entries.map(entry => {
            const path = join(directory, entry.name);
            if (entry.isDirectory()) return sourceFiles(path);
            return ['.ts', '.vue', '.scss'].includes(extname(path)) ? [path] : [];
        })
    );
    return nested.flat();
}

test('library follows the function, hooks, css and component entry conventions', async () => {
    const libs = await readdir(new URL('libs/', root));
    assert.ok(libs.includes('function'));
    assert.ok(libs.includes('hooks'));
    assert.ok(libs.includes('css'));
    assert.ok(!libs.includes('functions'));
    assert.ok(!libs.includes('styles'));
    assert.ok(!libs.includes('platform.ts'));
    assert.ok(!libs.includes('unit.ts'));

    const functionFiles = await readdir(new URL('libs/function/', root));
    for (const file of [
        'unit.ts',
        'timeFrom.ts',
        'color.ts',
        'deepClone.ts',
        'deepMerge.ts',
        'debounce.ts',
        'throttle.ts',
        'random.ts',
        'randomArray.ts',
        'trim.ts',
        'test.ts',
        'style.ts',
        'format.ts',
        'clipboard.ts',
        'system.ts',
        'type2icon.ts',
        'emitter.ts'
    ]) {
        assert.ok(functionFiles.includes(file), `missing function module: ${file}`);
    }

    const hookEntry = await read('libs/hooks/index.ts');
    for (const hook of [
        'useRect',
        'useParent',
        'useChildren',
        'useTheme',
        'useColor',
        'useLocale',
        'useDebounce',
        'useThrottle',
        'useToast',
        'useModal'
    ]) {
        await access(new URL(`libs/hooks/${hook}.ts`, root));
        assert.match(hookEntry, new RegExp(`\\./${hook}`));
    }

    const componentEntries = await readdir(new URL('components/', root), { withFileTypes: true });
    for (const entry of componentEntries.filter(entry => entry.isDirectory())) {
        await access(new URL(`components/${entry.name}/${entry.name}.vue`, root));
    }
    await access(new URL('components/snake-filter-sorts/filter-page.vue', root));
});

test('components use narrow internal imports and old directory references are gone', async () => {
    const componentRoot = new URL('components/', root);
    const components = await sourceFiles(fileURLToPath(componentRoot));
    const broadImports = [];
    for (const file of components) {
        const source = await readFile(file, 'utf8');
        if (/from ['"](?:\.\.\/)+libs['"]/.test(source)) broadImports.push(file);
    }
    assert.deepEqual(broadImports, []);

    const files = await sourceFiles(fileURLToPath(root));
    const legacyReferences = [];
    for (const file of files) {
        const source = await readFile(file, 'utf8');
        if (/libs\/(?:functions|styles)|from ['"][^'"]*(?:\/|^)functions['"]/.test(source)) {
            legacyReferences.push(file);
        }
    }
    assert.deepEqual(legacyReferences, []);
});

test('useChildren does not import Vue runtime helpers unavailable in mini-program builds', async () => {
    const source = await read('libs/hooks/useChildren.ts');
    assert.doesNotMatch(source, /\bisVNode\s*,/);
    assert.match(source, /const isVNode = \(value: unknown\): value is VNode/);
    assert.match(source, /__v_isVNode/);
});

test('type declarations have one authoritative component entry', async () => {
    const [entry, types, uniApp, manifestRaw] = await Promise.all([
        read('index.ts'),
        read('types/index.d.ts'),
        read('types/uni-app.d.ts'),
        read('package.json')
    ]);
    const manifest = JSON.parse(manifestRaw);
    // 源码即声明：入口不再维护 index.d.ts，也不声明独立 types 入口
    assert.equal(manifest.types, undefined);
    assert.equal(manifest.exports['.'].types, undefined);
    assert.equal(manifest.files.includes('index.d.ts'), false);
    // 组件类型经入口源码转发，是唯一的权威出口
    assert.match(entry, /export \* from '\.\/components\/snake-button\/types'/);
    assert.match(entry, /export \* from '\.\/components\/snake-navbar\/types'/);
    // 环境声明随入口源码加载；声明文件里不得重复声明（重复会导致接口合并冲突）
    assert.match(entry, /import type \{ SnakeGlobalAPI \} from '\.\/types\/uni-app';/);
    assert.match(entry, /interface Uni\s*\{\s*\$snake: SnakeGlobalAPI;/);
    assert.match(
        entry,
        /interface ComponentCustomProperties\s*\{\s*\$snake: SnakeGlobalAPI;\s*\$themeStyle: Readonly<Record<string, string>>;/
    );
    assert.doesNotMatch(uniApp, /declare global/);
    assert.match(uniApp, /export interface SnakeGlobalAPI extends FoundationAPI/);
    assert.match(types, /export \* from '.\/components'/);
});

test('package exports and published files cover documented entry points', async () => {
    const manifest = JSON.parse(await read('package.json'));
    for (const key of [
        '.',
        './components/*',
        './libs',
        './types',
        './plugins',
        './locale',
        './index.scss',
        './theme.scss'
    ]) {
        assert.ok(manifest.exports[key], `missing export: ${key}`);
    }
    // 深路径工具函数（libs/function/* 等）是宿主直接引用的公开入口，保留通配子路径
    assert.equal(manifest.exports['./libs/*'], './libs/*');
    assert.deepEqual(
        Object.keys(manifest.exports)
            .filter(key => key.includes('*'))
            .sort(),
        [
            './components/*',
            './libs/*',
            './libs/cms/*',
            './libs/config/*',
            './libs/function/*',
            './libs/hooks/*',
            './locale/*',
            './plugins/*',
            './types/*'
        ]
    );
    for (const file of ['components', 'libs', 'locale', 'plugins', 'types', 'iconfont.css']) {
        assert.ok(manifest.files.includes(file), `missing published file: ${file}`);
    }
    assert.equal(manifest.files.includes('iconfont.woff2'), false);
});

test('runtime version constant tracks the published package version', async () => {
    const manifest = JSON.parse(await read('package.json'));
    const state = await read('libs/config/state.ts');

    assert.match(state, new RegExp(`SNAKE_UI_VERSION = '${manifest.version.replaceAll('.', '\\.')}'`));
});
