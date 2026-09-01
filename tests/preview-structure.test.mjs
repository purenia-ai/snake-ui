import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
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

function exampleRoutes(pages) {
    return [...pages.matchAll(/"root":\s*"(pages\/components[AB])"[\s\S]*?"pages":\s*\[([\s\S]*?)\]\s*\}/g)].flatMap(
        ([, root, body]) => [...body.matchAll(/"path":\s*"([^"?]+)"/g)].map(match => `${root}/${match[1]}`)
    );
}

const componentRouteName = name => name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

test('preview renderer uses an uncropped viewport root', async () => {
    const renderer = await readFile(resolve(root, 'src/demo/DemoRenderer.vue'), 'utf8');
    const page = await readFile(resolve(root, 'src/components/demo-page/demo-page.vue'), 'utf8');
    assert.ok(page.includes('background-color: var(--snake-color-surface)'));

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

    assert.equal(routes.length, 52);
    assert.equal(previews.length, 52);
    assert.deepEqual([...new Set(previews)].sort(), [...new Set(routes)].sort());
});

test('all public foundation components have docs, routes, and preview pages', async () => {
    const pages = await readFile(resolve(root, 'src/pages.json'), 'utf8');

    for (const name of foundationComponents) {
        const routeName = componentRouteName(name);
        const markdown = await readFile(resolve(root, 'docs/components', `${name}.md`), 'utf8');
        const previewPage = await readFile(resolve(root, 'src/pages/componentsA', routeName, 'index.vue'), 'utf8');
        assert.match(markdown, new RegExp(`^preview:\\s*/pages/componentsA/${routeName}/index$`, 'm'));
        assert.match(pages, new RegExp(`"path":\\s*"${routeName}/index"`));
        assert.match(previewPage, /DemoRenderer|<snake-/, `${name}: missing preview content`);
    }
});

