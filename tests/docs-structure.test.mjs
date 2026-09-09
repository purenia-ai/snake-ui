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
    const pages = ['intro', 'install', 'setting', 'quickstart', 'common', 'note', 'changelog'];

    assert.match(config, /const componentSidebar = \[\s*\{\s*text: '起步'/);
    for (const page of pages) {
        assert.ok(config.includes('/components/' + page));
        await access(resolve(root, 'docs/components', page + '.md'));
    }

    const changelog = await text('docs/components/changelog.md');
    assert.match(changelog, /^# 更新日志$/m);
    assert.ok(changelog.length >= 400, 'changelog: meaningful content');
});

test('component getting-started pages remain connected', async () => {
    const intro = await text('docs/components/intro.md');
    const setting = await text('docs/components/setting.md');
    const quickstart = await text('docs/components/quickstart.md');

    assert.ok(intro.includes('[安装](/components/install)'));
    assert.ok(intro.includes('[CMS 组件总览](/cms/overview)'));
    assert.ok(!intro.includes('](/cms/components)'));
    assert.ok(setting.includes('[快速上手](/components/quickstart)'));
    assert.ok(quickstart.includes('[组件总览](/components/intro)'));
    assert.match(quickstart, /^## 关于 uni\.\$snake$/m);
    assert.match(quickstart, /^## 不使用 easycom 单独引用组件$/m);
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
    const legacyStart = await text('docs/guide/getting-started.md');
    assert.match(legacyStart, /^# 快速开始已迁移$/m);
    assert.ok(legacyStart.includes('[安装](/components/install)'));
});

test('guide exposes virtual root, icon extension, and editor hint pages', async () => {
    const config = await text('docs/.vitepress/config.mts');
    const expectations = new Map([
        ['root', /SnakeRoot/],
        ['custom-icon', /custom-prefix|customPrefix/],
        ['code-hint', /easycom/]
    ]);

    for (const [page, content] of expectations) {
        assert.ok(config.includes('/guide/' + page), `${page}: sidebar entry`);
        await access(resolve(root, 'docs/guide', page + '.md'));
        const markdown = await text(`docs/guide/${page}.md`);
        assert.ok(
            markdown.split('\n').some(line => line.startsWith('# ')),
            `${page}: title`
        );
        assert.ok(markdown.length >= 400, `${page}: meaningful content`);
        assert.match(markdown, content, `${page}: core topic`);
    }
});

test('top navigation owns independent guide, component, CMS, and tool domains', async () => {
    const config = await text('docs/.vitepress/config.mts');
    assert.ok(config.includes("{ text: '指南', link: '/guide/intro'"));
    assert.ok(config.includes("{ text: '组件', link: '/components/intro'"));
    assert.ok(config.includes("{ text: 'CMS', link: '/cms/getting-started', activeMatch: '/cms/' }"));
    assert.ok(config.includes("{ text: '工具', link: '/tools/intro', activeMatch: '/tools/' }"));
    assert.ok(config.includes("'/cms/': cmsSidebar"));
    assert.ok(config.includes("'/tools/': toolGroups"));
    assert.ok(!config.includes("text: '工具', link: '/guide/tools'"));
});

test('CMS domain exposes the current guides and component catalog', async () => {
    const config = await text('docs/.vitepress/config.mts');
    const pages = ['getting-started', 'overview', 'data-contract', 'services', 'sanke-editor'];

    for (const page of pages) {
        assert.ok(config.includes('/cms/' + page));
        await access(resolve(root, 'docs/cms', page + '.md'));
    }

    const overview = await text('docs/.vitepress/components/ComponentOverview.vue');
    assert.match(overview, /:href="withBase\(item\.link\)"/);
    assert.match(overview, /const categoryOptions = computed/);
    assert.match(overview, /aria-label="按组件分类筛选"/);
    assert.match(overview, /:aria-pressed="selectedCategory === option\.value"/);
    assert.match(overview, /url\.searchParams\.set\('q', search\)/);
    assert.match(overview, /url\.searchParams\.set\('category', selectedCategory\.value\)/);
    assert.match(overview, /window\.history\.replaceState/);
    assert.match(overview, /window\.addEventListener\('popstate', readUrlState\)/);
    assert.match(overview, /window\.removeEventListener\('popstate', readUrlState\)/);
    const legacyPages = new Map([
        ['cms-usage', '/cms/getting-started'],
        ['component-data', '/cms/data-contract'],
        ['sanke-editor', '/cms/sanke-editor']
    ]);
    for (const [page, destination] of legacyPages) {
        const legacy = await text('docs/guide/' + page + '.md');
        assert.ok(legacy.includes(destination));
    }
});

test('CMS overview owns the container API and the old component route redirects', async () => {
    const overview = await text('docs/cms/overview.md');
    const redirect = await text('docs/components/snake-cms.md');

    for (const section of ['平台兼容性', '基础用法', '注入业务服务', 'API', '扩展组件', '状态与并发', '主题变量']) {
        assert.match(overview, new RegExp(`^## ${section}$`, 'm'), section);
    }
    assert.match(overview, /^### Props$/m);
    assert.match(overview, /^### Events$/m);
    assert.match(overview, /^### Expose$/m);
    assert.match(overview, /^### Slots$/m);
    assert.match(redirect, /^search: false$/m);
    assert.ok(redirect.includes('<RedirectPage to="/cms/overview" />'));
});

test('CMS documentation presents one current protocol without version navigation', async () => {
    const config = await text('docs/.vitepress/config.mts');
    const start = await text('docs/cms/getting-started.md');

    assert.doesNotMatch(config, /CMS v2|v1 旧版|\/cms\/v2\/|\/cms\/legacy\//);
    assert.match(start, /^# CMS 快速接入$/m);
    assert.match(start, /component: 'v2\./);
    assert.match(start, /props: \{/);

    for (const path of [
        'docs/cms/legacy/overview.md',
        'docs/cms/legacy/components.md',
        'docs/cms/component-data.md',
        'docs/cms/components.md'
    ]) {
        await assert.rejects(access(resolve(root, path)), { code: 'ENOENT' });
    }
});

test('every current CMS runtime block has a dedicated contract page and legacy route redirect', async () => {
    const catalog = await text('src/uni_modules/snake-ui/libs/cms/blocks.ts');
    const registry = await text('docs/.vitepress/cms-block-groups.ts');
    const types = [...catalog.matchAll(/'v2\.([a-z]+)':\s*\{\s*version:\s*2/g)].map(match => match[1]);

    assert.equal(types.length, 14);
    for (const name of types) {
        const path = `docs/cms/${name}.md`;
        await access(resolve(root, path));
        const markdown = await text(path);
        assert.match(markdown, new RegExp(`v2\\.${name}`), `${name}: technical identifier`);
        assert.match(markdown, /## 完整信封/, `${name}: full envelope`);
        assert.match(markdown, /## Props/, `${name}: props contract`);
        assert.ok(registry.includes(`/cms/${name}`), `${name}: sidebar entry`);

        const redirect = await text(`docs/cms/v2/${name}.md`);
        assert.match(redirect, /^search: false$/m, `${name}: redirect excluded from search`);
        assert.ok(redirect.includes(`<RedirectPage to="/cms/${name}" />`), `${name}: legacy route redirect`);
    }

    for (const page of ['overview', 'data-contract', 'services']) {
        const redirect = await text(`docs/cms/v2/${page}.md`);
        assert.match(redirect, /^search: false$/m, `${page}: redirect excluded from search`);
        assert.ok(redirect.includes(`<RedirectPage to="/cms/${page}" />`), `${page}: legacy route redirect`);
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
            ...functionFiles
                .filter(file => file.endsWith('.ts'))
                .map(file => text(`src/uni_modules/snake-ui/libs/function/${file}`)),
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
