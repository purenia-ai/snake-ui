import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');
const text = path => readFile(resolve(root, path), 'utf8');

test('documentation homepage uses the dedicated product landing page', async () => {
    const index = await text('docs/index.md');
    const theme = await text('docs/.vitepress/theme/index.ts');
    const homepage = await text('docs/.vitepress/components/HomePage.vue');

    assert.match(index, /^layout: page$/m);
    assert.match(index, /<HomePage \/>/);
    assert.match(theme, /app\.component\('HomePage', HomePage\)/);
    assert.match(homepage, /把商城页面/);
    assert.match(homepage, /WHY SNAKE UI/);
    assert.match(homepage, /POPULAR PICKS/);
    assert.match(homepage, /LIVE EXPERIENCE/);
});

test('homepage statistics are derived from registries instead of invented metrics', async () => {
    const homepage = await text('docs/.vitepress/components/HomePage.vue');

    assert.match(homepage, /componentCount/);
    assert.match(homepage, /filter\(item => item\.cms\)/);
    assert.match(homepage, /toolGroups\.reduce/);
    assert.match(homepage, /supportedPlatforms\.length/);
    assert.match(homepage, /class="snake-stat-card__icon"/);
    assert.doesNotMatch(homepage, /下载量|访问量|用户数|合作伙伴数量/);
});

test('homepage links use the canonical documentation and repository addresses', async () => {
    const homepage = await text('docs/.vitepress/components/HomePage.vue');

    assert.match(homepage, /withBase\(path\)/);
    assert.match(homepage, /https:\/\/m\.puresnake\.com\/snake-ui\/h5\//);
    assert.match(homepage, /https:\/\/github\.com\/zwbcode\/snake-ui/);
    assert.match(homepage, /internalLink\('\/components\/quickstart'\)/);
    assert.doesNotMatch(homepage, /internalLink\('\/guide\/getting-started'\)/);
    assert.doesNotMatch(homepage, /r2nd\.github\.io/);
});

test('homepage exposes a copyable package installation command', async () => {
    const homepage = await text('docs/.vitepress/components/HomePage.vue');

    assert.match(homepage, /pnpm add @puresnake\/snake-ui/);
    assert.match(homepage, /navigator\.clipboard\.writeText\(installCommand\)/);
    assert.match(homepage, /aria-live="polite"/);
});

test('homepage styles cover themes, narrow screens, and reduced motion', async () => {
    const styles = await text('docs/.vitepress/theme/custom.css');

    assert.match(styles, /\.dark \.snake-home/);
    assert.match(styles, /@media \(max-width: 640px\)/);
    assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
    assert.match(styles, /\.snake-orbit__halo/);
    assert.match(styles, /\.snake-feature-card:hover/);
    assert.match(styles, /transition: none !important/);
});
