import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';
import {
    cmsComponentItems,
    componentItems,
    foundationComponentItems
} from '../docs/.vitepress/component-groups.ts';

const root = resolve(import.meta.dirname, '..');
const toDocumentName = item => item.link.slice('/components/'.length);
const toComponentDirectory = item => {
    const documentName = toDocumentName(item);
    return documentName.startsWith('snake-') ? documentName : `snake-${documentName}`;
};
const foundation = foundationComponentItems.map(toDocumentName);
const cms = cmsComponentItems.map(toDocumentName);

async function document(name) {
    return readFile(resolve(root, 'docs/components', `${name}.md`), 'utf8');
}

test('all component docs contain the common detailed sections', async () => {
    for (const name of [...foundation, ...cms]) {
        const markdown = await document(name);
        assert.match(markdown, /^#\s+.+/m, `${name}: title`);
        assert.match(markdown, /^## 平台兼容性$/m, `${name}: compatibility`);
        assert.match(markdown, /^## (?:基础|基本)用法$/m, `${name}: basic usage`);
        assert.match(markdown, /^## API$/m, `${name}: API`);
        assert.match(
            markdown,
            /\|\s*(?:名称|参数)\s*\|\s*说明\s*\|\s*类型\s*\|\s*默认值\s*\|(?:\s*可选值\s*\|)?|没有 Props/,
            `${name}: complete props table or explicit no-props statement`
        );
        assert.match(markdown, /源码：`src\/uni_modules\/snake-ui\/components\//, `${name}: source path`);
    }
});

test('component registry is the complete public component source of truth', async () => {
    assert.equal(componentItems.length, 58);
    assert.equal(foundation.length, 37);
    assert.equal(cms.length, 21);
    assert.equal(new Set(componentItems.map(item => item.link)).size, componentItems.length);

    const packageEntry = await readFile(resolve(root, 'src/uni_modules/snake-ui/index.ts'), 'utf8');
    for (const item of componentItems) {
        const componentDirectory = toComponentDirectory(item);
        assert.match(packageEntry, new RegExp(`export \\* from './components/${componentDirectory}/types'`), item.name);
    }
});

test('CMS metadata and title badges are applied only to CMS documents', async () => {
    for (const name of cms) {
        const markdown = await document(name);
        assert.match(markdown, /^cms:\s*true$/m, `${name}: cms metadata`);
        assert.match(markdown, /^#\s+.+<span class="cms-badge">CMS<\/span>\s*$/m, `${name}: title badge`);
    }
    for (const name of foundation) {
        const markdown = await document(name);
        assert.doesNotMatch(markdown, /^cms:\s*true$/m, `${name}: no cms metadata`);
        assert.doesNotMatch(markdown, /cms-badge/, `${name}: no cms badge`);
    }
});

test('component docs describe the Snake UI runtime instead of removed uView APIs', async () => {
    for (const name of [...foundation, ...cms]) {
        const markdown = await document(name);
        assert.doesNotMatch(
            markdown,
            /uni\.\$u\b|\$u\.addUnit|`u-(?:icon|popup|swiper|image|lazy-load|notice-bar)`/,
            `${name}: removed uView runtime reference`
        );
    }
});

test('icon documentation renders the bundled glyph gallery inline', async () => {
    const markdown = await document('icon');
    const gallery = await readFile(resolve(root, 'docs/.vitepress/components/IconGallery.vue'), 'utf8');
    const theme = await readFile(resolve(root, 'docs/.vitepress/theme/index.ts'), 'utf8');
    const config = await readFile(resolve(root, 'docs/.vitepress/config.mts'), 'utf8');

    assert.match(markdown, /## 图标集\s+<IconGallery \/>/);
    assert.match(theme, /app\.component\('IconGallery', IconGallery\)/);
    assert.match(gallery, /src\/uni_modules\/snake-ui\/iconfont\.css/);
    assert.match(gallery, /navigator\.clipboard\.writeText\(name\)/);
    assert.match(gallery, /v-for="name in iconNames"/);
    assert.match(config, /fs:\s*{\s*allow: \['\.\.'\]/);
});

test('every component page renders release metadata from the component registry', async () => {
    const layout = await readFile(resolve(root, 'docs/.vitepress/theme/Layout.vue'), 'utf8');
    const metadata = await readFile(resolve(root, 'docs/.vitepress/theme/ComponentReferenceMeta.vue'), 'utf8');
    const styles = await readFile(resolve(root, 'docs/.vitepress/theme/custom.css'), 'utf8');

    assert.match(layout, /#doc-after><ComponentReferenceMeta\s*\/><\/template>/);
    assert.match(metadata, /componentItems\.find/);
    assert.match(metadata, /最低版本/);
    assert.match(metadata, /Props 类型/);
    assert.match(metadata, /github\.com\/zwbcode\/snake-ui\/blob\/main/);
    assert.match(styles, /\.component-reference-meta/);
});
