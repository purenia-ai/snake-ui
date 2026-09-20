import assert from 'node:assert/strict';
import test from 'node:test';
import { getTooltipArrowPosition } from '../src/uni_modules/snake-ui/components/snake-tooltip/position.ts';

test('tooltip arrow follows the trigger center for start and end placements', () => {
    const target = { left: 80, top: 120, width: 64, height: 32 };
    const panel = { left: 80, top: 160, width: 160, height: 50 };
    assert.deepEqual(getTooltipArrowPosition('bottom-start', target, panel, 8), { x: 28 });
    assert.deepEqual(getTooltipArrowPosition('top-end', target, panel, 8), { x: 28 });
});

test('tooltip arrow follows the vertical target center for side placements', () => {
    const target = { left: 160, top: 120, width: 64, height: 40 };
    const panel = { left: 20, top: 100, width: 120, height: 100 };
    assert.deepEqual(getTooltipArrowPosition('left-start', target, panel, 8), { y: 36 });
    assert.deepEqual(getTooltipArrowPosition('right-end', target, panel, 8), { y: 36 });
});

test('tooltip arrow remains inside the panel when the target is near an edge', () => {
    const panel = { left: 20, top: 20, width: 100, height: 40 };
    assert.deepEqual(getTooltipArrowPosition('bottom', { left: 0, top: 0, width: 20, height: 20 }, panel, 8), { x: 8 });
    assert.deepEqual(getTooltipArrowPosition('top', { left: 140, top: 0, width: 20, height: 20 }, panel, 8), { x: 84 });
});
