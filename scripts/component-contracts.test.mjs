import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../src/uni_modules/snake-ui/', import.meta.url);
const components = [
    'snake-button',
    'snake-loading-icon',
    'snake-transition',
    'snake-empty',
    'snake-icon',
    'snake-image',
    'snake-lazy-image',
    'snake-loadmore',
    'snake-notice-bar',
    'snake-navbar',
    'snake-overlay',
    'snake-popup',
    'snake-sticky',
    'snake-swiper',
    'snake-tabs',
    'snake-button-sort',
    'snake-drop-menu',
    'snake-drop-menu-item',
    'snake-index-list',
    'snake-index-anchor'
];

test('public foundation components use independent type contracts', async () => {
    for (const component of components) {
        const types = await readFile(new URL(`components/${component}/types.ts`, root), 'utf8');
        const source = await readFile(new URL(`components/${component}/${component}.vue`, root), 'utf8');
        assert.match(types, /export (?:interface|type) Snake/);
        assert.match(source, /from '\.\/types'/);
    }
});

test('package entry exposes precise foundation component props', async () => {
    const declarations = await readFile(new URL('types/components.d.ts', root), 'utf8');
    for (const component of [
        'Button',
        'LoadingIcon',
        'Transition',
        'Empty',
        'Icon',
        'Image',
        'LazyImage',
        'Loadmore',
        'NoticeBar',
        'Navbar',
        'Overlay',
        'Popup',
        'Sticky',
        'Swiper',
        'Tabs',
        'ButtonSort',
        'DropMenu',
        'DropMenuItem',
        'IndexList',
        'IndexAnchor'
    ]) {
        assert.match(declarations, new RegExp(`Snake${component}: SnakeComponent<Snake${component}Props`));
    }
});

test('theme stylesheet is published as an optional package entry', async () => {
    const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
    const theme = await readFile(new URL('theme.scss', root), 'utf8');
    assert.equal(manifest.exports['./theme.scss'], './theme.scss');
    assert.ok(manifest.files.includes('theme.scss'));
    assert.match(theme, /--snake-color-primary:/);
});

test('popup and overlay resolve visibility from the actually bound channel', async () => {
    // 回归：Vue 3 对未传递的 Boolean prop 做 boolean casting（false 而非 undefined），
    // `props.show ?? props.modelValue` 会让未绑定 show 的 v-model 通道被 false 短路，弹层永远打不开。
    for (const component of ['snake-overlay', 'snake-popup']) {
        const source = await readFile(new URL(`components/${component}/${component}.vue`, root), 'utf8');
        assert.doesNotMatch(
            source,
            /props\.show\s*\?\?\s*props\.modelValue/,
            `${component} 不能用 ?? 在 show 与 modelValue 间穿透（Boolean casting 下失效）`
        );
        assert.match(
            source,
            /'show' in \(getCurrentInstance\(\)\?\.vnode\?\.props/,
            `${component} 需检测父组件实际绑定的通道`
        );
    }
});

test('icon uses the bundled Snake UI font for stable common glyphs', async () => {
    const source = await readFile(new URL('components/snake-icon/snake-icon.vue', root), 'utf8');
    const types = await readFile(new URL('components/snake-icon/types.ts', root), 'utf8');
    const stylesheet = await readFile(new URL('iconfont.css', root), 'utf8');
    const font = await readFile(new URL('iconfont.woff2', root));
    assert.ok(source.includes("@import '../../iconfont.css'"));
    assert.ok(source.includes("checkmark: 'checkbox-mark'"));
    assert.match(stylesheet, /font-family: ["']snake-iconfont["']/);
    assert.match(stylesheet, /\.sicon-checkbox-mark::?before/);
    assert.match(stylesheet, /content: ["']\\e628["']/);
    assert.match(stylesheet, /url\(.*(x-font-woff2|iconfont\.woff2)/);
    assert.ok(font.length > 0);
    assert.ok(types.includes("'left' | 'right' | 'top' | 'bottom'"));
    assert.ok(source.includes("props.labelPos === 'left'"));
    assert.ok(source.includes("props.labelPos === 'top'"));
    for (const icon of ['search', 'success', 'warning', 'eye-outline', 'arrow-right']) {
        assert.match(stylesheet, new RegExp(`\\.sicon-${icon}::?before`), `${icon}: missing bundled glyph`);
        assert.ok(source.includes(`'${icon}'`), `${icon}: missing component mapping`);
    }
});
