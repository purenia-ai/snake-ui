import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');
const foundation = [
    'button',
    'loading-icon',
    'transition',
    'empty',
    'icon',
    'image',
    'lazy-image',
    'loadmore',
    'notice-bar',
    'overlay',
    'popup',
    'sticky',
    'swiper',
    'tabs',
    'subsection',
    'button-sort',
    'drop-menu',
    'drop-menu-item',
    'index-list',
    'index-anchor',
    'form',
    'form-item',
    'input',
    'textarea',
    'checkbox',
    'checkbox-group',
    'radio',
    'radio-group',
    'switch',
    'slider'
];
const cms = [
    'snake-cms',
    'custom-module',
    'images',
    'hotzone',
    'picture-ads',
    'magic-cube',
    'videos',
    'rich-text',
    'notice',
    'auxiliary-segmentation',
    'graphic-navigation',
    'commodity-search',
    'suspension',
    'page-popup',
    'jump-applet',
    'follow',
    'goods-list',
    'activity-list',
    'filter-sorts',
    'list-switching',
    'coupon'
];

async function document(name) {
    return readFile(resolve(root, 'docs/components', `${name}.md`), 'utf8');
}

test('all component docs contain the common detailed sections', async () => {
    for (const name of [...foundation, ...cms]) {
        const markdown = await document(name);
        assert.match(markdown, /^#\s+.+/m, `${name}: title`);
        assert.match(markdown, /^## 平台兼容性$/m, `${name}: compatibility`);
        assert.match(markdown, /^## 基础用法$/m, `${name}: basic usage`);
        assert.match(markdown, /^## API$/m, `${name}: API`);
        assert.match(
            markdown,
            /\|\s*(?:名称|参数)\s*\|\s*说明\s*\|\s*类型\s*\|\s*默认值\s*\|(?:\s*可选值\s*\|)?|没有 Props/,
            `${name}: complete props table or explicit no-props statement`
        );
        assert.match(markdown, /源码：`src\/uni_modules\/snake-ui\/components\//, `${name}: source path`);
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
