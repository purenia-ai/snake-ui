import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';
import { componentGroups, componentItems } from '../docs/.vitepress/component-groups.ts';

const root = resolve(import.meta.dirname, '..');
const toDocumentName = item => item.link.slice('/components/'.length);
const toComponentDirectories = item => {
    const documentName = toDocumentName(item);
    if (documentName === 'cell') return ['snake-cell-group', 'snake-cell-item'];
    return documentName.startsWith('snake-') ? documentName : `snake-${documentName}`;
};
const components = componentItems.map(toDocumentName);
const standardizedDocs = [
    'button',
    'input',
    'form',
    'popup',
    'upload',
    'checkbox',
    'radio',
    'switch',
    'select',
    'calendar',
    'overlay',
    'notice-bar',
    'empty',
    'loading-icon',
    'skeleton',
    'navbar',
    'tabbar',
    'tabs',
    'subsection',
    'sticky',
    'swiper',
    'line',
    'cell',
    'button-sort',
    'drop-menu',
    'index-list',
    'index-list-panel',
    'index-anchor',
    'count-down',
    'line-progress',
    'slider',
    'loadmore',
    'no-network',
    'read-more',
    'transition',
    'root-portal',
    'config-provider',
    'icon',
    'image',
    'lazy-image',
    'text',
    'link',
    'textarea',
    'search'
];
const undocumentedCmsComponents = [
    'activity-list',
    'auxiliary-segmentation',
    'commodity-search',
    'coupon',
    'custom-module',
    'filter-sorts',
    'floating-bubble',
    'follow',
    'goods-list',
    'graphic-navigation',
    'images',
    'jump-applet',
    'list-switching',
    'magic-cube',
    'notice',
    'page-popup',
    'picture-ads',
    'rich-text',
    'videos'
];

async function document(name) {
    return readFile(resolve(root, 'docs/components', `${name}.md`), 'utf8');
}

