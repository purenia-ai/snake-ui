import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');
const text = path => readFile(resolve(root, path), 'utf8');

async function markdownFiles(directory) {
    const entries = await readdir(resolve(root, directory), { withFileTypes: true });
    const nested = await Promise.all(
        entries.map(entry => {
            const path = `${directory}/${entry.name}`;
            return entry.isDirectory() ? markdownFiles(path) : path.endsWith('.md') ? [path] : [];
        })
    );
    return nested.flat();
}

test('documentation config provides unique page descriptions and contribution links', async () => {
    const config = await text('docs/.vitepress/config.mts');
    const actions = await text('docs/.vitepress/theme/DocActions.vue');

    assert.match(config, /transformPageData\(pageData\)/);
    assert.match(config, /resolvePageDescription/);
    assert.match(config, /frontmatter\.search === false/);
    assert.match(config, /edit\/main\/docs\/:path/);
    assert.match(actions, /查看组件源码/);
    assert.match(actions, /issues\/new/);
});

test('catalog metadata powers descriptive component search', async () => {
    const registry = await text('docs/.vitepress/component-groups.ts');
    const overview = await text('docs/.vitepress/components/ComponentOverview.vue');

    for (const field of ['description', 'keywords', 'source']) assert.match(registry, new RegExp(`${field}:`));
    assert.match(overview, /item\.description/);
    assert.match(overview, /\.\.\.item\.keywords/);
    assert.match(overview, /搜索全部文档/);
    assert.match(overview, /name="component-search"/);
});

test('canonical internal markdown links resolve to documents', async () => {
    const files = (
        await Promise.all(['docs/guide', 'docs/components', 'docs/cms', 'docs/tools'].map(markdownFiles))
    ).flat();

    for (const file of files) {
        const markdown = await text(file);
        for (const match of markdown.matchAll(/\]\((\/[a-z0-9][^\s)#]*)(?:#[^)]+)?\)/gi)) {
            const route = match[1];
            const target = route === '/' ? 'docs/index.md' : `docs${route}.md`;
            await assert.doesNotReject(access(resolve(root, target)), `${file}: missing ${route}`);
        }
    }
});

test('theme generator exposes labelled fields and a keyboard-contained dialog', async () => {
    const generator = await text('docs/.vitepress/components/ThemeGenerate.vue');

    assert.match(generator, /aria-modal="true"/);
    assert.match(generator, /aria-labelledby="tg-dialog-title"/);
    assert.match(generator, /function onDialogKeydown/);
    assert.match(generator, /event\.key === 'Escape'/);
    assert.match(generator, /pickerTrigger\?\.focus\(\)/);
    assert.match(generator, /name="theme-name"/);
    assert.match(generator, /name="theme-color-value"/);
    assert.match(generator, /aria-live="polite"/);
});

test('preview layout protects reading width at common desktop sizes', async () => {
    const css = await text('docs/.vitepress/theme/custom.css');

    assert.match(css, /@media \(min-width: 1280px\) and \(max-width: 1599px\)/);
    assert.match(css, /\.snake-preview-layout \.VPDoc\.has-aside \.aside\s*{\s*display: none;/);
    assert.match(css, /\.dark\s*{[\s\S]*?color-scheme: dark;/);
    assert.match(css, /\.doc-actions/);
});
