import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const foundationComponents = [
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

function exampleRoutes(pages) {
    return [...pages.matchAll(/"root":\s*"(pages\/components[AB])"[\s\S]*?"pages":\s*\[([\s\S]*?)\]\s*\}/g)].flatMap(
        ([, root, body]) => [...body.matchAll(/"path":\s*"([^"?]+)"/g)].map(match => `${root}/${match[1]}`)
    );
}

test('preview renderer uses an uncropped viewport root', async () => {
    const renderer = await readFile(resolve(root, 'src/demo/DemoRenderer.vue'), 'utf8');
    const page = await readFile(resolve(root, 'src/demo/DemoPage.vue'), 'utf8');

    assert.doesNotMatch(renderer, /DemoShell/);
    assert.doesNotMatch(renderer, /overflow:\s*hidden/);
    assert.doesNotMatch(renderer, /transform:\s*scale/);
    assert.match(page, /\.demo-page\s*{[^}]*min-height:\s*100vh/s);
    assert.match(page, /\.demo-page\s*{[^}]*box-sizing:\s*border-box/s);
});

test('component docs and example routes remain one-to-one', async () => {
    const pages = await readFile(resolve(root, 'src/pages.json'), 'utf8');
    const componentFiles = (await readdir(resolve(root, 'docs/components'))).filter(file => file.endsWith('.md'));
    const routes = exampleRoutes(pages);
    const previews = [];

    for (const file of componentFiles) {
        const markdown = await readFile(resolve(root, 'docs/components', file), 'utf8');
        const match = markdown.match(/^preview:\s*\/?([^\r\n]+)/m);
        if (match) previews.push(match[1]);
    }

    assert.equal(routes.length, 50);
    assert.equal(previews.length, 50);
    assert.deepEqual([...new Set(previews)].sort(), [...new Set(routes)].sort());
});

test('all public foundation components have docs, routes, and renderer branches', async () => {
    const pages = await readFile(resolve(root, 'src/pages.json'), 'utf8');
    const renderer = await readFile(resolve(root, 'src/demo/DemoRenderer.vue'), 'utf8');

    for (const name of foundationComponents) {
        const markdown = await readFile(resolve(root, 'docs/components', `${name}.md`), 'utf8');
        assert.match(markdown, new RegExp(`^preview:\\s*/pages/componentsA/${name}$`, 'm'));
        assert.match(pages, new RegExp(`"path":\\s*"${name}"`));
        assert.match(renderer, new RegExp(`kind === ['"]${name}['"]`));
    }
});

test('component overview page covers every example route and directory layout', async () => {
    const pages = await readFile(resolve(root, 'src/pages.json'), 'utf8');
    const config = await readFile(resolve(root, 'src/pages/index/components.config.ts'), 'utf8');
    const index = await readFile(resolve(root, 'src/pages/index/index.vue'), 'utf8');
    const groupA = await readdir(resolve(root, 'src/pages/componentsA'));
    const groupB = await readdir(resolve(root, 'src/pages/componentsB'));

    const configuredPaths = [...config.matchAll(/item\(\s*'(\/pages\/(?:components[AB])\/[^']+)'/g)].map(match =>
        match[1].replace(/^\//, '')
    );
    const routes = exampleRoutes(pages);

    assert.equal(configuredPaths.length, 50);
    assert.deepEqual([...configuredPaths].sort(), [...routes].sort());
    assert.equal(groupA.filter(file => file.endsWith('.vue')).length, 29);
    assert.equal(groupB.filter(file => file.endsWith('.vue')).length, 21);
    for (const group of [
        '基础组件',
        '表单组件',
        '展示组件',
        '反馈与浮层',
        '导航与布局',
        'CMS 内容',
        'CMS 营销',
        '商品业务'
    ]) {
        assert.match(config, new RegExp(`groupName: '${group}'`));
    }
    assert.match(config, /cms:\s*true|cms\s*\n?\s*}/);
    assert.match(index, /DemoPage/);
    assert.match(index, /:nav-back="false"/);
    assert.match(index, /:nav-home="false"/);
    assert.match(pages, /"path":\s*"pages\/index\/index"/);
    assert.match(pages, /"subPackages"/);
    assert.match(pages, /"root":\s*"pages\/componentsA"/);
    assert.match(pages, /"root":\s*"pages\/componentsB"/);
    assert.match(pages, /"navigationStyle":\s*"custom"/);
});