test('component overview page covers every example route and directory layout', async () => {
    const pages = await readFile(resolve(root, 'src/pages.json'), 'utf8');
    const config = await readFile(resolve(root, 'src/pages/example/components.config.ts'), 'utf8');
    const index = await readFile(resolve(root, 'src/pages/example/components.vue'), 'utf8');
    const groupA = await readdir(resolve(root, 'src/pages/componentsA'));
    const groupB = await readdir(resolve(root, 'src/pages/componentsB'));

    const configuredPaths = [...config.matchAll(/item\(\s*'(\/pages\/(?:components[AB])\/[^']+)'/g)].map(match =>
        match[1].replace(/^\//, '')
    );
    const routes = exampleRoutes(pages);

    assert.equal(configuredPaths.length, 52);
    assert.deepEqual([...configuredPaths].sort(), [...routes].sort());
    assert.equal(groupA.length, 31);
    assert.equal(groupB.length, 21);
    for (const directory of [
        ...groupA.map(name => ['componentsA', name]),
        ...groupB.map(name => ['componentsB', name])
    ]) {
        await access(resolve(root, 'src/pages', directory[0], directory[1], 'index.vue'));
    }
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
    assert.match(pages, /"path":\s*"pages\/example\/components"/);
    assert.match(pages, /"subPackages"/);
    assert.match(pages, /"root":\s*"pages\/componentsA"/);
    assert.match(pages, /"root":\s*"pages\/componentsB"/);
    assert.match(pages, /"navigationStyle":\s*"custom"/);
});

test('all example components declare an interactive demo configuration', async () => {
    const config = await readFile(resolve(root, 'src/demo/demo-config.ts'), 'utf8');
    const panel = await readFile(resolve(root, 'src/components/demo-control-panel/demo-control-panel.vue'), 'utf8');
    const renderer = await readFile(resolve(root, 'src/demo/DemoRenderer.vue'), 'utf8');

    const configuredKinds = [...config.matchAll(/^\s+(?:'([^']+)'|([a-z][\w-]*)):\s*\{\s*category:/gm)].map(
        match => match[1] || match[2]
    );
    assert.equal(configuredKinds.length, 52);
    assert.match(panel, /control\.type === 'select'/);
    assert.match(panel, /control\.type === 'switch'/);
    assert.match(panel, /control\.type === 'slider'/);
    assert.match(panel, /demo-control__input/);
    assert.match(renderer, /<DemoControlPanel/);
});

test('component demos use one restrained shared presentation system', async () => {
    const theme = await readFile(resolve(root, 'src/common/demo.scss'), 'utf8');
    const page = await readFile(resolve(root, 'src/components/demo-page/demo-page.vue'), 'utf8');
    const section = await readFile(resolve(root, 'src/components/demo-section/demo-section.vue'), 'utf8');
    const panel = await readFile(resolve(root, 'src/components/demo-control-panel/demo-control-panel.vue'), 'utf8');
    const renderer = await readFile(resolve(root, 'src/demo/DemoRenderer.vue'), 'utf8');

    assert.match(theme, /--snake-demo-nav-background:\s*var\(--snake-color-primary/);
    assert.doesNotMatch(theme, /snake-demo-nav-gradient|snake-demo-page-tint|snake-demo-card-shadow/);
    assert.match(page, /demo-page-header__title/);
    assert.ok(page.includes('--snake-demo-nav-background'));
    assert.doesNotMatch(page, /background-image:\s*\$snake-page-tint/);
    assert.match(section, /DemoSectionVariant = 'default' \| 'preview' \| 'controls'/);
    assert.match(section, /demo-section--preview[^}]*border-bottom:\s*1rpx dashed/s);
    assert.match(panel, /<snake-subsection/);
    assert.match(panel, /:current="selectedIndex\(control\)"/);
    assert.match(panel, /@change="selectOption\(control, \$event\)"/);
    assert.match(panel, /v-else-if="control\.type === 'input'"/);
    assert.match(renderer, /variant="preview"/);
    assert.match(renderer, /definition\.controls\.length[^>]*variant="controls"/);
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
    const frame = await readFile(resolve(root, 'docs/.vitepress/theme/PreviewFrame.vue'), 'utf8');
    const css = await readFile(resolve(root, 'docs/.vitepress/theme/custom.css'), 'utf8');

    assert.match(layout, /#layout-bottom><PreviewFrame\s*\/><\/template>/);
    assert.doesNotMatch(layout, /#aside-top><PreviewFrame\s*\/><\/template>/);
    assert.match(css, /--vp-sidebar-width:\s*240px/);
    assert.match(css, /max-width:\s*680px/);
    assert.match(css, /--preview-phone-width:\s*calc\(375px/);
    assert.match(css, /transform:\s*scale\(var\(--preview-scale/);
    assert.match(frame, /const PHONE_WIDTH = 375/);
    assert.match(frame, /window\.innerWidth >= 1680 \? 375 : window\.innerWidth >= 1450 \? 320 : 300/);
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
    assert.match(frame, /:5173\/snake-ui\/h5\//);
    assert.doesNotMatch(frame, /http:\/\/localhost:5173\/preview\//);
});

test('production preview is emitted below the documentation base path', async () => {
    const frame = await readFile(resolve(root, 'docs/.vitepress/theme/PreviewFrame.vue'), 'utf8');
    const buildScript = await readFile(resolve(root, 'scripts/build-docs-preview.cjs'), 'utf8');

    assert.match(frame, /\/snake-ui\/h5\/#\//);
    assert.match(buildScript, /docs\/\.vitepress\/dist\/h5/);
    assert.doesNotMatch(buildScript, /docs\/\.vitepress\/dist\/preview/);
});
test('docs and preview shell use the approved brand green system', async () => {
    const config = await readFile(resolve(root, 'docs/.vitepress/config.mts'), 'utf8');
    const frame = await readFile(resolve(root, 'docs/.vitepress/theme/PreviewFrame.vue'), 'utf8');
    const css = await readFile(resolve(root, 'docs/.vitepress/theme/custom.css'), 'utf8');
    const demoTheme = await readFile(resolve(root, 'src/common/demo.scss'), 'utf8');
    const demoPage = await readFile(resolve(root, 'src/components/demo-page/demo-page.vue'), 'utf8');

    assert.match(config, /theme-color[^\n]+#06D290/);
    assert.match(css, /--snake-brand-fill:\s*#06d290/i);
    assert.match(css, /--snake-brand-hover:\s*#05be83/i);
    assert.match(css, /--snake-brand-active:\s*#04a873/i);
    assert.match(css, /--snake-brand-text:\s*#007a55/i);
    assert.match(css, /--snake-brand-ink:\s*#073b2a/i);
    assert.match(css, /\.preview-phone\s*{[^}]*linear-gradient\([^}]*#f8fffc/is);
    assert.doesNotMatch(frame, /preview-panel__header/);
    assert.doesNotMatch(css, /preview-panel__header|preview-live-pulse/);
    assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
    assert.match(frame, /preview-phone__system-status/);
    assert.match(frame, /preview-phone__battery/);
    assert.match(frame, /<svg class="preview-phone__wifi" viewBox="0 0 16 16"/);
    assert.match(css, /\.preview-phone__island\s*{[^}]*top:\s*31px/s);
    assert.match(css, /\.preview-phone\s*{[^}]*padding:\s*54px 9px 18px/s);
    assert.match(css, /\.preview-phone iframe,\s*\.preview-phone__status\s*{[^}]*border-radius:\s*0 0 25px 25px/s);
    assert.match(demoTheme, /--snake-demo-nav-background:\s*var\(--snake-color-primary,\s*#06d290\)/i);
    assert.match(demoTheme, /--snake-demo-nav-text:\s*#073b2a/i);

    assert.match(demoPage, /color:\s*var\(--snake-demo-nav-text\)/);
});

test('mobile preview and locale guide expose one persistent bilingual experience', async () => {
    const demoLocale = await readFile(resolve(root, 'src/common/demo-i18n.ts'), 'utf8');
    const demoPage = await readFile(resolve(root, 'src/components/demo-page/demo-page.vue'), 'utf8');
    const demoConfig = await readFile(resolve(root, 'src/demo/demo-config.ts'), 'utf8');
    const renderer = await readFile(resolve(root, 'src/demo/DemoRenderer.vue'), 'utf8');
    const indexPage = await readFile(resolve(root, 'src/pages/example/components.vue'), 'utf8');
    const localePage = await readFile(resolve(root, 'src/pages/other/themeLocale/index.vue'), 'utf8');
    const localeGuide = await readFile(resolve(root, 'docs/tools/use-locale.md'), 'utf8');

    assert.match(demoLocale, /currentSnakeLocale/);
    assert.match(demoLocale, /setSnakeLocale/);
    assert.match(demoLocale, /nextLocaleLabel/);
    assert.match(demoLocale, /button:\s*'Button'/);
    assert.match(demoPage, /@click="switchLocale"/);
    assert.match(demoPage, /\{\{ nextLocaleLabel \}\}/);
    assert.match(demoConfig, /export function localizeDemoDefinition/);
    assert.match(renderer, /localizeDemoDefinition/);
    assert.match(indexPage, /useDemoLocale/);
    assert.match(localePage, /text\('切换语言'\)/);
    assert.match(localeGuide, /defaultLocale/);
    assert.match(localeGuide, /useSnakeLocale/);
    assert.match(localeGuide, /snakeTranslate/);
    assert.match(localeGuide, /自定义或覆盖语言包/);
    assert.match(localeGuide, /当前语言。/);
    assert.match(localeGuide, /简体中文/);
    assert.match(localeGuide, /原始 key/);
    assert.match(localeGuide, /uni\.setStorageSync/);
});

test('icon preview exposes the bundled glyph set with a restrained interactive grid', async () => {
    const renderer = await readFile(resolve(root, 'src/pages/componentsA/icon/index.vue'), 'utf8');

    assert.match(renderer, /const selectedIcon = ref\('search'\)/);
    assert.match(renderer, /const iconNames = \[/);
    assert.match(renderer, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
    assert.match(renderer, /'demo-icon-item--active': selectedIcon === name/);
    assert.match(renderer, /@click="selectedIcon = name"/);
    assert.match(renderer, /key: 'iconLabelPos'/);
    assert.match(renderer, /key: 'iconBold'/);
});

test('button preview presents the complete capability showcase', async () => {
    const renderer = await readFile(resolve(root, 'src/pages/componentsA/button/index.vue'), 'utf8');

    for (const section of [
        '按钮主题',
        '镂空按钮',
        '按钮尺寸',
        '按钮形状',
        '按钮状态',
        '图标按钮',
        '自定义颜色',
        '水波纹'
    ]) {
        assert.match(renderer, new RegExp(section), `button preview: missing ${section}`);
    }
    assert.match(renderer, /demo-button-grid/);
    assert.match(renderer, /demo-button-flow/);
});

test('foundation feedback previews expose grouped variants', async () => {
    const renderer = await readFile(resolve(root, 'src/demo/DemoRenderer.vue'), 'utf8');
    const extracted = await Promise.all(
        [
            'button',
            'icon',
            'image',
            'lazyImage',
            'loadingIcon',
            'transition',
            'empty',
            'loadmore',
            'noticeBar',
            'overlay',
            'popup',
            'sticky'
        ].map(directory => readFile(resolve(root, 'src/pages/componentsA', directory, 'index.vue'), 'utf8'))
    );
    const foundationSource = [renderer, ...extracted].join('\n');

    for (const component of [
        'loading-icon',
        'transition',
        'icon',
        'image',
        'lazy-image',
        'empty',
        'loadmore',
        'notice-bar',
        'overlay',
        'popup',
        'sticky'
    ]) {
        assert.match(
            foundationSource,
            new RegExp(`demo-${component}-showcase|<snake-${component}`),
            `${component}: missing grouped showcase`
        );
    }
    assert.match(renderer, /demo-variant-title/);
});

test('form control previews expose grouped variants', async () => {
    const renderer = await readFile(resolve(root, 'src/demo/DemoRenderer.vue'), 'utf8');

    for (const component of [
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
    ]) {
        assert.match(renderer, new RegExp(`demo-${component}-showcase`), `${component}: missing grouped showcase`);
    }
});

test('navigation and layout previews expose grouped variants', async () => {
    const renderer = await readFile(resolve(root, 'src/demo/DemoRenderer.vue'), 'utf8');
    for (const component of [
        'navbar',
        'tabs',
        'swiper',
        'subsection',
        'button-sort',
        'drop-menu',
        'drop-menu-item',
        'index-list',
        'index-anchor'
    ]) {
        assert.match(renderer, new RegExp(`demo-${component}-showcase`), `${component}: missing grouped showcase`);
    }
});

test('CMS and commerce previews expose grouped variants', async () => {
    const renderer = await readFile(resolve(root, 'src/demo/DemoRenderer.vue'), 'utf8');
    for (const component of [
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
    ]) {
        assert.match(renderer, new RegExp(`demo-${component}-showcase`), `${component}: missing grouped showcase`);
    }
});
