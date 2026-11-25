import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
const root = new URL('../src/uni_modules/snake-ui/', import.meta.url);
const workspaceRoot = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const readWorkspace = path => readFile(new URL(path, workspaceRoot), 'utf8');

test('avatar falls back in the documented order: slot, image, text, icon', async () => {
    const source = await read('components/snake-avatar/snake-avatar.vue');

    // 回退链的先后顺序必须和文档一致，否则占位内容会互相抢显示位
    const markers = ['<slot v-if="hasDefaultSlot"', 'v-else-if="showImage"', 'v-else-if="showText"', '<SnakeIcon'];
    const positions = markers.map(marker => source.indexOf(marker));
    positions.forEach((position, index) => assert.ok(position > -1, `${markers[index]}: missing branch`));
    assert.deepEqual(
        [...positions].sort((left, right) => left - right),
        positions,
        'fallback order must match docs'
    );

    assert.match(source, /const showImage = computed\(\(\) => Boolean\(props\.src\) && !failed\.value\)/);
    assert.match(source, /const showText = computed\(\(\) => !showImage\.value && Boolean\(props\.text\)\)/);
    // 文字兜底原样渲染，组件不截首字符；内置图标是最后一级兜底
    assert.doesNotMatch(source, /props\.text\.slice|props\.text\[0\]|slice\(0, 1\)/);
    assert.match(source, /const BUILT_IN_ICON = 'account'/);
    assert.match(source, /const iconName = computed\(\(\) => props\.icon \|\| BUILT_IN_ICON\)/);
});

