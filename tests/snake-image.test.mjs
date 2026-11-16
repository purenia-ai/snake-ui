import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { compileTemplate, parse } from 'vue/compiler-sfc';

// snake-image 曾用 `imageKey` 计数器驱动 `<image :key>`，取值 0/1/2… 与编译器给 v-if 链分配的
// 自动 key（1、2）落在同一个 children 数组里，`src` 一变化就必然报
// `Duplicate keys found during update`。下面守住「key 全部由编译器拥有」这条不变量。

const componentUrl = new URL('../src/uni_modules/snake-ui/components/snake-image/snake-image.vue', import.meta.url);
const typesUrl = new URL('../src/uni_modules/snake-ui/components/snake-image/types.ts', import.meta.url);
const filename = 'snake-image.vue';

const readComponent = () => readFile(componentUrl, 'utf8');

function walkTemplate(node, visit) {
    if (node.type !== 0 && node.type !== 1) return;
    visit(node);
    for (const child of node.children ?? []) walkTemplate(child, visit);
}

/** 模板里人为声明的 key：静态 `key="…"` 与动态 `:key="…"` 都算。 */
function declaredKeys(source) {
    const { descriptor, errors } = parse(source, { filename });
    assert.deepEqual(errors, [], 'snake-image.vue should parse without SFC errors');
    const found = [];
    walkTemplate(descriptor.template.ast, node => {
        for (const prop of node.props ?? []) {
            const isStaticKey = prop.type === 6 && prop.name === 'key';
            const isBoundKey = prop.type === 7 && prop.name === 'bind' && prop.arg?.content === 'key';
            if (isStaticKey || isBoundKey) found.push(`<${node.tag}>`);
        }
    });
    return found;
}

test('snake-image leaves every key to the compiler', async () => {
    const source = await readComponent();

    assert.deepEqual(declaredKeys(source), [], 'no manual key may share a children array with compile-time keys');
    assert.doesNotMatch(source, /imageKey/, 'the imageKey counter must stay gone');
});

test('snake-image compiled template binds no expression keys', async () => {
    const source = await readComponent();
    const { descriptor } = parse(source, { filename });
    const { code, errors } = compileTemplate({ source: descriptor.template.content, filename, id: 'snake-image' });

    assert.deepEqual(errors, [], 'template should compile without errors');
    assert.doesNotMatch(code, /imageKey/);

    // 编译器只会为 v-if 链写数字字面量 key；一旦出现表达式 key，就可能与自动 key 撞车。
    const bindings = [...code.matchAll(/\bkey:\s*([^,\n]+)/g)].map(match => match[1].trim());
    for (const binding of bindings) {
        assert.match(binding, /^\d+$/, `compiled key must be a compiler literal, got: ${binding}`);
    }
});

test('snake-image remounts the image through state instead of a key counter', async () => {
    const source = await readComponent();

    assert.match(
        source,
        /const imageRendered = computed\(\(\) => Boolean\(displaySrc\.value\) && status\.value !== 'error' && !remounting\.value\)/
    );
    assert.match(source, /const remounting = ref\(false\)/);
    assert.match(source, /v-if="imageRendered"/);

    // reload 先卸载一帧再挂回，同一地址才会重新发请求；不出现任何 key 操作。
    assert.match(
        source,
        /async function reload\(\) \{[\s\S]*?remounting\.value = true;[\s\S]*?await nextTick\(\);[\s\S]*?remounting\.value = false;[\s\S]*?resetLoadState\(\);[\s\S]*?\n\}/
    );

    // 换地址不再销毁节点：resetLoadState 只重置状态，由原生 image 自己重新请求。
    assert.match(
        source,
        /function resetLoadState\(\) \{\s*disconnectObserver\(\);\s*loadingImageFailed\.value = false;\s*errorImageFailed\.value = false;/
    );
});

test('snake-image splits the placeholders and floors auto height', async () => {
    const source = await readComponent();

    // 两个占位拆成独立 v-if（对齐 wot-ui / uView-Pro）：语义等价，且不再是一条会被分配自动 key 的链。
    assert.doesNotMatch(source, /v-else-if="status === 'error'/);
    assert.match(source, /v-if="isLoading && showLoading"/);
    assert.match(source, /v-if="status === 'error' && showError"/);

    // 图片不占用布局时由占位层撑高，`height="auto"` 的失败态不再塌成 0。
    assert.match(source, /const placeholderInFlow = computed\(\(\) => autoHeight\.value && !imageRendered\.value\)/);
    assert.equal((source.match(/:class="\{ 'snake-image__status--flow': placeholderInFlow \}"/g) ?? []).length, 2);
    assert.match(source, /\.snake-image__status--flow \{[^}]*position: static;/);
});

test('snake-image keeps its public contract', async () => {
    const [source, types] = await Promise.all([readComponent(), readFile(typesUrl, 'utf8')]);

    for (const prop of [
        'fade',
        'preview',
        'showLoading',
        'showError',
        'loadingImg',
        'errorImg',
        'lazyLoad',
        'lazyThreshold'
    ]) {
        assert.match(types, new RegExp(`${prop}\\?:`), `missing prop ${prop}`);
    }
    for (const event of ['load', 'error', 'click']) {
        assert.match(types, new RegExp(`${event}: \\[event: unknown\\]`), `missing emit ${event}`);
    }
    assert.match(types, /reload: \(\) => void/);
    assert.match(source, /defineExpose<ImageExpose>\(\{ reload \}\)/);
    assert.match(source, /<slot name="loading">/);
    assert.match(source, /<slot name="error">/);
});

test('snake-image still owns its lazy loading and artwork fallbacks', async () => {
    const source = await readComponent();

    assert.match(source, /type ImageStatus = 'idle' \| 'loading' \| 'success' \| 'error'/);
    assert.match(source, /relativeToViewport\(\{ top: props\.lazyThreshold, bottom: props\.lazyThreshold \}\)/);
    assert.doesNotMatch(source, /:lazy-load="lazyLoad"/);
    assert.match(source, /v-if="loadingImg && !loadingImageFailed"/);
    assert.match(source, /v-if="errorImg && !errorImageFailed"/);
    assert.match(source, /function onLoadingImageError\(\)/);
    assert.match(source, /function onErrorImageError\(\)/);
});
