import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const foundationComponents = [
    'button',
    'loading',
    'skeleton',
    'transition',
    'root-portal',
    'empty',
    'icon',
    'image',
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
    'index-list',
    'index-anchor',
    'form',
    'input',
    'textarea',
    'checkbox',
    'radio',
    'switch',
    'slider',
    'cell',
    'line',
    'line-progress',
    'search',
    'select',
    'read-more',
    'no-network',
    'text',
    'link',
    'calendar',
    'count-down'
];

function exampleRoutes(pages) {
    return [...pages.matchAll(/"root":\s*"(pages\/components[AB])"[\s\S]*?"pages":\s*\[([\s\S]*?)\]\s*\}/g)].flatMap(([, root, body]) =>
        [...body.matchAll(/"path":\s*"([^"?]+)"/g)].map(match => `${root}/${match[1]}`)
    );
}

const componentRouteName = name => name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

async function examplePageSources() {
    const sources = [];
    for (const group of ['componentsA', 'componentsB']) {
        const directories = await readdir(resolve(root, 'src/pages', group));
        for (const directory of directories) {
            sources.push(await readFile(resolve(root, 'src/pages', group, directory, 'index.vue'), 'utf8'));
        }
    }
    return sources;
}

test('preview renderer uses an uncropped viewport root', async () => {
    const renderer = await readFile(resolve(root, 'src/pages/componentsB/snakeCms/index.vue'), 'utf8');
    const page = await readFile(resolve(root, 'src/components/demo-page/demo-page.vue'), 'utf8');
    assert.ok(page.includes('background-color: var(--snake-color-surface)'));

    assert.doesNotMatch(renderer, /DemoShell/);
    assert.doesNotMatch(renderer, /overflow:\s*hidden/);
    assert.doesNotMatch(renderer, /transform:\s*scale/);
    assert.match(page, /\.demo-page\s*{[^}]*min-height:\s*100vh/s);
    assert.match(page, /\.demo-page\s*{[^}]*box-sizing:\s*border-box/s);
});

