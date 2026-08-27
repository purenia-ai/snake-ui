import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');

async function text(path) {
    return readFile(resolve(root, path), 'utf8');
}

test('component navigation exposes a complete getting-started group', async () => {
    const config = await text('docs/.vitepress/config.mts');
    const pages = ['intro', 'install', 'setting', 'quickstart', 'common', 'note'];

    assert.match(config, /const componentSidebar = \[\s*\{\s*text: '起步'/);
    for (const page of pages) {
        assert.ok(config.includes('/components/' + page));
        await access(resolve(root, 'docs/components', page + '.md'));
    }
});

test('component getting-started pages remain connected', async () => {
    const intro = await text('docs/components/intro.md');
    const setting = await text('docs/components/setting.md');
    const quickstart = await text('docs/components/quickstart.md');

    assert.ok(intro.includes('[安装](/components/install)'));
    assert.ok(setting.includes('[快速上手](/components/quickstart)'));
    assert.ok(quickstart.includes('[组件总览](/components/intro)'));
});

test('guide navigation exposes dedicated task groups', async () => {
    const config = await text('docs/.vitepress/config.mts');
    assert.match(config, /text: '配置与自定义'/);
    assert.match(config, /text: '迁移与排错'/);
    assert.doesNotMatch(config, /text: '商城与 CMS'/);
    assert.doesNotMatch(config, /text: '核心概念'/);
});

test('dedicated guide pages remain connected', async () => {
    const config = await text('docs/.vitepress/config.mts');
    for (const page of ['design-principles', 'internationalization', 'custom-style']) {
        assert.ok(config.includes('/guide/' + page));
        await access(resolve(root, 'docs/guide', page + '.md'));
    }
    assert.match(await text('docs/guide/foundation.md'), /^# 全局配置总览$/m);
});

test('top navigation owns independent guide, component, CMS, and tool domains', async () => {
    const config = await text('docs/.vitepress/config.mts');
    assert.ok(config.includes("{ text: '指南', link: '/guide/getting-started'"));
    assert.ok(config.includes("{ text: '组件', link: '/components/intro'"));
    assert.ok(config.includes("{ text: 'CMS', link: '/cms/getting-started', activeMatch: '/cms/' }"));
    assert.ok(config.includes("{ text: '工具', link: '/tools/intro', activeMatch: '/tools/' }"));
    assert.ok(config.includes("'/cms/': cmsSidebar"));
    assert.ok(config.includes("'/tools/': toolGroups"));
    assert.ok(!config.includes("text: '工具', link: '/guide/tools'"));
});

test('CMS domain exposes guides, component discovery, and legacy entry points', async () => {
    const config = await text('docs/.vitepress/config.mts');
    const pages = ['getting-started', 'component-data', 'sanke-editor', 'components'];

    for (const page of pages) {
        assert.ok(config.includes('/cms/' + page));
        await access(resolve(root, 'docs/cms', page + '.md'));
    }

    const overview = await text('docs/.vitepress/components/ComponentOverview.vue');
    assert.match(overview, /type ComponentScope = 'all' \| 'cms'/);
    assert.match(overview, /items\.filter\(item => item\.cms\)/);
    assert.match(overview, /:href="withBase\(item\.link\)"/);
    assert.ok((await text('docs/cms/components.md')).includes('<ComponentOverview scope="cms" />'));

    const legacyPages = new Map([
        ['cms-usage', '/cms/getting-started'],
        ['component-data', '/cms/component-data'],
        ['sanke-editor', '/cms/sanke-editor']
    ]);
    for (const [page, destination] of legacyPages) {
        const legacy = await text('docs/guide/' + page + '.md');
        assert.ok(legacy.includes(destination));
    }
});

test('every tool navigation entry resolves to a dedicated document', async () => {
    const registry = await text('docs/.vitepress/tool-groups.ts');
    const links = [...registry.matchAll(new RegExp("link: '(/tools/[^']+)'", 'g'))].map(match => match[1]);
    assert.equal(links.length, 30);
    assert.equal(new Set(links).size, links.length, 'tool links must be unique');

    for (const link of links) {
        await access(resolve(root, 'docs', `${link.slice(1)}.md`));
        const markdown = await text(`docs${link}.md`);
        assert.ok(
            markdown.split('\n').some(line => line.startsWith('# ')),
            `${link}: title`
        );
        assert.ok(markdown.length >= 180, `${link}: meaningful content`);
    }
});

test('tool registry covers every documented public utility and composable', async () => {
    const registry = await text('docs/.vitepress/tool-groups.ts');
    const apiGroups = [...registry.matchAll(new RegExp('apis: \\[([^\\]]+)\\]', 'g'))];
    const apis = apiGroups.flatMap(([, body]) => [...body.matchAll(/'([^']+)'/g)].map(match => match[1]));
    assert.equal(new Set(apis).size, apis.length, 'documented API names must be unique');

    const functionFiles = await readdir(resolve(root, 'src/uni_modules/snake-ui/libs/function'));
    const sources = (
        await Promise.all([
            ...functionFiles.filter(file => file.endsWith('.ts')).map(file => text(`src/uni_modules/snake-ui/libs/function/${file}`)),
            text('src/uni_modules/snake-ui/libs/hooks/index.ts'),
            text('src/uni_modules/snake-ui/libs/request/index.ts')
        ])
    ).join('\n');

    for (const api of apis) {
        assert.match(sources, new RegExp(`\\b${api}\\b`), `${api}: source declaration`);
    }
});

test('legacy tool page points to the new domain', async () => {
    const legacy = await text('docs/guide/tools.md');
    assert.match(legacy, /^# 工具文档已迁移$/m);
    assert.ok(legacy.includes('[工具介绍](/tools/intro)'));
});

test('key tool docs and demo routes remain connected', async () => {
    const pages = await text('src/pages.json');
    const previews = new Map([
        ['docs/tools/http.md', '/pages/library/http/index'],
        ['docs/tools/debounce-throttle.md', '/pages/library/debounceThrottle/index'],
        ['docs/tools/route.md', '/pages/library/route/index'],
        ['docs/tools/use-theme.md', '/pages/other/themeLocale/index'],
        ['docs/tools/use-locale.md', '/pages/other/themeLocale/index']
    ]);

    for (const [file, route] of previews) {
        assert.match(await text(file), new RegExp(`^preview: ${route}$`, 'm'));
        const [, , rootName, ...pagePath] = route.split('/');
        assert.match(pages, new RegExp(`"root": "pages/${rootName}"`));
        assert.match(pages, new RegExp(`"path": "${pagePath.join('/')}"`));
        await access(resolve(root, 'src', `${route.slice(1)}.vue`));
    }
});
