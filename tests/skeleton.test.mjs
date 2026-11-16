import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../src/uni_modules/snake-ui/components/', import.meta.url);
const skeletonPath = new URL('snake-skeleton/snake-skeleton.vue', root);
const itemPath = new URL('snake-skeleton-item/snake-skeleton-item.vue', root);

test('skeleton exposes stable defaults and switches between template and content slots', async () => {
    const source = await readFile(skeletonPath, 'utf8');

    assert.match(source, /loading:\s*true/);
    assert.match(source, /animated:\s*true/);
    assert.match(source, /animation:\s*undefined/);
    assert.match(source, /rows:\s*3/);
    assert.match(source, /titleWidth:\s*'40%'/);
    // 尺寸默认值对齐 wot-ui / uView-Pro 的量级（0.0.6 单位迁移时被机械折半过）
    assert.match(source, /titleHeight:\s*16/);
    assert.match(source, /rowsHeight:\s*12/);
    assert.match(source, /avatarSize:\s*32/);
    assert.match(source, /<slot v-if="\$slots\.template" name="template"\s*\/>/);
    assert.match(source, /<slot v-else\s*\/>/);
});

test('skeleton rows shorten the final width and keep a safe height fallback', async () => {
    const source = await readFile(skeletonPath, 'utf8');

    assert.match(source, /resolveRowValue\(props\.rowsWidth, index, count, '100%', true\)/);
    assert.match(source, /resolveRowValue\(props\.rowsHeight, index, count, 8, false\)/);
    assert.match(source, /index === count - 1 \? '70%' : fallback/);
});

test('skeleton resolves animation with animation taking precedence over the deprecated animated flag', async () => {
    const source = await readFile(skeletonPath, 'utf8');

    assert.match(source, /if \(props\.animation\) return props\.animation;/);
    assert.match(source, /props\.animated === false \? 'none' : 'shimmer'/);
    assert.match(source, /provide\(SNAKE_SKELETON_CONTEXT, \{ animation: resolvedAnimation \}\)/);
});

test('skeleton item animation falls back to the container context', async () => {
    const source = await readFile(itemPath, 'utf8');
    const types = await readFile(new URL('snake-skeleton-item/types.ts', root), 'utf8');

    assert.match(source, /if \(props\.animated === false\) return 'none';/);
    assert.match(source, /if \(props\.animated === true\) return 'shimmer';/);
    assert.match(source, /context\?\.animation\.value \?\? 'shimmer'/);
    assert.match(source, /snake-skeleton-item--animation-\$\{resolvedAnimation\}/);
    assert.match(types, /'text' \| 'rect' \| 'circle' \| 'image'/);
    assert.match(types, /animation: ComputedRef<SkeletonAnimation>/);
});

test('skeleton item sizes fall back to theme tokens instead of inline defaults', async () => {
    const source = await readFile(itemPath, 'utf8');

    assert.match(source, /if \(props\.size !== undefined\) \{/);
    assert.match(source, /style\.width = addUnit\(props\.size\);/);
    assert.match(source, /style\.height = addUnit\(props\.size\);/);
    assert.match(source, /if \(props\.width !== undefined\) style\.width = addUnit\(props\.width\);/);
    assert.match(source, /if \(props\.height !== undefined\) style\.height = addUnit\(props\.height\);/);
    assert.match(source, /if \(props\.radius !== undefined\) style\.borderRadius = addUnit\(props\.radius\);/);
    // 占位块默认尺寸不再写死在内联样式里，否则主题变量永远改不动
    assert.doesNotMatch(source, /width:\s*'100%',\s*height:\s*'100px'/);
});

test('skeleton spacing is driven by classes so the layout tokens stay themable', async () => {
    const source = await readFile(skeletonPath, 'utf8');

    assert.match(source, /--snake-skeleton-avatar-gap/);
    assert.match(source, /--snake-skeleton-title-gap/);
    assert.match(source, /--snake-skeleton-row-gap/);
    assert.doesNotMatch(source, /marginTop/);
});

test('skeleton item styles consume every documented token', async () => {
    const source = await readFile(itemPath, 'utf8');

    for (const token of [
        '--snake-skeleton-color',
        '--snake-skeleton-highlight',
        '--snake-skeleton-text-height',
        '--snake-skeleton-text-radius',
        '--snake-skeleton-rect-height',
        '--snake-skeleton-rect-radius',
        '--snake-skeleton-circle-size',
        '--snake-skeleton-circle-radius',
        '--snake-skeleton-shimmer-duration',
        '--snake-skeleton-pulse-duration'
    ]) {
        assert.ok(source.includes(token), `${token} missing from snake-skeleton-item styles`);
    }
});

test('skeleton placeholder color follows the theme instead of a fixed grey', async () => {
    const source = await readFile(itemPath, 'utf8');

    // 占位底色取主题 muted 表面色，明暗模式自动切换
    assert.match(
        source,
        /background-color: var\(--snake-skeleton-color, var\(--snake-color-surface-muted, #f1f1f1\)\)/
    );
    // 流光带是叠加在底色上的半透明高亮：透明 → 高亮 → 透明
    assert.match(source, /transparent 25%/);
    assert.match(source, /var\(--snake-skeleton-highlight, rgba\(120, 120, 130, 0\.12\)\) 37%/);
    assert.match(source, /transparent 63%/);
});

test('skeleton exposes loading semantics to screen readers', async () => {
    const source = await readFile(skeletonPath, 'utf8');

    assert.match(source, /:aria-busy="loading \? 'true' : 'false'"/);
    assert.match(source, /:aria-label="loading \? label \|\| undefined : undefined"/);
    assert.match(source, /class="snake-skeleton__wrapper" aria-hidden="true"/);
});

test('skeleton respects reduced motion for both animation kinds', async () => {
    const source = await readFile(itemPath, 'utf8');

    assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
    assert.match(source, /animation: snake-skeleton-shimmer var\(--snake-skeleton-shimmer-duration, 1\.8s\)/);
    assert.match(source, /animation: snake-skeleton-pulse var\(--snake-skeleton-pulse-duration, 2s\)/);
});