test('all example components declare an interactive demo configuration', async () => {
    const config = await readFile(resolve(root, 'src/demo/demo-config.ts'), 'utf8');
    const panel = await readFile(resolve(root, 'src/demo/DemoControlPanel.vue'), 'utf8');
    const renderer = await readFile(resolve(root, 'src/demo/DemoRenderer.vue'), 'utf8');

    const configuredKinds = [...config.matchAll(/^\s+(?:'([^']+)'|([a-z][\w-]*)):\s*\{\s*category:/gm)].map(
        match => match[1] || match[2]
    );
    assert.equal(configuredKinds.length, 50);
    assert.match(panel, /control\.type === 'select'/);
    assert.match(panel, /control\.type === 'switch'/);
    assert.match(panel, /control\.type === 'slider'/);
    assert.match(panel, /demo-control__input/);
    assert.match(renderer, /<DemoControlPanel/);
});
test('desktop phone preview keeps an uncropped internal viewport', async () => {
    const frame = await readFile(resolve(root, 'docs/.vitepress/theme/PreviewFrame.vue'), 'utf8');
    const css = await readFile(resolve(root, 'docs/.vitepress/theme/custom.css'), 'utf8');

    assert.match(frame, /scrolling=["']auto["']/);
    assert.doesNotMatch(css, /\.VPDoc\.has-aside \.aside-container\s*,\s*\n\s*\.VPDoc\.has-aside \.aside-curtain/);
    assert.match(css, /--preview-phone-width:/);
    assert.match(css, /aspect-ratio:\s*70\.9\s*\/\s*143\.6/);
    assert.match(css, /100vh/);
    assert.doesNotMatch(css, /\.preview-phone\s*{[^}]*height:\s*650px/s);
});

test('compact layout preserves the native page outline and dimensions', async () => {
    const layout = await readFile(resolve(root, 'docs/.vitepress/theme/Layout.vue'), 'utf8');
    const css = await readFile(resolve(root, 'docs/.vitepress/theme/custom.css'), 'utf8');

    assert.match(layout, /#layout-bottom><PreviewFrame\s*\/><\/template>/);
    assert.doesNotMatch(layout, /#aside-top><PreviewFrame\s*\/><\/template>/);
    assert.match(css, /--vp-sidebar-width:\s*240px/);
    assert.match(css, /max-width:\s*680px/);
    assert.match(css, /--preview-phone-width:\s*calc\(395px/);
    assert.match(css, /transform:\s*scale\(var\(--preview-scale/);
});

test('desktop phone preview is fixed to the outer page edge like uView2', async () => {
    const layout = await readFile(resolve(root, 'docs/.vitepress/theme/Layout.vue'), 'utf8');
    const css = await readFile(resolve(root, 'docs/.vitepress/theme/custom.css'), 'utf8');

    assert.match(layout, /#layout-bottom><PreviewFrame\s*\/><\/template>/);
    assert.doesNotMatch(layout, /#aside-(?:top|outline-after)><PreviewFrame\s*\/><\/template>/);
    assert.match(css, /\.preview-panel\s*{[^}]*position:\s*fixed/s);
    assert.match(css, /right:\s*20px/);
    assert.match(css, /right:\s*30px/);
    assert.match(css, /right:\s*max\(0px,\s*calc\(\(100vw\s*-\s*1680px\)\s*\/\s*2\)\)/);
    assert.doesNotMatch(css, /\.VPDoc\.has-aside \.aside-container\s*,\s*\n\s*\.VPDoc\.has-aside \.aside-curtain/);
});

test('preview pages keep independent content, outline, and phone columns', async () => {
    const layout = await readFile(resolve(root, 'docs/.vitepress/theme/Layout.vue'), 'utf8');
    const css = await readFile(resolve(root, 'docs/.vitepress/theme/custom.css'), 'utf8');

    assert.match(layout, /useData\(\)/);
    assert.match(layout, /snake-preview-layout/);
    assert.match(layout, /frontmatter\.value\.preview/);
    assert.doesNotMatch(css, /\.snake-preview-layout \.VPDoc\.has-aside \.aside\s*{[^}]*display:\s*none/s);
    assert.match(css, /\.snake-preview-layout \.VPDoc\.has-aside \.aside\s*{[^}]*max-width:\s*190px/s);
    assert.match(
        css,
        /\.snake-preview-layout \.VPDoc\.has-aside \.aside-container\s*,\s*\.snake-preview-layout \.VPDoc\.has-aside \.aside-curtain\s*{[^}]*width:\s*164px/s
    );
    assert.match(css, /\.snake-preview-layout \.VPDoc \.content\s*{[^}]*min-width:\s*0/s);
    assert.match(css, /--preview-reserved-space:/);
    assert.match(
        css,
        /\.snake-preview-layout \.VPContent\.has-sidebar\s*{[^}]*padding-right:\s*var\(--preview-reserved-space\)/s
    );
    assert.doesNotMatch(
        css,
        /\.snake-preview-layout \.VPDoc\s*{[^}]*padding-right:\s*var\(--preview-reserved-space\)/s
    );
});

test('development preview follows the docs host for LAN access', async () => {
    const frame = await readFile(resolve(root, 'docs/.vitepress/theme/PreviewFrame.vue'), 'utf8');

    assert.match(frame, /window\.location\.hostname/);
    assert.match(frame, /window\.location\.protocol/);
    assert.match(frame, /localhost'\s*\?\s*'127\.0\.0\.1'/);
    assert.doesNotMatch(frame, /http:\/\/localhost:5173\/preview\//);
});
