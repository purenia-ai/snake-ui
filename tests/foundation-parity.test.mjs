import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../src/uni_modules/snake-ui/', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');

test('first parity batch exposes reusable transition and loading foundations', async () => {
    const [entry, declarations, transition, loading] = await Promise.all([
        read('index.ts'),
        read('types/components.d.ts'),
        read('components/snake-transition/snake-transition.vue'),
        read('components/snake-loading-icon/snake-loading-icon.vue')
    ]);
    for (const [name, dir] of [['SnakeTransition', 'snake-transition'], ['SnakeLoadingIcon', 'snake-loading-icon']]) {
        assert.match(entry, new RegExp(`export \\* from './components/${dir}/types'`));
        assert.match(declarations, new RegExp(`export const ${name}:`));
    }
    assert.match(transition, /after-enter/);
    assert.match(transition, /after-leave/);
    assert.match(loading, /mode === 'circle'/);
    assert.match(loading, /v-for="index in 12"/);
});

test('button has full state and native capability contract', async () => {
    const [types, source] = await Promise.all([
        read('components/snake-button/types.ts'),
        read('components/snake-button/snake-button.vue')
    ]);
    for (const prop of ['size', 'shape', 'hoverBgColor', 'rippleBgColor', 'ripple', 'throttleTime', 'openType']) {
        assert.match(types, new RegExp(`${prop}\\?`));
    }
    for (const event of ['getphonenumber', 'chooseavatar', 'agreeprivacyauthorization']) {
        assert.match(source, new RegExp(`@${event}`));
    }
    assert.match(source, /:loading="loading"/);
    for (const type of ['default', 'primary', 'success', 'warning', 'error', 'info']) {
        assert.match(
            source,
            new RegExp(`\\.snake-${type}-plain-hover \\{[^}]*color:[^}]*border-color:[^}]*background-color:`),
            `${type} plain hover should use a filled theme state`
        );
    }
    for (const removed of ['loadingText', 'loadingMode', 'iconColor', 'contentStyle', 'block']) {
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
    for (const prop of ['list', 'current', 'mode', 'activeColor', 'inactiveColor', 'animation', 'buttonColor']) {
        assert.match(types, new RegExp(`${prop}\\?`));
    }
    assert.match(source, /snake-subsection--\$\{mode\}/);
    assert.match(source, /translateX\(\$\{activeIndex\.value \* 100\}%\)/);
    assert.match(source, /emit\('update:current', index\)/);
    assert.match(source, /emit\('change', index\)/);
    assert.doesNotMatch(source, /uni\.\$u|uview-pro|<u-/);
});

test('image, overlay, popup and sticky expose behavioral APIs', async () => {
    const [image, overlay, popup, sticky] = await Promise.all([
        read('components/snake-image/types.ts'),
        read('components/snake-overlay/types.ts'),
        read('components/snake-popup/types.ts'),
        read('components/snake-sticky/types.ts')
    ]);
    for (const prop of ['fade', 'preview', 'showLoading', 'showMenuByLongpress'])
        assert.match(image, new RegExp(`${prop}\\?`));
    for (const prop of ['lockScroll', 'show']) assert.match(overlay, new RegExp(`${prop}\\?`));
    for (const event of ['opened', 'closed', "'click-overlay'"]) assert.match(popup, new RegExp(event));
    for (const event of ['fixed', 'unfixed', 'change']) assert.match(sticky, new RegExp(event));
});

test('lazy image separates placeholder events from the real image lifecycle', async () => {
    const lazyImage = await read('components/snake-lazy-image/snake-lazy-image.vue');

    assert.match(lazyImage, /if \(!visible\.value\) return/);
    assert.match(lazyImage, /snake-lazy-image__status-image/);
    assert.match(lazyImage, /observer\?\.disconnect\(\)/);
});

test('popup exposes overlay scroll locking as a public option', async () => {
    const [source, types] = await Promise.all([
        read('components/snake-popup/snake-popup.vue'),
        read('components/snake-popup/types.ts')
    ]);

    assert.match(types, /lockScroll\?: boolean/);
    assert.match(source, /:lock-scroll="lockScroll"/);
});

test('parity batch does not restore uView runtime names', async () => {
    const paths = [
        'components/snake-transition/snake-transition.vue',
        'components/snake-loading-icon/snake-loading-icon.vue',
        'components/snake-button/snake-button.vue',
        'components/snake-icon/snake-icon.vue',
        'components/snake-image/snake-image.vue',
        'components/snake-lazy-image/snake-lazy-image.vue',
        'components/snake-overlay/snake-overlay.vue',
        'components/snake-popup/snake-popup.vue',
        'components/snake-sticky/snake-sticky.vue'
    ];
    const source = (await Promise.all(paths.map(read))).join('\n');
    assert.doesNotMatch(source, /uni\.\$u|from ['"][^'"]*uview-pro|<u-/);
});
