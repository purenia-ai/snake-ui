import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const componentUrl = new URL('../src/uni_modules/snake-ui/components/snake-upload/snake-upload.vue', import.meta.url);
const typesUrl = new URL('../src/uni_modules/snake-ui/components/snake-upload/types.ts', import.meta.url);

test('snake-upload keeps uView Pro upload modes and public queue methods', async () => {
    const source = await readFile(componentUrl, 'utf8');
    for (const token of ["mode === 'list'", 'function upload()', 'function retry(index:', 'function addFiles(', 'deleteItem,']) {
        assert.ok(source.includes(token), `missing ${token}`);
    }
});

test('snake-upload gives uploadRequest priority over action and validates its URL result', async () => {
    const source = await readFile(componentUrl, 'utf8');
    assert.match(source, /if \(!props\.uploadRequest && !props\.action\)/);
    assert.match(source, /if \(props\.uploadRequest\)/);
    assert.match(source, /uploadRequest must return a url/);
    assert.match(source, /onProgress: \(percent: number\)/);
});

test('snake-upload exposes the legacy custom-upload bridge', async () => {
    const source = await readFile(componentUrl, 'utf8');
    assert.match(source, /if \(props\.isCustomUpload\)/);
    assert.match(source, /emit\('customUpload'/);
    assert.match(source, /function onBeforeRead\(/);
    assert.match(source, /chooseFile: chooseLegacyFiles/);
});

test('snake-upload publishes a vendor-neutral custom request contract', async () => {
    const source = await readFile(typesUrl, 'utf8');
    assert.match(source, /export type UploadRequest =/);
    assert.match(source, /files: readonly UploadFileItem\[\]/);
    assert.match(source, /onProgress: \(percent: number\) => void/);
    assert.match(source, /uploadRequest: \{ type: Function as PropType<UploadRequest>/);
});

test('snake-upload gives consumers typed events and keeps list keys stable', async () => {
    const [source, types] = await Promise.all([readFile(componentUrl, 'utf8'), readFile(typesUrl, 'utf8')]);
    assert.match(types, /export type UploadEmits =/);
    assert.match(types, /'update:modelValue': \[files: UploadFileItem\[\]\]/);
    assert.match(types, /customUpload:/);
    assert.match(source, /defineEmits<UploadEmits>\(\)/);
    assert.match(source, /const fileKeys = new WeakMap<UploadFileItem, string>\(\)/);
    assert.equal((source.match(/:key="fileKey\(item\)"/g) || []).length, 2);
});
