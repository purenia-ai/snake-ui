import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const componentUrl = new URL('../src/uni_modules/snake-ui/components/snake-upload/snake-upload.vue', import.meta.url);
const typesUrl = new URL('../src/uni_modules/snake-ui/components/snake-upload/types.ts', import.meta.url);

test('snake-upload keeps both display modes and public queue methods', async () => {
    const source = await readFile(componentUrl, 'utf8');
    for (const token of [
        "mode === 'list'",
        'function upload()',
        'function retry(index:',
        'function addFiles(',
        'deleteItem'
    ]) {
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

test('snake-upload no longer ships the legacy custom-upload bridge', async () => {
    const [source, types] = await Promise.all([readFile(componentUrl, 'utf8'), readFile(typesUrl, 'utf8')]);
    for (const token of [
        'isCustomUpload',
        'customUpload',
        'onBeforeRead',
        'chooseLegacyFiles',
        'afterRead',
        'clickPreview'
    ]) {
        assert.ok(!source.includes(token), `unexpected ${token} in component`);
        assert.ok(!types.includes(token), `unexpected ${token} in types`);
    }
    assert.match(source, /if \(props\.customChoose\)/);
    assert.match(source, /emit\('on-choose'/);
});

test('snake-upload publishes a vendor-neutral custom request contract', async () => {
    const source = await readFile(typesUrl, 'utf8');
    assert.match(source, /export type UploadRequest =/);
    assert.match(source, /files: readonly UploadFileItem\[\]/);
    assert.match(source, /onProgress: \(percent: number\) => void/);
    assert.match(source, /uploadRequest: \{ type: Function as PropType<UploadRequest>/);
});

test('snake-upload lets hosts gate choosing and preview, configure success codes, and abort', async () => {
    const [source, types] = await Promise.all([readFile(componentUrl, 'utf8'), readFile(typesUrl, 'utf8')]);
    assert.match(types, /successStatus: \{ type: \[Number, Array\] as PropType<number \| number\[\]>/);
    assert.match(types, /beforeChoose: \{ type: Function as PropType<UploadBeforeChoose>/);
    assert.match(types, /beforePreview: \{ type: Function as PropType<UploadBeforePreview>/);
    assert.match(types, /registerAbort: \(abort: \(\) => void\) => void/);
    assert.match(types, /abort: \(index\?: number\) => void/);
    assert.match(source, /const successCodes = Array\.isArray\(props\.successStatus\)/);
    assert.match(source, /async function passBeforeChoose/);
    assert.match(source, /async function passBeforePreview/);
    assert.match(source, /function abort\(index\?: number\)/);
});

test('snake-upload merges uploadRequest metadata onto the file item', async () => {
    const source = await readFile(componentUrl, 'utf8');
    assert.match(
        source,
        /const \{ url: remoteUrl, name: remoteName, response: remoteResponse, \.\.\.metadata \} = normalized;/
    );
    assert.match(source, /Object\.assign\(currentFile, metadata\)/);
});

test('snake-upload gives consumers typed events and keeps list keys stable', async () => {
    const [source, types] = await Promise.all([readFile(componentUrl, 'utf8'), readFile(typesUrl, 'utf8')]);
    assert.match(types, /export type UploadEmits =/);
    assert.match(types, /'update:modelValue': \[files: UploadFileItem\[\]\]/);
    for (const legacy of ['customUpload:', 'afterRead:', 'clickPreview:']) {
        assert.ok(!types.includes(legacy), `unexpected ${legacy}`);
    }
    assert.match(source, /defineEmits<UploadEmits>\(\)/);
    assert.match(source, /const fileKeys = new WeakMap<UploadFileItem, string>\(\)/);
    assert.equal((source.match(/:key="fileKey\(item\)"/g) || []).length, 2);
});