test('documented components keep valid example routes while compatibility previews remain available', async () => {
    const pages = await readFile(resolve(root, 'src/pages.json'), 'utf8');
    const componentFiles = (await readdir(resolve(root, 'docs/components'))).filter(file => file.endsWith('.md'));
    const routes = exampleRoutes(pages);
    const previews = [];

    for (const file of componentFiles) {
        const markdown = await readFile(resolve(root, 'docs/components', file), 'utf8');
        const match = markdown.match(/^preview:\s*\/?([^\r\n]+)/m);
        if (match) previews.push(match[1]);
    }

    assert.equal(routes.length, 61);
    assert.equal(previews.length, 42);
    assert.equal(new Set(previews).size, previews.length);
    for (const preview of previews) {
        assert.ok(routes.includes(preview) || preview === 'pages/other/color/index', `${preview}: missing example route`);
    }
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

    const configuredPaths = [...config.matchAll(/item\(\s*'(\/pages\/(?:components[AB])\/[^']+)'/g)].map(match => match[1].replace(/^\//, ''));
    const routes = exampleRoutes(pages);

    assert.equal(configuredPaths.length, 61);
    assert.deepEqual([...configuredPaths].sort(), [...routes].sort());
    assert.equal(groupA.length, 41);
    assert.equal(groupB.length, 20);
    for (const directory of [...groupA.map(name => ['componentsA', name]), ...groupB.map(name => ['componentsB', name])]) {
        await access(resolve(root, 'src/pages', directory[0], directory[1], 'index.vue'));
    }
    for (const group of [
        '基础组件',
        '表单组件',
        '数据组件',
        '反馈组件',
        '布局组件',
        '导航组件',
        'CMS 容器',
        'CMS 内容',
        'CMS 导航互动',
        'CMS 商品'
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

test('all example pages own their interactive demo configuration', async () => {
    const panel = await readFile(resolve(root, 'src/components/demo-control-panel/demo-control-panel.vue'), 'utf8');
    const pages = await examplePageSources();

    assert.equal(pages.length, 61);
    for (const page of pages) {
        assert.match(page, /<DemoPage/);
        assert.match(page, /<DemoControlPanel|mockUpload/);
        assert.doesNotMatch(page, /DemoRenderer/);
    }
    assert.match(panel, /control\.type === 'select'/);
    assert.match(panel, /control\.type === 'switch'/);
    assert.match(panel, /control\.type === 'slider'/);
    assert.match(panel, /demo-control__input/);
});

test('component demos use one restrained shared presentation system', async () => {
    const theme = await readFile(resolve(root, 'src/common/demo.scss'), 'utf8');
    const page = await readFile(resolve(root, 'src/components/demo-page/demo-page.vue'), 'utf8');
    const section = await readFile(resolve(root, 'src/components/demo-section/demo-section.vue'), 'utf8');
    const panel = await readFile(resolve(root, 'src/components/demo-control-panel/demo-control-panel.vue'), 'utf8');
    const pages = (await examplePageSources()).join('\n');

    assert.doesNotMatch(theme, /snake-demo-nav-gradient|snake-demo-page-tint|snake-demo-card-shadow/);
    assert.match(page, /demo-page-header__title/);
    assert.match(page, /backgroundColor:\s*'var\(--snake-color-primary\)'/);
    assert.match(page, /backgroundImage:\s*'linear-gradient\(90deg, var\(--snake-color-primary-dark\), var\(--snake-color-primary-disabled\)\)'/);
    assert.doesNotMatch(page, /background-image:\s*\$snake-page-tint/);
    assert.match(section, /DemoSectionVariant = 'default' \| 'preview' \| 'controls'/);
    assert.match(section, /demo-section--preview[^}]*border-bottom:\s*1rpx dashed/s);
    assert.match(panel, /<snake-subsection/);
    assert.match(panel, /:current="selectedIndex\(control\)"/);
    assert.match(panel, /@change="selectOption\(control, \$event\)"/);
    assert.match(panel, /v-else-if="control\.type === 'input'"/);
    assert.match(pages, /variant="preview"/);
    assert.match(pages, /variant="controls"/);
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

test('responsive preview uses one mount point and preserves the desktop phone dimensions', async () => {
    const layout = await readFile(resolve(root, 'docs/.vitepress/theme/Layout.vue'), 'utf8');
    const frame = await readFile(resolve(root, 'docs/.vitepress/theme/PreviewFrame.vue'), 'utf8');
    const css = await readFile(resolve(root, 'docs/.vitepress/theme/custom.css'), 'utf8');

    assert.match(layout, /#doc-before><PreviewFrame\s*\/><\/template>/);
    assert.doesNotMatch(layout, /#layout-bottom><PreviewFrame\s*\/><\/template>/);
    assert.doesNotMatch(layout, /#aside-top><PreviewFrame\s*\/><\/template>/);
    assert.match(css, /--vp-sidebar-width:\s*230px/);
    assert.match(css, /max-width:\s*700px/);
    assert.match(css, /--preview-phone-width:\s*calc\(375px/);
    assert.match(css, /transform:\s*scale\(var\(--preview-scale/);
    assert.match(frame, /const PHONE_WIDTH = 375/);
    assert.match(frame, /DESKTOP_PREVIEW_QUERY = '\(min-width: 1280px\) and \(min-height: 560px\)'/);
    assert.match(frame, /window\.matchMedia\(DESKTOP_PREVIEW_QUERY\)/);
});

test('desktop phone preview is fixed to the outer page edge like uView2', async () => {
    const layout = await readFile(resolve(root, 'docs/.vitepress/theme/Layout.vue'), 'utf8');
    const css = await readFile(resolve(root, 'docs/.vitepress/theme/custom.css'), 'utf8');

    assert.match(layout, /#doc-before><PreviewFrame\s*\/><\/template>/);
    assert.doesNotMatch(layout, /#aside-(?:top|outline-after)><PreviewFrame\s*\/><\/template>/);
    assert.match(css, /\.preview-panel\s*{[^}]*position:\s*fixed/s);
    assert.match(css, /right:\s*20px/);
    assert.match(css, /right:\s*30px/);
    assert.match(css, /right:\s*max\(0px,\s*calc\(\(100vw\s*-\s*1680px\)\s*\/\s*2\)\)/);
    assert.doesNotMatch(css, /\.VPDoc\.has-aside \.aside-container\s*,\s*\n\s*\.VPDoc\.has-aside \.aside-curtain/);
});

test('preview pages hide the outline at medium desktop widths while retaining the phone', async () => {
    const layout = await readFile(resolve(root, 'docs/.vitepress/theme/Layout.vue'), 'utf8');
    const css = await readFile(resolve(root, 'docs/.vitepress/theme/custom.css'), 'utf8');

    assert.match(layout, /useData\(\)/);
    assert.match(layout, /snake-preview-layout/);
    assert.match(layout, /frontmatter\.value\.preview/);
    assert.match(
        css,
        /@media \(min-width: 1280px\) and \(max-width: 1439px\)\s*{\s*\.snake-preview-layout \.VPDoc\.has-aside \.aside\s*{[^}]*display:\s*none/s
    );
    assert.match(css, /\.snake-preview-layout \.VPDoc\.has-aside \.aside\s*{[^}]*max-width:\s*190px/s);
    assert.match(
        css,
        /\.snake-preview-layout \.VPDoc\.has-aside \.aside-container\s*,\s*\.snake-preview-layout \.VPDoc\.has-aside \.aside-curtain\s*{[^}]*width:\s*164px/s
    );
    assert.match(css, /\.snake-preview-layout \.VPDoc\s*{[^}]*padding-right:\s*0[^}]*padding-left:\s*0/s);
    assert.match(
        css,
        /\.snake-preview-layout \.VPDoc \.content\s*{[^}]*flex:\s*1 1 732px[^}]*min-width:\s*0[^}]*padding-right:\s*16px[^}]*padding-left:\s*16px/s
    );
    assert.match(css, /\.snake-preview-layout \.VPDoc\.has-aside \.content-container\s*{[^}]*max-width:\s*700px/s);
    assert.match(css, /--preview-reserved-space:/);
    assert.match(css, /\.snake-preview-layout \.VPContent\.has-sidebar\s*{[^}]*padding-right:\s*var\(--preview-reserved-space\)/s);
    assert.doesNotMatch(css, /\.snake-preview-layout \.VPDoc\s*{[^}]*padding-right:\s*var\(--preview-reserved-space\)/s);
});

test('narrow previews use a link and do not create a hidden iframe', async () => {
    const frame = await readFile(resolve(root, 'docs/.vitepress/theme/PreviewFrame.vue'), 'utf8');

    assert.match(frame, /v-if="previewUrl && !showDesktopPreview"/);
    assert.match(frame, /v-else-if="showDesktopPreview"/);
    assert.match(frame, /watch\(showDesktopPreview, visible =>/);
    assert.match(frame, /previewMediaQuery\?\.removeEventListener/);
    assert.match(frame, /document\.documentElement\.style\.removeProperty\('--preview-scale'\)/);
});

test('narrow documentation content cannot be widened by preview-adjacent code samples', async () => {
    const css = await readFile(resolve(root, 'docs/.vitepress/theme/custom.css'), 'utf8');

    assert.match(css, /@media \(max-width: 767px\)[\s\S]*?\.VPDoc \.content,[\s\S]*?min-width:\s*0/s);
    assert.match(css, /\.vp-doc p,[\s\S]*?overflow-wrap:\s*anywhere/s);
});

test('development preview follows the docs host for LAN access', async () => {
    const frame = await readFile(resolve(root, 'docs/.vitepress/theme/PreviewFrame.vue'), 'utf8');

    assert.match(frame, /window\.location\.hostname/);
    assert.match(frame, /window\.location\.protocol/);
    assert.match(frame, /localhost'\s*\?\s*'127\.0\.0\.1'/);
    assert.match(frame, /:5173\/snake-ui\/h5\//);
    assert.doesNotMatch(frame, /http:\/\/localhost:5173\/preview\//);
});

test('desktop preview exposes accessible manual recovery after a timeout', async () => {
    const frame = await readFile(resolve(root, 'docs/.vitepress/theme/PreviewFrame.vue'), 'utf8');

    assert.match(frame, /const retryCount = ref\(0\)/);
    assert.match(frame, /const previewKey = computed/);
    assert.match(frame, /:key="previewKey"/);
    assert.match(frame, /function retryPreview\(\)/);
    assert.match(frame, /retryCount\.value \+= 1/);
    assert.match(frame, /role="status"/);
    assert.match(frame, /aria-live="polite"/);
    assert.match(frame, /@click="retryPreview">重新连接/);
    assert.match(frame, /:href="previewUrl"[^>]+target="_blank"[^>]*>新窗口打开/);
});

test('production preview is emitted below the documentation base path', async () => {
    const frame = await readFile(resolve(root, 'docs/.vitepress/theme/PreviewFrame.vue'), 'utf8');
    const buildScript = await readFile(resolve(root, 'scripts/build-docs-preview.cjs'), 'utf8');

    assert.match(frame, /withBase\(`\/h5\/#\//);
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
    assert.match(frame, /snake-ui:preview-navbar-theme/);
    assert.match(frame, /:style="systemStatusStyle"/);
    assert.match(frame, /preview-phone__battery/);
    assert.match(frame, /<svg class="preview-phone__wifi" viewBox="0 0 16 16"/);
    assert.match(css, /\.preview-phone__island\s*{[^}]*top:\s*31px/s);
    assert.match(css, /\.preview-phone\s*{[^}]*padding:\s*54px 9px 18px/s);
    assert.match(css, /\.preview-phone iframe,\s*\.preview-phone__status\s*{[^}]*border-radius:\s*0 0 25px 25px/s);
    assert.doesNotMatch(demoTheme, /snake-demo-nav-/);
    assert.match(demoPage, /:background="background"/);
    assert.match(demoPage, /title-color="#ffffff"/);
});

test('mobile preview and locale guide expose one persistent bilingual experience', async () => {
    const demoLocale = await readFile(resolve(root, 'src/common/demo-i18n.ts'), 'utf8');
    const demoPage = await readFile(resolve(root, 'src/components/demo-page/demo-page.vue'), 'utf8');
    const pages = (await examplePageSources()).join('\n');
    const indexPage = await readFile(resolve(root, 'src/pages/example/components.vue'), 'utf8');
    const localePage = await readFile(resolve(root, 'src/pages/other/themeLocale/index.vue'), 'utf8');
    const localeGuide = await readFile(resolve(root, 'docs/tools/use-locale.md'), 'utf8');

    assert.match(demoLocale, /currentLocale/);
    assert.match(demoLocale, /setLocale/);
    assert.match(demoLocale, /nextLocaleLabel/);
    assert.match(demoLocale, /button:\s*'Button'/);
    assert.match(demoPage, /@click="switchLocale"/);
    assert.match(demoPage, /\{\{ nextLocaleLabel \}\}/);
    assert.match(pages, /useDemoLocale/);
    assert.match(pages, /demoTitle/);
    assert.match(indexPage, /useDemoLocale/);
    assert.match(localePage, /text\('切换语言'\)/);
    assert.match(localeGuide, /defaultLocale/);
    assert.match(localeGuide, /useLocale/);
    assert.match(localeGuide, /translate/);
    assert.match(localeGuide, /自定义或覆盖语言包/);
    assert.match(localeGuide, /当前语言。/);
    assert.match(localeGuide, /简体中文/);
    assert.match(localeGuide, /原始 key/);
    assert.match(localeGuide, /uni\.setStorageSync/);
});

test('icon preview exposes the bundled glyph set with a restrained interactive grid', async () => {
    const renderer = await readFile(resolve(root, 'src/pages/componentsA/icon/index.vue'), 'utf8');

    assert.match(renderer, /const selectedIcon = ref\('search'\)/);
    assert.match(renderer, /import \{ iconNames \} from .+snake-icon\/icon-names/);
    assert.match(renderer, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
    assert.match(renderer, /'demo-icon-item--active': selectedIcon === name/);
    assert.match(renderer, /@click="selectedIcon = name"/);
    assert.match(renderer, /key: 'iconLabelPos'/);
    assert.match(renderer, /key: 'iconBold'/);
});

test('button preview presents one configurable button', async () => {
    const renderer = await readFile(resolve(root, 'src/pages/componentsA/button/index.vue'), 'utf8');

    assert.doesNotMatch(renderer, /loading-text|loading-mode|\bicon=|<snake-button[^>]*\scolor=|:block=/);
    assert.equal(renderer.match(/^\s*<snake-button\b/gm)?.length, 1);
    assert.match(renderer, /:type="String\(state\.type\)"/);
    assert.match(renderer, /:size="state\.buttonSize as any"/);
    assert.match(renderer, /:shape="state\.buttonShape as any"/);
    for (const state of ['plain', 'disabled', 'loading', 'ripple']) {
        assert.match(renderer, new RegExp(`:${state}="Boolean\\(state\\.${state}\\)"`));
    }
    assert.match(renderer, /const currentCode = computed/);
    assert.match(renderer, /uni\.setClipboardData/);
    assert.match(renderer, /function resetState\(\)/);
    assert.match(renderer, /复制代码/);
    assert.match(renderer, /恢复默认/);
    assert.doesNotMatch(renderer, /demo-button-(?:grid|flow)/);
});

test('foundation feedback previews expose grouped variants', async () => {
    const extracted = await Promise.all(
        ['button', 'icon', 'image', 'loading', 'skeleton', 'transition', 'empty', 'loadmore', 'noticeBar', 'overlay', 'popup', 'sticky'].map(
            directory => readFile(resolve(root, 'src/pages/componentsA', directory, 'index.vue'), 'utf8')
        )
    );
    const foundationSource = extracted.join('\n');

    for (const component of ['loading', 'skeleton', 'transition', 'icon', 'image', 'empty', 'loadmore', 'notice-bar', 'overlay', 'popup', 'sticky']) {
        assert.match(foundationSource, new RegExp(`demo-${component}-showcase|<snake-${component}`), `${component}: missing grouped showcase`);
    }
    assert.match(foundationSource, /demo-variant-title/);
});

test('form control previews expose grouped variants', async () => {
    const extracted = await Promise.all(
        ['form', 'input', 'textarea', 'checkbox', 'radio', 'switch', 'slider'].map(directory =>
            readFile(resolve(root, 'src/pages/componentsA', directory, 'index.vue'), 'utf8')
        )
    );
    const formSource = extracted.join('\n');

    for (const component of ['form', 'input', 'textarea', 'checkbox', 'radio', 'switch', 'slider']) {
        assert.match(formSource, new RegExp(`demo-${component}-showcase`), `${component}: missing grouped showcase`);
    }
});

test('navigation and layout previews expose grouped variants', async () => {
    const extracted = await Promise.all(
        ['navbar', 'swiper', 'tabs', 'subsection', 'buttonSort', 'dropMenu', 'indexList', 'indexAnchor'].map(directory =>
            readFile(resolve(root, 'src/pages/componentsA', directory, 'index.vue'), 'utf8')
        )
    );
    const navigationSource = extracted.join('\n');
    for (const component of ['navbar', 'tabs', 'swiper', 'subsection', 'button-sort', 'drop-menu', 'index-list', 'index-anchor']) {
        assert.match(navigationSource, new RegExp(`demo-${component}-showcase`), `${component}: missing grouped showcase`);
    }
});

test('CMS and commerce previews expose grouped variants', async () => {
    const extracted = await Promise.all(
        [
            'snakeCms',
            'customModule',
            'images',
            'pictureAds',
            'magicCube',
            'videos',
            'richText',
            'notice',
            'auxiliarySegmentation',
            'graphicNavigation',
            'commoditySearch',
            'floatingBubble',
            'pagePopup',
            'jumpApplet',
            'follow',
            'goodsList',
            'activityList',
            'filterSorts',
            'listSwitching',
            'coupon'
        ].map(directory => readFile(resolve(root, 'src/pages/componentsB', directory, 'index.vue'), 'utf8'))
    );
    const cmsSource = extracted.join('\n');
    for (const component of [
        'snake-cms',
        'custom-module',
        'images',
        'picture-ads',
        'magic-cube',
        'videos',
        'rich-text',
        'notice',
        'auxiliary-segmentation',
        'graphic-navigation',
        'commodity-search',
        'floating-bubble',
        'page-popup',
        'jump-applet',
        'follow',
        'goods-list',
        'activity-list',
        'filter-sorts',
        'list-switching',
        'coupon'
    ]) {
        assert.match(cmsSource, new RegExp(`demo-${component}-showcase`), `${component}: missing grouped showcase`);
    }
});
