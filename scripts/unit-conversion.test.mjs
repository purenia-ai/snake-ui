import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { addUnit, pxToRpx } from '../src/uni_modules/snake-ui/libs/function/unit.ts';

test('addUnit preserves explicit units and applies a default to numeric values', () => {
    assert.equal(addUnit(12), '12px');
    assert.equal(addUnit('12', 'rpx'), '12rpx');
    assert.equal(addUnit('50%'), '50%');
});

test('pxToRpx converts physical pixels using the current viewport width', () => {
    assert.equal(pxToRpx(12, 375), '24rpx');
    assert.equal(pxToRpx('7.5', 375), '15rpx');
});

test('pxToRpx safely handles invalid values and viewport widths', () => {
    assert.equal(pxToRpx(undefined, 375), '0rpx');
    assert.equal(pxToRpx('invalid', 375), '0rpx');
    assert.equal(pxToRpx(12, 0), '0rpx');
});

test('components do not depend on a custom uni.$u.pxTorpx extension', async () => {
    const componentPaths = [
        'src/uni_modules/snake-ui/components/snake-graphic-navigation/snake-graphic-navigation.vue',
        'src/uni_modules/snake-ui/components/snake-magic-cube/snake-magic-cube.vue'
    ];
    const sources = await Promise.all(componentPaths.map(path => readFile(path, 'utf8')));
    assert.equal(
        sources.some(source => source.includes('uni.$u.pxTorpx')),
        false
    );
});

test('Options API exposes pxToRpx to the graphic navigation template', async () => {
    const source = await readFile(
        'src/uni_modules/snake-ui/components/snake-graphic-navigation/snake-graphic-navigation.vue',
        'utf8'
    );
    assert.match(source, /methods:\s*{\s*pxToRpx,?\s*}/);
});
