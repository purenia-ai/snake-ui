import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../src/uni_modules/snake-ui/', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const workspaceRoot = new URL('../', import.meta.url);

const pickerSource = () => read('components/snake-picker/snake-picker.vue');
const pickerTypes = () => read('components/snake-picker/types.ts');

test('snake-picker exposes runtime props for the wheel geometry, async guard and portal', async () => {
    const types = await pickerTypes();
    const source = await pickerSource();

    assert.match(types, /export const pickerProps =/);
    assert.match(types, /export type PickerProps = ExtractPropTypes<typeof pickerProps>/);
    assert.match(source, /defineProps\(pickerProps\)/);
    assert.doesNotMatch(source, /withDefaults\(defineProps/);

    // 行高与可见行数决定弹层高度；默认 44 × 6
    assert.match(types, /itemHeight: \{ type: Number, default: DEFAULT_PICKER_ITEM_HEIGHT \}/);
    assert.match(types, /visibleItemCount: \{ type: Number, default: DEFAULT_PICKER_VISIBLE_ITEM_COUNT \}/);
    assert.match(types, /export const DEFAULT_PICKER_ITEM_HEIGHT = 44;/);
    assert.match(types, /export const DEFAULT_PICKER_VISIBLE_ITEM_COUNT = 6;/);
    assert.match(
        source,
        /const bodyStyle = computed\(\(\) => \(\{ height: `\$\{itemHeight\.value \* visibleItemCount\.value\}px` \}\)\);/
    );
    assert.match(source, /:indicator-style="indicatorStyle"/);
    assert.match(source, /`height: \$\{itemHeight\.value\}px;`/);

    // 异步拦截器、rootPortal、disabled、空态文案
    assert.match(types, /beforeConfirm: \{ type: Function as PropType<PickerBeforeConfirm>, default: undefined \}/);
    assert.match(types, /rootPortal: \{ type: Boolean, default: false \}/);
    assert.match(types, /disabled: \{ type: Boolean, default: false \}/);
    assert.match(types, /emptyText: \{ type: String, default: '' \}/);
    assert.match(source, /:root-portal="rootPortal"/);
});

test('snake-picker publishes a typed expose and drops the never-emitted click event', async () => {
    const types = await pickerTypes();
    const source = await pickerSource();

    assert.match(types, /export interface PickerExpose \{/);
    assert.match(types, /open\(\): void;/);
    assert.match(types, /close\(\): void;/);
    assert.match(source, /defineExpose<PickerExpose>\(\{ open, close \}\)/);
    assert.match(
        source,
        /function open\(\) \{\s*if \(isDisabled\.value \|\| props\.modelValue\) return;\s*emit\('update:modelValue', true\);/
    );

    // change / open 补齐，click 从未派发过，直接从契约里去掉
    assert.match(types, /change: \[value: PickerResult\[\]\]/);
    assert.match(types, /open: \[\]/);
    assert.doesNotMatch(types, /\bclick: \[\]/);
    assert.doesNotMatch(source, /emit\('click'\)/);
});

test('snake-picker defers confirm while scrolling and requires an explicit async pass', async () => {
    const source = await pickerSource();

    // 滑动中不丢弃确认，而是挂起到 pickend 再补发
    assert.match(source, /let pendingConfirm = false;/);
    assert.match(source, /if \(moving\.value\) \{\s*pendingConfirm = true;\s*return;\s*\}/);
    assert.match(source, /if \(!pendingConfirm\) return;\s*pendingConfirm = false;\s*void handleConfirm\(\);/);
    assert.doesNotMatch(source, /if \(moving\.value\) return;/);

    // 拦截器只有显式 true 才放行，抛错按不通过处理
    assert.match(source, /allowed = \(await hook\(value\)\) === true;/);
    assert.match(source, /catch \{\s*allowed = false;\s*\}/);
    assert.match(source, /if \(!allowed\) return;/);

    // 等待期间取消/重新确认会作废本次结果
    assert.match(source, /confirmToken \+= 1/);
    assert.match(source, /if \(token !== confirmToken\) return;/);
    assert.match(source, /function invalidateConfirm\(\)/);
    assert.match(source, /:close-on-click-overlay="maskCloseAble && !confirming"/);
    assert.match(source, /confirming \? 'true' : 'false'/);
});

test('snake-picker reports scroll changes and keeps cascade columns in sync', async () => {
    const source = await pickerSource();

    assert.match(source, /emit\('change', selectValue\.value\.slice\(\)\);/);
    assert.match(source, /const changed = findChangedColumn\(indexes\);/);
    assert.match(source, /if \(changed >= 0\) refreshCascadeColumns\(changed, indexes\);/);
    assert.match(source, /function findChangedColumn\(indexes: number\[\]\): number \{/);
    assert.match(source, /function refreshCascadeColumns\(from: number, indexes: number\[\]\) \{/);
    // 旧的 .map() 副作用写法会漏判「最早变化的列」，应已移除
    assert.doesNotMatch(source, /lastSelectIndex\.value\.map\(/);
});

test('snake-picker clamps column count and re-initializes when data changes while open', async () => {
    const types = await pickerTypes();
    const source = await pickerSource();

    // 一维数组传给 mutil-column 时按单列处理，否则列数虚增并越界
    assert.match(source, /columnNum\.value = is2DList\(props\.list\) \? props\.list\.length : 1;/);
    // 循环 children 导致 while 无限下钻
    assert.match(types, /export const MAX_PICKER_COLUMN_COUNT = 20;/);
    assert.match(source, /num < MAX_PICKER_COLUMN_COUNT/);
    // 打开状态下同步新数据
    assert.match(
        source,
        /watch\(\s*\(\) => \[props\.list, props\.mode, props\.valueName, props\.labelName, props\.childName\]/
    );
});

test('snake-picker renders an empty state and wires the toolbar divider to border', async () => {
    const source = await pickerSource();

    assert.match(source, /const hasColumns = computed\(\(\) => columnData\.value\.some\(/);
    assert.match(source, /<view v-else class="snake-picker__empty">\{\{ emptyTextValue \}\}<\/view>/);
    assert.match(source, /snake-picker__header--bordered/);
    assert.match(source, /:class="\{ 'snake-picker__header--bordered': border \}"/);
    // 指示框边线此前是无效声明 `border: rgba(...)`
    assert.doesNotMatch(source, /border: rgba\(var\(--snake-color-surface-rgb/);
});

test('snake-picker draws the selection band without stacking two sets of hairlines', async () => {
    const source = await pickerSource();
    const theme = await read('libs/css/style.theme.scss');

    // 选中框底色画在组件自己的节点上：原生 indicator 的不透明底色会盖住选中项文字
    assert.match(source, /class="snake-picker__roller"/);
    assert.match(source, /const rollerStyle = computed\(\(\) => \(\{ height: `\$\{itemHeight\.value\}px` \}\)\);/);
    assert.match(source, /\.snake-picker__roller \{/);
    // 极浅底色 + 左右内缩 + 圆角：整块灰条会被看成「禁用块」
    assert.match(
        source,
        /background-color: var\(--snake-picker-roller-bg, var\(--snake-color-background, #f6f6f6\)\);/
    );
    assert.match(source, /right: var\(--snake-picker-roller-inset-x, 12px\);/);
    assert.match(source, /left: var\(--snake-picker-roller-inset-x, 12px\);/);
    assert.match(source, /border-radius: var\(--snake-picker-roller-radius, 6px\);/);
    assert.match(source, /\.snake-picker__body__picker-view \{/);
    assert.match(source, /z-index: 1;/);
    // 原生 indicator 保持透明，hairline 默认不画（要画时给变量一个颜色）
    assert.match(source, /background-color: transparent !important;/);
    assert.match(source, /border-top: 1px solid var\(--snake-picker-indicator-border-color, transparent\) !important;/);
    assert.match(
        source,
        /border-bottom: 1px solid var\(--snake-picker-indicator-border-color, transparent\) !important;/
    );
    assert.doesNotMatch(source, /box-shadow:\s*\n?\s*inset 0 1px 0 var\(--snake-picker-indicator-border-color/);

    // 全局主题表不再用 !important 抢组件主题变量（历史规则里还有无效的 border 声明）
    assert.doesNotMatch(theme, /uni-picker-view-mask/);
    assert.doesNotMatch(theme, /uni-picker-view-indicator/);
    assert.doesNotMatch(theme, /snake-picker-view-indicator/);
});

test('snake-picker fades the mask with the surface color so dark mode keeps contrast', async () => {
    const source = await pickerSource();
    const docs = await readFile(new URL('docs/components/picker.md', workspaceRoot), 'utf8');

    // 用「表面色 → 透明」的渐变，颜色跟着明暗主题走；rgb 三元组在暗色主题里不会翻转
    assert.match(source, /var\(--snake-picker-mask-color, var\(--snake-color-surface, #fff\)\), transparent\)/);
    assert.doesNotMatch(source, /--snake-picker-mask-rgb/);
    assert.doesNotMatch(source, /--snake-color-surface-rgb/);
    assert.match(docs, /\| `--snake-picker-mask-color`/);
    assert.doesNotMatch(docs, /--snake-picker-mask-rgb/);
});

test('snake-picker highlights the active row and rounds the panel through popup', async () => {
    const source = await pickerSource();
    const types = await pickerTypes();
    const docs = await readFile(new URL('docs/components/picker.md', workspaceRoot), 'utf8');

    assert.match(source, /function isActiveItem\(columnIndex: number, rowIndex: number\): boolean \{/);
    assert.match(source, /:class="\{\s*'snake-picker__body__picker-view__item--active': isActiveItem\(index, index1\)/);
    assert.match(source, /--active \{/);
    assert.match(source, /font-weight: var\(--snake-picker-item-active-font-weight, 600\);/);

    // 圆角交给 popup 的 round，组件自己不再维护 panel-radius
    assert.match(
        types,
        /round: \{ type: \[Boolean, Number, String\] as PropType<boolean \| number \| string>, default: true \}/
    );
    assert.match(source, /:round="round"/);
    assert.doesNotMatch(source, /--snake-picker-panel-radius/);
    assert.ok(docs.includes('| `round`'), '文档缺少 round 属性');
});

test('snake-picker follows form-item disabled state and triggers change validation', async () => {
    const source = await pickerSource();

    assert.match(source, /import \{ formItemKey \} from '\.\.\/snake-form-item\/types';/);
    assert.match(source, /const formItem = inject\(formItemKey, null\);/);
    assert.match(
        source,
        /const isDisabled = computed\(\(\) => props\.disabled \|\| formItem\?\.disabled\.value \|\| false\);/
    );
    assert.match(source, /void formItem\?\.notify\('change'\);/);
    // 禁用态不允许被外部打开
    assert.match(
        source,
        /if \(isDisabled\.value\) \{\s*\/\/ 禁用态不允许被外部打开\s*emit\('update:modelValue', false\);/
    );
});

test('snake-picker theme variables are documented and used', async () => {
    const source = await pickerSource();
    const docs = await readFile(new URL('docs/components/picker.md', workspaceRoot), 'utf8');
    const variables = [
        '--snake-picker-panel-bg',
        '--snake-picker-body-bg',
        '--snake-picker-toolbar-height',
        '--snake-picker-toolbar-font-size',
        '--snake-picker-toolbar-padding-x',
        '--snake-picker-title-font-size',
        '--snake-picker-title-font-weight',
        '--snake-picker-title-color',
        '--snake-picker-divider-color',
        '--snake-picker-item-font-size',
        '--snake-picker-item-color',
        '--snake-picker-item-padding-x',
        '--snake-picker-item-active-color',
        '--snake-picker-item-active-font-weight',
        '--snake-picker-roller-bg',
        '--snake-picker-roller-inset-x',
        '--snake-picker-roller-radius',
        '--snake-picker-indicator-border-color',
        '--snake-picker-mask-color',
        '--snake-picker-empty-color',
        '--snake-picker-empty-font-size',
        '--snake-picker-pending-opacity'
    ];

    for (const name of variables) {
        assert.ok(
            new RegExp(`var\\(${name},`).test(source) || new RegExp(`var\\(${name}\\)`).test(source),
            `${name} 未在组件中使用`
        );
        assert.match(docs, new RegExp(`\\| \`${name}\``), `${name} 未在文档中登记`);
    }
});

test('picker docs and demo describe the new wheel, guard and method APIs', async () => {
    const docs = await readFile(new URL('docs/components/picker.md', workspaceRoot), 'utf8');
    const demo = await readFile(new URL('src/pages/componentsA/picker/index.vue', workspaceRoot), 'utf8');

    for (const heading of [
        '## 行高与可见行数',
        '## 样式',
        '## 异步校验',
        '## 空态',
        '## 禁用',
        '## 表单联动',
        '### Methods'
    ]) {
        assert.ok(docs.includes(heading), `文档缺少章节 ${heading}`);
    }
    for (const row of [
        '| `itemHeight`',
        '| `visibleItemCount`',
        '| `beforeConfirm`',
        '| `rootPortal`',
        '| `disabled`',
        '| `emptyText`',
        '| `round`',
        '| `change`',
        '| `open`  '
    ]) {
        assert.ok(docs.includes(row), `文档缺少 ${row}`);
    }
    // 从未派发的 click 事件不应再出现在 API 表里
    assert.doesNotMatch(docs, /\| `click`\s*\|/);

    assert.match(demo, /:item-height="Number\(state\.slItemHeight\)"/);
    assert.match(demo, /:visible-item-count="Number\(state\.slVisibleCount\)"/);
    assert.match(demo, /:round="Boolean\(state\.slRound\)"/);
    assert.match(demo, /:root-portal="Boolean\(state\.slRootPortal\)"/);
    assert.match(demo, /:before-confirm="beforeConfirm"/);
    assert.match(demo, /guardPickerRef\.value\?\.open\(\)/);
    assert.match(demo, /@change="onChange"/);
    assert.match(demo, /ref="guardPickerRef"/);
    // 表单联动示例：picker 放进 form-item，确认后由组件触发 change 校验
    assert.match(demo, /<snake-form-item :label="text\('收件城市'\)" prop="city" required :label-width="72">/);
    assert.match(demo, /cityFormRef\.value\?\.validate\(\)/);
});

test('picker locale ships an empty-state message in every bundled language', async () => {
    for (const language of ['zh-CN', 'en-US']) {
        const messages = await read(`locale/lang/${language}.ts`);
        assert.match(
            messages,
            /picker: \{ cancelText: .+confirmText: .+emptyText: .+ \}/,
            `${language} 缺少 picker.emptyText`
        );
    }
});

test('picker owns the old select names: no snake-select leftovers anywhere', async () => {
    const source = await pickerSource();
    const types = await pickerTypes();
    const docs = await readFile(new URL('docs/components/picker.md', workspaceRoot), 'utf8');
    const demo = await readFile(new URL('src/pages/componentsA/picker/index.vue', workspaceRoot), 'utf8');

    assert.match(source, /defineOptions\(\{ name: 'SnakePicker'/);
    assert.match(types, /export const pickerProps =/);
    assert.match(source, /@see \/components\/picker/);
    assert.match(docs, /^# Picker 列选择器$/m);
    // 旧名不保留：目录、类型、类名前缀与主题变量都不得再出现 select 形态，
    // 文档也不写改名说明，旧名在源码 / 类型 / 示例 / 文档里一处都不出现。
    for (const text of [source, types, demo, docs]) {
        assert.doesNotMatch(
            text,
            /snake-select|SnakeSelect|SelectProps|SelectEmits|SelectExpose|SelectItem|SelectResult/
        );
    }
    assert.doesNotMatch(docs, /<snake-select|snake-select__|--snake-select-/);
    assert.doesNotMatch(source, /snake-select__|--snake-select-/);
    assert.doesNotMatch(await readFile(new URL('src/pages.json', workspaceRoot), 'utf8'), /componentsA\/select/);
});

test('snake-picker forwards immediate-change to the native picker-view', async () => {
    const types = await pickerTypes();
    const source = await pickerSource();
    const docs = await readFile(new URL('docs/components/picker.md', workspaceRoot), 'utf8');
    const demo = await readFile(new URL('src/pages/componentsA/picker/index.vue', workspaceRoot), 'utf8');

    // 默认沿用原生时机（滚动动画结束后派发），开启后由原生 picker-view 在手指松开时派发
    assert.match(types, /immediateChange: \{ type: Boolean, default: false \}/);
    // 平台限制必须写进类型注释，避免被当成 H5 / App 也能用的能力
    assert.match(types, /仅微信小程序（基础库 2\.21\.1\+）生效/);
    assert.match(
        source,
        /<picker-view[\s\S]{0,300}:immediate-change="immediateChange"[\s\S]{0,300}@change="columnChange"/
    );
    // 透传给原生 picker-view，组件内不另造定时器伪造时机
    assert.doesNotMatch(source, /setTimeout/);

    assert.ok(docs.includes('| `immediateChange`'), '文档缺少 immediateChange 属性');
    assert.ok(docs.includes('## 即时 change'), '文档缺少「即时 change」章节');
    assert.match(docs, /2\.21\.1/);
    assert.match(demo, /:immediate-change="Boolean\(state\.slImmediateChange\)"/);
    assert.match(demo, /key: 'slImmediateChange'/);
});

test('snake-picker avoids rpx literals and unsupported wxss selectors', async () => {
    const source = await pickerSource();

    assert.doesNotMatch(source, /\d+rpx/);
    assert.doesNotMatch(source, /:active|:last-child|:first-child|:not\(/);
});
