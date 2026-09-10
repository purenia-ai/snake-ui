import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = path => readFile(resolve(root, path), 'utf8');

test('demo app registers five primary tab pages', async () => {
    const pages = await read('src/pages.json');

    for (const [pagePath, text] of [
        ['pages/example/components', '组件'],
        ['pages/example/tools', '工具'],
        ['pages/example/scenes', '场景'],
        ['pages/example/templates', '模板'],
        ['pages/example/about', '关于']
    ]) {
        assert.match(pages, new RegExp(`"pagePath":\\s*"${pagePath}"`));
        assert.match(pages, new RegExp(`"pagePath":\\s*"${pagePath}",\\s*"text":\\s*"${text}"`));
    }
    assert.match(pages, /"tabBar"\s*:/);
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
    assert.match(shell, /uni\.switchTab/);
    assert.match(tabbar, /safe-area-inset-bottom/);
    assert.match(tabbar, /var\(--snake-color-primary/);
    assert.match(shell, /snake-tabbar/);
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
