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
        'platform.ts',
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
        'useEmitter',
        'useRect',
        'useCompRelation',
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
    await access(new URL('components/snake-filter-sorts/components/filter-page.vue', root));
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

test('type declarations have one authoritative component entry', async () => {
    const [entry, types, components, uniApp] = await Promise.all([
        read('index.d.ts'),
        read('types/index.d.ts'),
        read('types/components.d.ts'),
        read('types/uni-app.d.ts')
    ]);
    assert.match(entry, /export \* from '.\/types'/);
    assert.match(types, /export \* from '.\/components'/);
    assert.match(components, /export const SnakeButton:/);
    assert.match(components, /export const SnakeNavbar:/);
    assert.match(uniApp, /\$snake: GlobalAPI/);
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
    assert.equal(manifest.exports['./libs/*'], undefined);
    for (const file of ['components', 'libs', 'locale', 'plugins', 'types', 'iconfont.css', 'iconfont.woff2']) {
        assert.ok(manifest.files.includes(file), `missing published file: ${file}`);
    }
});