test('avatar degrades once per failed address and retries after src changes', async () => {
    const source = await read('components/snake-avatar/snake-avatar.vue');

    // 小程序端可能重复触发 error，失败态置位后不再重复派发
    assert.match(source, /function onError\(event: unknown\) \{[\s\S]{0,120}?if \(failed\.value\) return;/);
    assert.match(source, /failed\.value = true;[\s\S]{0,80}?emit\('error', event\)/);
    assert.match(source, /watch\(\s*\(\) => props\.src,\s*\(\) => \{\s*failed\.value = false;\s*\}\s*\)/);
    assert.match(source, /@error="onError"/);
    assert.match(source, /function onClick\(\) \{\s*emit\('click'\);/);
});

test('avatar inherits size and shape from the group and hides folded items', async () => {
    const [types, source] = await Promise.all([
        read('components/snake-avatar/types.ts'),
        read('components/snake-avatar/snake-avatar.vue')
    ]);

    assert.match(source, /useParent\(AVATAR_GROUP_KEY\)/);
    assert.match(source, /props\.size \?\? avatarGroup\.value\?\.props\.size \?\? DEFAULT_SIZE/);
    assert.match(source, /props\.shape \?\? avatarGroup\.value\?\.props\.shape \?\? 'circle'/);
    // 折叠项不渲染，而不是 display:none，否则负 margin 与计数都会失真
    assert.match(source, /return group \? index\.value >= group\.visibleCount\.value : false;/);
    assert.match(source, /v-if="!isHidden"/);
    // 字号按尺寸现算成 px：rpx 进 calc() 在小程序端不稳
    assert.match(source, /Math\.round\(sizePx\.value \* 0\.4\)/);
    assert.match(source, /const zIndex = computed/);
    assert.match(source, /'first-on-top'/);

    for (const name of ['src', 'text', 'icon', 'shape', 'size', 'radius', 'fontSize', 'bgColor', 'color', 'fit']) {
        assert.match(types, new RegExp(`${name}\\?:`), name);
    }
    assert.match(types, /export interface AvatarProps/);
    assert.match(types, /export type AvatarEmits/);
    // size / shape 刻意不给默认值，才能区分「没传」与「传了默认值」
    assert.match(types, /shape: \{ type: String as PropType<AvatarShape>, default: undefined \}/);
    assert.match(types, /size: \{ type: \[String, Number\] as PropType<UnitValue>, default: undefined \}/);
});

test('avatar group counts, folds and stacks against the registered children', async () => {
    const [types, source] = await Promise.all([
        read('components/snake-avatar-group/types.ts'),
        read('components/snake-avatar-group/snake-avatar-group.vue')
    ]);

    assert.match(source, /useChildren<AvatarGroupChild, AvatarGroupContext>\(AVATAR_GROUP_KEY\)/);
    assert.match(source, /linkChildren\(\{ props, visibleCount, overlap \}\)/);
    // total 与已注册子项数取大者：只渲染部分子项时才算得对剩余量
    assert.match(source, /Math\.max\(Number\(props\.total\) \|\| 0, children\.length\)/);
    assert.match(source, /Math\.min\(maxCountValue\.value, effectiveTotal\.value\)/);
    assert.match(
        source,
        /const restCount = computed\(\(\) => Math\.max\(0, effectiveTotal\.value - visibleCount\.value\)\)/
    );
    assert.match(source, /props\.collapseText \|\| `\+/);
    // 重叠距离未传时按尺寸的四分之一折算成 px
    assert.match(source, /Math\.round\(unitToPx\(resolvedSize\.value\) \* 0\.25\)/);
    assert.match(source, /String\(props\.cascading === 'first-on-top' \? 0 : visibleCount\.value \+ 1\)/);
    assert.match(
        source,
        /var\(--snake-avatar-ring-width, 2px\) var\(--snake-avatar-ring-color, var\(--snake-color-surface\)\)/
    );

    for (const name of ['size', 'shape', 'maxCount', 'total', 'collapseText', 'overlap', 'cascading']) {
        assert.match(types, new RegExp(`${name}\\?:`), name);
    }
    assert.match(types, /export interface AvatarGroupProps/);
    assert.match(types, /export interface AvatarGroupContext/);
    assert.match(
        types,
        /export const AVATAR_GROUP_KEY: InjectionKey<AvatarGroupContext> = Symbol\('snake-avatar-group'\)/
    );
});

test('avatar components hold no timers, global listeners or module-level state', async () => {
    const sources = await Promise.all([
        read('components/snake-avatar/snake-avatar.vue'),
        read('components/snake-avatar-group/snake-avatar-group.vue')
    ]);

    for (const source of sources) {
        assert.doesNotMatch(source, /setInterval|setTimeout|uni\.\$on|uni\.\$off|addEventListener|removeEventListener/);
        // 状态全部声明在 <script setup> 内（有缩进），模块作用域不允许可变的 let/var
        assert.doesNotMatch(source, /^(?:let|var)\s/m);
    }
});

test('avatar is registered in the package entry, global declarations and catalog', async () => {
    const [entry, declarations, catalog, registry, pages, demo] = await Promise.all([
        read('index.ts'),
        read('types/components.d.ts'),
        readWorkspace('src/pages/example/components.config.ts'),
        readWorkspace('docs/.vitepress/component-groups.ts'),
        readWorkspace('src/pages.json'),
        readWorkspace('src/pages/componentsA/avatar/index.vue')
    ]);

    for (const component of ['snake-avatar', 'snake-avatar-group']) {
        assert.match(entry, new RegExp(`export \\* from '\\./components/${component}/types'`), component);
        assert.match(declarations, new RegExp(`export \\* from '\\.\\./components/${component}/types'`), component);
    }
    assert.match(declarations, /export const SnakeAvatar: Component<AvatarProps, AvatarEmits>/);
    assert.match(declarations, /export const SnakeAvatarGroup: Component<AvatarGroupProps>/);
    assert.match(catalog, /item\(\s*'\/pages\/componentsA\/avatar\/index'/);
    assert.match(registry, /\{ name: 'Avatar', title: '头像', link: '\/components\/avatar' \}/);
    assert.match(pages, /"path":\s*"avatar\/index"/);
    // 示例页必须演示「只渲染部分子项 + total」这个最容易踩空的用法
    assert.match(demo, /demo-avatar-group-showcase/);
    assert.match(demo, /:total="totalValue"/);
    assert.match(demo, /:cascading="state\.aCascading"/);
});

test('avatar docs describe the fallback chain, folding and total', async () => {
    const docs = await readWorkspace('docs/components/avatar.md');

    assert.match(docs, /^preview:\s*\/pages\/componentsA\/avatar\/index$/m);
    assert.match(docs, /^## 平台兼容性$/m);
    assert.match(docs, /^## 基础用法$/m);
    assert.match(docs, /^## API$/m);
    assert.match(docs, /^### Props$/m);
    assert.match(docs, /^#### Avatar Props$/m);
    assert.match(docs, /^#### AvatarGroup Props$/m);
    assert.match(docs, /^### Events$/m);
    assert.match(docs, /^### Slots$/m);
    assert.match(docs, /^## 主题变量$/m);
    assert.match(docs, /只渲染部分子项时必须传 `total`/);
    assert.match(docs, /last-on-top/);
});
