import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = path => readFile(resolve(root, path), 'utf8');

test('demo app registers five primary tab pages', async () => {
    const pages = await read('src/pages.json');

    for (const pagePath of [
        'pages/example/components',
        'pages/example/tools',
        'pages/example/scenes',
        'pages/example/templates',
        'pages/example/about'
    ]) {
        assert.match(pages, new RegExp(`"pagePath":\\s*"${pagePath}"`));
    }
    assert.match(pages, /"tabBar"\s*:/);
    assert.doesNotMatch(pages, /"pagePath":\s*"pages\/example\/(?:components|tools|scenes|templates|about)",\s*"text"/);
    assert.match(pages, /"root":\s*"pages\/library"/);
    assert.match(pages, /"root":\s*"pages\/other"/);
});

test('page tree has no obsolete top-level demo directories', async () => {
    const directories = await readdir(resolve(root, 'src/pages'));

    for (const obsolete of ['index', 'toolbox', 'about', 'tools']) {
        assert.ok(!directories.includes(obsolete), `${obsolete} should not exist below src/pages`);
    }
    for (const expected of ['example', 'componentsA', 'componentsB', 'library', 'other']) {
        assert.ok(directories.includes(expected), `${expected} should exist below src/pages`);
    }
});

test('primary pages share the custom themed tabbar', async () => {
    const [tabbar, shell, components, tools, scenes, templates, about] = await Promise.all([
        read('src/uni_modules/snake-ui/components/snake-tabbar/snake-tabbar.vue'),
        read('src/components/demo-page/demo-page.vue'),
        read('src/pages/example/components.vue'),
        read('src/pages/example/tools.vue'),
        read('src/pages/example/scenes.vue'),
        read('src/pages/example/templates.vue'),
        read('src/pages/example/about.vue')
    ]);

    assert.match(tabbar, /defineProps<TabbarProps>/);
    assert.match(tabbar, /hideTabBar:\s*true/);
    assert.match(tabbar, /onMounted\(\(\) => \{[\s\S]*uni\.hideTabBar\(\{ fail: \(\) => \{\} \}\)/);
    assert.match(tabbar, /beforeSwitch\(index\)/);
    assert.match(tabbar, /uni\.switchTab\(\{ url: item\.pagePath \}\)/);
    assert.match(tabbar, /style\.flex = `0 0 \$\{width\}`/);
    assert.match(tabbar, /props\.midButton \? '60rpx' : '1px'/);
    assert.match(shell, /uni\.switchTab/);
    assert.match(tabbar, /safe-area-inset-bottom/);
    assert.match(tabbar, /var\(--snake-color-primary/);
    assert.match(tabbar, /selectedIconPath/);
    assert.match(tabbar, /customIcon/);
    assert.match(shell, /snake-tabbar/);
    assert.match(shell, /:mid-button="true"/);
    assert.match(shell, /midButton: true/);
    for (const icon of ['grid-fill', 'setting-fill', 'moments-circel-fill', 'tags-fill', 'info-circle-fill']) {
        assert.match(shell, new RegExp(`selectedIconPath: '${icon}'`));
    }
    assert.match(shell, /iconPath: 'info-circle'/);
    assert.match(components, /current-tab=['"]components['"]/);
    assert.match(tools, /current-tab=['"]tools['"]/);
    assert.match(scenes, /current-tab=['"]scenes['"]/);
    assert.match(templates, /current-tab=['"]templates['"]/);
    assert.match(about, /current-tab=['"]about['"]/);
    assert.match(about, /https:\/\/m\.puresnake\.com\/snake-ui\//);
    assert.doesNotMatch(about, /r2nd\.github\.io/);
});

test('tool overview uses semantic detail directories', async () => {
    const [pages, tools, config] = await Promise.all([
        read('src/pages.json'),
        read('src/pages/example/tools.vue'),
        read('src/pages/example/tools.config.ts')
    ]);
    const routes = [
        '/pages/library/http/index',
        '/pages/library/debounceThrottle/index',
        '/pages/library/route/index',
        '/pages/other/themeLocale/index'
    ];

    assert.match(tools, /tools\.config/);
    for (const route of routes) {
        assert.match(config, new RegExp(route));
        const [, , rootName, ...pagePath] = route.split('/');
        assert.match(pages, new RegExp(`"root":\\s*"pages/${rootName}"`));
        assert.match(pages, new RegExp(`"path":\\s*"${pagePath.join('/')}"`));
    }
});

test('scene and template catalogs link to registered full-page showcases', async () => {
    const [pages, scenes, templates, content] = await Promise.all([
        read('src/pages.json'),
        read('src/pages/example/scenes.config.ts'),
        read('src/pages/example/templates.config.ts'),
        read('src/components/showcase-content/showcase-content.vue')
    ]);
    const routes = [
        ['commerceHome', 'commerce-home'],
        ['campaign', 'campaign'],
        ['cmsContent', 'cms-content']
    ];
    assert.match(pages, /"root":\s*"pages\/showcase"/);
    for (const [directory, key] of routes) {
        const path = `/pages/showcase/${directory}/index`;
        assert.match(pages, new RegExp(`"path":\\s*"${directory}/index"`));
        assert.ok(scenes.includes(path), `${path} missing from scenes`);
        assert.ok(templates.includes(path), `${path} missing from templates`);
        assert.ok(content.includes(`kind === '${key}'`) || key === 'cms-content');
        await read(`src/pages/showcase/${directory}/index.vue`);
    }
});
