import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../src/uni_modules/snake-ui/', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');

// 旧运行时标识模式（拼串书写，避免源码出现第三方库名）。
const legacyRuntimePattern = new RegExp(`uni\\.\\$u|${['u', 'view'].join('')}-pro|<u-`);

test('first parity batch exposes reusable transition and loading foundations', async () => {
    const [entry, declarations, transition, loading] = await Promise.all([
        read('index.ts'),
        read('types/components.d.ts'),
        read('components/snake-transition/snake-transition.vue'),
        read('components/snake-loading/snake-loading.vue')
    ]);
    for (const [name, dir] of [
        ['Transition', 'snake-transition'],
        ['Loading', 'snake-loading']
    ]) {
        assert.match(entry, new RegExp(`export \\* from './components/${dir}/types'`));
        assert.match(declarations, new RegExp(`export const Snake${name}:`));
    }
    assert.match(transition, /after-enter/);
    assert.match(transition, /after-leave/);
    assert.match(loading, /type === 'circular'/);
    assert.match(loading, /v-for="index in spinnerDots"/);
});

test('button has full state and native capability contract', async () => {
    const [types, source] = await Promise.all([
        read('components/snake-button/types.ts'),
        read('components/snake-button/snake-button.vue')
    ]);
    for (const prop of [
        'size',
        'shape',
        'block',
        'rippleBgColor',
        'ripple',
        'hoverClass',
        'throttleTime',
        'openType'
    ]) {
        assert.match(types, new RegExp(`${prop}\\?`));
    }
    for (const event of ['getphonenumber', 'chooseavatar', 'agreeprivacyauthorization']) {
        assert.match(source, new RegExp(`@${event}`));
    }
    assert.match(source, /<snake-loading/);
    assert.match(source, /v-if="loading"/);
    assert.match(source, /:open-type="disabled \|\| loading \? undefined : openType \|\| undefined"/);
    // 镂空按钮按压态只加深文字与描边，浅色底不反转为实心（见组件内注释）
    for (const type of ['default', 'primary', 'success', 'warning', 'error', 'info']) {
        assert.match(
            source,
            new RegExp(`\\.snake-${type}-plain-hover \\{[^}]*color:[^}]*border-color:`),
            `${type} plain hover should deepen text and border`
        );
        assert.doesNotMatch(
            source,
            new RegExp(`\\.snake-${type}-plain-hover \\{[^}]*background:`),
            `${type} plain hover must not flip to a solid fill`
        );
    }
    for (const removed of ['hoverBgColor', 'loadingText', 'loadingMode', 'iconColor', 'contentStyle']) {
        assert.doesNotMatch(types, new RegExp(`${removed}\\?`));
    }
});