test('all component docs contain the common detailed sections', async () => {
    for (const name of components) {
        const markdown = await document(name);
        if (name === 'button') {
            assert.match(markdown, /^## 平台兼容性$/m, `${name}: compatibility`);
            assert.match(markdown, /^## 基础用法$/m, `${name}: basic usage`);
            assert.match(markdown, /^## API$/m, `${name}: API`);
            assert.match(markdown, /\|\s*参数\s*\|\s*说明\s*\|\s*类型\s*\|\s*默认值\s*\|/, `${name}: props table`);
            assert.match(markdown, /^### Slots$/m, `${name}: slots`);
            assert.match(markdown, /^## 主题变量$/m, `${name}: theme variables`);
            assert.doesNotMatch(markdown, /源码：/, `${name}: no source path`);
            continue;
        }
        assert.match(markdown, /^#\s+.+/m, `${name}: title`);
        assert.match(markdown, /^## 平台兼容性$/m, `${name}: compatibility`);
        assert.match(markdown, /^## (?:基础|基本)用法$/m, `${name}: basic usage`);
        assert.match(markdown, /^## API$/m, `${name}: API`);
        assert.match(
            markdown,
            /\|\s*(?:名称|参数)\s*\|\s*说明\s*\|\s*类型\s*\|\s*默认值\s*\|(?:\s*可选值\s*\|)?|没有 Props/,
            `${name}: complete props table or explicit no-props statement`
        );
        assert.doesNotMatch(markdown, /源码：/, `${name}: no source path`);
    }
});

test('high-use component docs follow the standard documentation shape', async () => {
    assert.deepEqual(
        [...standardizedDocs].sort(),
        componentItems.map(toDocumentName).sort(),
        'every public component doc is covered by the standard'
    );

    for (const name of standardizedDocs) {
        const markdown = await document(name);
        assert.match(markdown, /^## 平台兼容性$/m, `${name}: compatibility`);
        assert.match(
            markdown,
            /\|\s*H5\s*\|\s*App\s*\|\s*微信小程序\s*\|\s*支付宝小程序\s*\|/,
            `${name}: platform table`
        );
        assert.match(
            markdown,
            /\|\s*(?:√|—)\s*\|\s*(?:√|—)\s*\|\s*(?:√|—)\s*\|\s*(?:√|—)\s*\|/,
            `${name}: platform support matrix`
        );
        assert.doesNotMatch(markdown, /QQ 小程序/, `${name}: omitted QQ Mini Program`);
        assert.match(markdown, /^## (?:基础|基本)用法$/m, `${name}: basic usage`);
        assert.match(markdown, /^## API$/m, `${name}: API`);
        assert.match(markdown, /^#{3,4} (?:Form )?Props$/m, `${name}: props`);
        assert.match(markdown, /^## 主题变量$/m, `${name}: theme variables`);
        assert.doesNotMatch(markdown, /^## (?:何时使用|无障碍)$/m, `${name}: omitted sections`);
        assert.doesNotMatch(markdown, /源码：/, `${name}: no source path`);
    }

    for (const name of [
        'button',
        'input',
        'popup',
        'upload',
        'checkbox',
        'radio',
        'switch',
        'select',
        'calendar',
        'overlay',
        'notice-bar',
        'navbar',
        'tabbar',
        'tabs',
        'subsection',
        'sticky',
        'swiper',
        'cell',
        'button-sort',
        'drop-menu',
        'index-list',
        'index-list-panel',
        'count-down',
        'slider',
        'loadmore',
        'no-network',
        'read-more',
        'transition',
        'config-provider',
        'icon',
        'image',
        'lazy-image',
        'text',
        'link',
        'textarea',
        'search'
    ]) {
        const markdown = await document(name);
        assert.match(markdown, /^#{3,4} Events$/m, `${name}: events`);
    }

    for (const name of [
        'button',
        'input',
        'popup',
        'upload',
        'checkbox',
        'radio',
        'calendar',
        'overlay',
        'empty',
        'skeleton',
        'navbar',
        'sticky',
        'swiper',
        'cell',
        'drop-menu',
        'index-list',
        'index-list-panel',
        'index-anchor',
        'line-progress',
        'slider',
        'read-more',
        'transition',
        'root-portal',
        'config-provider',
        'image',
        'lazy-image',
        'text',
        'link'
    ]) {
        assert.match(await document(name), /^#{3,4} Slots$/m, `${name}: slots`);
    }

    assert.match(await document('form'), /^### Form Expose$/m);
    assert.match(await document('form'), /^### FormItem Slots$/m);
    assert.match(await document('popup'), /^### Expose$/m);
    assert.match(await document('upload'), /^### Methods$/m);
    assert.match(await document('tabs'), /^### Methods$/m);
    assert.match(await document('sticky'), /^### Expose$/m);
    assert.match(await document('drop-menu'), /^#### Expose$/m);
    for (const name of ['index-list', 'index-list-panel', 'count-down', 'slider', 'no-network', 'read-more']) {
        assert.match(await document(name), /^### (?:Expose|Methods)$/m, `${name}: exposed methods`);
    }
});

test('component registry is the complete documented component source of truth', async () => {
    assert.equal(componentItems.length, 44);
    assert.equal(new Set(componentItems.map(item => item.link)).size, componentItems.length);

    const packageEntry = await readFile(resolve(root, 'src/uni_modules/snake-ui/index.ts'), 'utf8');
    for (const item of componentItems) {
        const componentDirectories = toComponentDirectories(item);
        for (const componentDirectory of Array.isArray(componentDirectories)
            ? componentDirectories
            : [componentDirectories]) {
            assert.match(
                packageEntry,
                new RegExp(`export \\* from './components/${componentDirectory}/types'`),
                item.name
            );
        }
    }

    for (const name of undocumentedCmsComponents) {
        await assert.rejects(document(name), { code: 'ENOENT' });
        await readFile(resolve(root, 'src/uni_modules/snake-ui/components', `snake-${name}`, `snake-${name}.vue`));
        assert.match(packageEntry, new RegExp(`export \\* from './components/snake-${name}/types'`), name);
    }
});

test('component registry groups follow the standard bucket taxonomy', () => {
    assert.deepEqual(
        componentGroups.map(group => group.title),
        ['基础组件', '表单组件', '数据组件', '反馈组件', '布局组件', '导航组件']
    );

    const groupOf = link => componentGroups.find(group => group.items.some(item => item.link === link)).title;
    assert.equal(groupOf('/components/swiper'), '布局组件');
    assert.equal(groupOf('/components/count-down'), '数据组件');
    assert.equal(groupOf('/components/navbar'), '导航组件');
    assert.equal(groupOf('/components/tabbar'), '导航组件');
});

test('changelog inventory stays in lock-step with the registry', async () => {
    const changelog = await readFile(resolve(root, 'docs/components/changelog.md'), 'utf8');
    assert.doesNotMatch(changelog, /内测|尚未正式发布/, 'changelog: no internal-testing copy');

    for (const group of componentGroups) {
        assert.match(changelog, new RegExp(`${group.title}（${group.items.length}）`), `${group.title}: count header`);
    }
    for (const item of componentItems) {
        assert.ok(changelog.includes(item.name), `${item.name}: listed in changelog`);
    }
});

test('component sidebar no longer treats the CMS container as a component entry', async () => {
    const css = await readFile(resolve(root, 'docs/.vitepress/theme/custom.css'), 'utf8');
    assert.doesNotMatch(css, /components\/snake-cms/);
    assert.ok(!componentItems.some(item => item.link === '/components/snake-cms'));
});

test('component documents do not use CMS metadata or title badges', async () => {
    for (const name of components) {
        const markdown = await document(name);
        assert.doesNotMatch(markdown, /^cms:\s*true$/m, `${name}: no cms metadata`);
        assert.doesNotMatch(markdown, /cms-badge/, `${name}: no cms badge`);
    }
});

test('component docs describe the Snake UI runtime instead of removed uView APIs', async () => {
    for (const name of components) {
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
