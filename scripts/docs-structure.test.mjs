import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');

async function text(path) {
    return readFile(resolve(root, path), 'utf8');
}

test('top navigation owns independent guide, component, and tool domains', async () => {
    const config = await text('docs/.vitepress/config.mts');
    assert.ok(config.includes("{ text: '指南', link: '/guide/getting-started'"));
    assert.ok(config.includes("{ text: '组件', link: '/components/intro'"));
    assert.ok(config.includes("{ text: '工具', link: '/tools/intro', activeMatch: '/tools/' }"));
    assert.ok(config.includes("'/tools/': toolGroups"));
    assert.ok(!config.includes("text: '工具', link: '/guide/tools'"));
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

    const sources = (
        await Promise.all(
            [
                'src/uni_modules/snake-ui/libs/functions/index.ts',
                'src/uni_modules/snake-ui/libs/hooks/index.ts',
                'src/uni_modules/snake-ui/libs/platform.ts',
                'src/uni_modules/snake-ui/libs/request/index.ts'
            ].map(text)
        )
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
        ['docs/tools/http.md', '/pages/tools/http'],
        ['docs/tools/debounce-throttle.md', '/pages/tools/debounce-throttle'],
        ['docs/tools/route.md', '/pages/tools/route'],
        ['docs/tools/use-theme.md', '/pages/tools/theme-locale'],
        ['docs/tools/use-locale.md', '/pages/tools/theme-locale']
    ]);

    for (const [file, route] of previews) {
        assert.match(await text(file), new RegExp(`^preview: ${route}$`, 'm'));
        assert.match(pages, new RegExp(`"path": "${route.split('/').at(-1)}"`));
        await access(resolve(root, 'src', `${route.slice(1)}.vue`));
    }
});