test('subsection exposes animated button and outlined selection modes', async () => {
    const [entry, declarations, types, source] = await Promise.all([
        read('index.ts'),
        read('types/components.d.ts'),
        read('components/snake-subsection/types.ts'),
        read('components/snake-subsection/snake-subsection.vue')
    ]);

    assert.match(entry, /export \* from '\.\/components\/snake-subsection\/types'/);
    assert.match(declarations, /export const SnakeSubsection:/);
    for (const prop of [
        'list',
        'current',
        'mode',
        'activeColor',
        'inactiveColor',
        'animation',
        'buttonColor',
        'vibrateShort'
    ]) {
        assert.match(types, new RegExp(`${prop}\\?`));
    }
    assert.match(source, /snake-subsection--\$\{mode\}/);
    assert.match(source, /translateX\(\$\{activeIndex\.value \* 100\}%\)/);
    assert.match(source, /emit\('update:current', index\)/);
    assert.match(source, /emit\('change', index\)/);
    // 选中态内部兜底：只传 :current 不监听事件时点击也要生效，父级回写 current 时以 prop 为准
    assert.match(source, /const innerIndex = ref\(normalizeIndex\(props\.current\)\)/);
    assert.match(source, /innerIndex\.value = index/);
    assert.match(source, /watch\(\s*\(\) => \[props\.current, props\.list\.length\]/);
    // 切换震动与整组禁用
    assert.match(types, /disabled\?: boolean/);
    assert.match(source, /uni\.vibrateShort/);
    assert.match(source, /if \(props\.disabled\) return/);
    // 胶囊滑块模式没有描边：占位透明边框要收掉，内容区才和描边模式等高
    assert.match(source, /borderWidth: props\.mode === 'subsection' \? '1px' : '0'/);
    assert.match(source, /fontSize: 15/);
    assert.doesNotMatch(source, legacyRuntimePattern);
});

test('image, overlay, popup and sticky expose behavioral APIs', async () => {
    const [image, overlay, popup, sticky] = await Promise.all([
        read('components/snake-image/types.ts'),
        read('components/snake-overlay/types.ts'),
        read('components/snake-popup/types.ts'),
        read('components/snake-sticky/types.ts')
    ]);
    for (const prop of [
        'fade',
        'preview',
        'showLoading',
        'showMenuByLongpress',
        'lazyLoad',
        'lazyThreshold',
        'loadingImg',
        'errorImg'
    ])
        assert.match(image, new RegExp(`${prop}\\?`));
    assert.match(image, /ImageExpose/);
    for (const prop of ['lockScroll', 'show']) assert.match(overlay, new RegExp(`${prop}\\?`));
    for (const event of ['opened', 'closed', "'click-overlay'"]) assert.match(popup, new RegExp(event));
    for (const event of ['fixed', 'unfixed', 'change']) assert.match(sticky, new RegExp(event));
});

test('size props used in geometry arithmetic parse units instead of NaN-ing', async () => {
    // barWidth="50rpx" 一类带单位尺寸参与 Number() 运算会得到 NaN，使滑块 translate 整条失效；
    // 这些落点必须经 unitToPx 解析。
    const [unit, tabs, circle, readMore] = await Promise.all([
        read('libs/function/unit.ts'),
        read('components/snake-tabs/snake-tabs.vue'),
        read('components/snake-circle-progress/snake-circle-progress.vue'),
        read('components/snake-read-more/snake-read-more.vue')
    ]);
    assert.match(unit, /export function unitToPx/);
    assert.match(tabs, /unitToPx\(props\.barWidth\)/);
    assert.match(tabs, /unitToPx\(props\.barHeight\)/);
    assert.match(circle, /unitToPx\(props\.width\)/);
    assert.match(circle, /unitToPx\(props\.borderWidth\)/);
    assert.match(readMore, /unitToPx\(props\.showHeight\)/);
    for (const source of [tabs, circle, readMore]) {
        assert.doesNotMatch(source, /Number\(props\.(barWidth|barHeight|width|borderWidth|showHeight)\)/);
    }
});

test('image owns viewport lazy loading and configured state artwork', async () => {
    const [image, iconfont] = await Promise.all([read('components/snake-image/snake-image.vue'), read('iconfont.css')]);

    assert.match(image, /type ImageStatus = 'idle' \| 'loading' \| 'success' \| 'error'/);
    assert.match(image, /relativeToViewport\(\{ top: props\.lazyThreshold, bottom: props\.lazyThreshold \}\)/);
    assert.match(image, /v-if="loadingImg && !loadingImageFailed"/);
    assert.match(image, /v-if="errorImg && !errorImageFailed"/);
    assert.match(image, /@error="onLoadingImageError"/);
    assert.match(image, /@error="onErrorImageError"/);
    assert.match(image, /if \(props\.lazyLoad\) resetLoadState\(\)/);
    assert.match(image, /errorIcon: 'error-circle'/);
    // 加载态兜底是静态图标（对齐 uView-Pro），动画只能由业务通过 loading 插槽显式声明
    assert.match(image, /loadingIcon: 'photo'/);
    assert.doesNotMatch(image, /<snake-loading/);
    assert.match(image, /const statusSize = computed/);
    assert.match(image, /:size="statusSize"/);
    assert.match(iconfont, /\.sicon-error-circle:before/);
    assert.match(iconfont, /\.sicon-photo:before/);
    assert.match(image, /onBeforeUnmount\(disconnectObserver\)/);
    // 重挂由状态驱动：不写 :key，避免与 v-if 链的编译期自动 key 撞车（见 tests/snake-image.test.mjs）
    assert.match(image, /v-if="imageRendered"/);
    assert.match(image, /status\.value !== 'error'/);
    assert.match(image, /const remounting = ref\(false\)/);
    assert.match(image, /await nextTick\(\)/);
    assert.doesNotMatch(image, /:key=/);
    assert.doesNotMatch(image, /imageKey/);
    assert.doesNotMatch(image, /:lazy-load="lazyLoad"/);
    assert.match(image, /status\.value === 'success'/);
    assert.match(image, /defineExpose<ImageExpose>\(\{ reload \}\)/);
});

test('popup exposes overlay scroll locking as a public option', async () => {
    const [source, types] = await Promise.all([
        read('components/snake-popup/snake-popup.vue'),
        read('components/snake-popup/types.ts')
    ]);

    assert.match(types, /lockScroll\?: boolean/);
    assert.match(source, /:lock-scroll="lockScroll"/);
});

test('parity batch does not restore legacy runtime names', async () => {
    const paths = [
        'components/snake-transition/snake-transition.vue',
        'components/snake-loading/snake-loading.vue',
        'components/snake-button/snake-button.vue',
        'components/snake-icon/snake-icon.vue',
        'components/snake-image/snake-image.vue',
        'components/snake-overlay/snake-overlay.vue',
        'components/snake-popup/snake-popup.vue',
        'components/snake-sticky/snake-sticky.vue'
    ];
    const source = (await Promise.all(paths.map(read))).join('\n');
    assert.doesNotMatch(source, new RegExp(`uni\\.\\$u|from ['"][^'"]*${['u', 'view'].join('')}-pro|<u-`));
});
