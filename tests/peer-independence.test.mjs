import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');
const sourceRoot = resolve(root, 'src');

// 旧运行时标识模式（拼串书写，避免本文件源码出现第三方库名）。
const legacyPeerPattern = new RegExp(`${['u', 'view'].join('')}-pro|uni\\.\\$u|(?:^|[^\\w])\\$u\\.|<\\/?u-[a-z]`, 'i');

async function sourceFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(
        entries.map(entry => {
            const path = join(directory, entry.name);
            if (entry.isDirectory()) return sourceFiles(path);
            return ['.vue', '.ts', '.scss', '.json'].includes(extname(path)) ? [path] : [];
        })
    );
    return nested.flat();
}

test('runtime source and package metadata stay independent from the legacy peer library', async () => {
    const files = await sourceFiles(sourceRoot);
    files.push(resolve(root, 'package.json'), resolve(root, 'pnpm-lock.yaml'));
    const violations = [];

    for (const file of files) {
        const source = await readFile(file, 'utf8');
        if (legacyPeerPattern.test(source)) {
            violations.push(file.replace(`${root}\\`, ''));
        }
    }

    assert.deepEqual(violations, []);
});

test('all replacement primitives are public components resolved via easycom', async () => {
    const names = ['button', 'empty', 'icon', 'image', 'loadmore', 'notice-bar', 'overlay', 'popup', 'sticky', 'swiper', 'tabs'];
    const entry = await readFile(resolve(root, 'src/uni_modules/snake-ui/index.ts'), 'utf8');
    const pagesJson = await readFile(resolve(root, 'src/pages.json'), 'utf8');

    // 组件通过 easycom 暴露为公共组件，桶入口只导出 types，不再 re-export .vue。
    assert.match(pagesJson, /\^snake-/);
    assert.doesNotMatch(entry, /\.vue'/);

    for (const name of names) {
        const file = resolve(root, `src/uni_modules/snake-ui/components/snake-${name}/snake-${name}.vue`);
        assert.ok((await readFile(file, 'utf8')).includes('<template>'), `missing template: snake-${name}`);
        assert.match(entry, new RegExp(`export \\* from './components/snake-${name}/types'`), `snake-${name}: missing type export`);
    }
});
