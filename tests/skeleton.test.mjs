import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../src/uni_modules/snake-ui/components/', import.meta.url);

test('skeleton exposes stable defaults and switches between template and content slots', async () => {
    const source = await readFile(new URL('snake-skeleton/snake-skeleton.vue', root), 'utf8');

    assert.match(source, /loading:\s*true/);
    assert.match(source, /animated:\s*true/);
    assert.match(source, /rows:\s*3/);
    assert.match(source, /titleWidth:\s*'40%'/);
    assert.match(source, /<slot v-if="\$slots\.template" name="template"\s*\/>/);
    assert.match(source, /<slot v-else\s*\/>/);
});

test('skeleton rows shorten the final width and keep a safe height fallback', async () => {
    const source = await readFile(new URL('snake-skeleton/snake-skeleton.vue', root), 'utf8');

    assert.match(source, /resolveRowValue\(props\.rowsWidth, index, count, '100%', true\)/);
    assert.match(source, /resolveRowValue\(props\.rowsHeight, index, count, 16, false\)/);
    assert.match(source, /index === count - 1 \? '70%' : fallback/);
});

test('skeleton items inherit animation while allowing an explicit override', async () => {
    const source = await readFile(new URL('snake-skeleton-item/snake-skeleton-item.vue', root), 'utf8');
    const types = await readFile(new URL('snake-skeleton-item/types.ts', root), 'utf8');

    assert.match(source, /props\.animated \?\? context\?\.animated\.value \?\? true/);
    assert.match(source, /snake-skeleton-item--animated/);
    assert.match(types, /'text' \| 'rect' \| 'circle' \| 'image'/);
});
