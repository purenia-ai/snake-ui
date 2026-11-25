import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../src/uni_modules/snake-ui/', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const source = () => read('components/snake-keyboard/snake-keyboard.vue');
const types = () => read('components/snake-keyboard/types.ts');

test('snake-keyboard owns a runtime props contract with separate value and visibility channels', async () => {
    const typeContract = await types();
    const component = await source();

    assert.match(typeContract, /export const keyboardProps =/);
    assert.match(typeContract, /export type KeyboardProps = ExtractPropTypes<typeof keyboardProps>/);
    assert.match(typeContract, /export type KeyboardEmits =/);
    assert.match(typeContract, /export interface KeyboardExpose/);
    assert.match(typeContract, /export type KeyboardMode = 'default' \| 'custom' \| 'car'/);
    assert.match(component, /defineProps\(keyboardProps\)/);
    assert.doesNotMatch(component, /withDefaults\(defineProps/);

    // 值走 v-model(modelValue)，开合走 v-model:visible，与 snake-select-picker 保持一致：
    // 弹层开合再复用 v-model 会和输入值抢同一个通道。
    assert.match(typeContract, /modelValue: \{ type: String, default: '' \}/);
    assert.match(typeContract, /visible: \{ type: Boolean, default: false \}/);
    // 键盘默认直角：底部系统键盘就是直角，要圆角得显式传 round
    assert.match(typeContract, /round: \{ type: \[Boolean, Number, String\][^}]*default: false \}/);
    assert.match(component, /get: \(\) => props\.visible/);
    assert.match(component, /emit\('update:visible', value\)/);
    assert.match(component, /defineExpose<KeyboardExpose>\(\{ open, close \}\)/);
});

test('snake-keyboard stays a controlled input: the host owns the value', async () => {
    const component = await source();

    // 不在组件内留 value 副本：追加与删除都基于 props.modelValue 计算后回派
    assert.doesNotMatch(component, /const value = ref/);
    assert.match(component, /if \(props\.modelValue\.length >= maxlengthValue\.value\) return;/);
    assert.match(component, /emit\('input', text\)/);
    assert.match(component, /emit\('update:modelValue', props\.modelValue \+ text\)/);
    assert.match(component, /emit\('delete'\)/);
    assert.match(component, /const next = props\.modelValue\.slice\(0, -1\);/);
    assert.match(component, /emit\('update:modelValue', next\)/);
    // maxlength 非法时退回不限制，避免 NaN 把键盘锁死
    assert.match(component, /Number\.isFinite\(value\) && value >= 0 \? value : Infinity/);
});

test('snake-keyboard builds a 12-cell pad and degrades cleanly without a delete key', async () => {
    const component = await source();

    // 9 个数字 + 额外键（无则收起键）+ 0 + 删除键
    assert.match(component, /const BASE_DIGITS = \['1', '2', '3', '4', '5', '6', '7', '8', '9'\]/);
    assert.match(
        component,
        /list\.push\(extra \? \{ text: extra, type: 'extra', wider: false \} : \{ text: '', type: 'close', wider: false \}\)/
    );
    // 删除键不在时让 0 占两列，末行不会只剩一个格子
    assert.match(component, /list\.push\(\{ text: '0', type: 'input', wider: !props\.showDeleteKey \}\)/);
    assert.match(component, /if \(props\.showDeleteKey\) list\.push\(\{ text: '', type: 'delete', wider: false \}\)/);
    assert.match(component, /\.snake-keyboard__cell--wider \{/);
    assert.match(component, /flex-basis: 66\.6666%/);

    // custom 形态把 0 加宽并把删除 / 确认移到右侧大键
    assert.match(component, /if \(props\.mode === 'custom'\) \{/);
    assert.match(
        component,
        /const hasSidebar = computed\(\(\) => props\.mode === 'custom' && \(props\.showDeleteKey \|\| props\.showConfirm\)\)/
    );
    assert.match(component, /const showConfirmKey = computed\(\(\) => hasSidebar\.value && props\.showConfirm\)/);
    assert.match(
        component,
        /const showHeaderConfirm = computed\(\(\) => props\.mode !== 'custom' && props\.showConfirm\)/
    );
    // 确认键只渲染一次：头部与右侧大键互斥
    assert.match(component, /v-if="showHeaderConfirm"/);
    assert.match(component, /v-if="showConfirmKey"/);
});

test('snake-keyboard repeats deletes on long press and swallows the trailing click', async () => {
    const typeContract = await types();
    const component = await source();

    assert.match(typeContract, /export const KEYBOARD_DELETE_HOLD_DELAY = 350/);
    assert.match(typeContract, /export const KEYBOARD_DELETE_REPEAT_INTERVAL = 80/);
    assert.match(component, /holdTimer = setTimeout\(\(\) => \{/);
    assert.match(component, /repeatTimer = setInterval\(emitDelete, KEYBOARD_DELETE_REPEAT_INTERVAL\)/);
    // 长按已经连发过时，松手补发的 click 只清标记、不再多删一位
    assert.match(component, /if \(holdFired\) \{\s*holdFired = false;\s*return;\s*\}/);
    assert.match(component, /clearTimeout\(holdTimer\)/);
    assert.match(component, /clearInterval\(repeatTimer\)/);
    assert.match(component, /onBeforeUnmount\(stopDeleteHold\)/);
    assert.match(component, /@touchcancel="stopDeleteHold"/);
});

test('snake-keyboard opens and closes through popup and reports confirm before closing', async () => {
    const component = await source();

    assert.match(component, /<snake-popup/);
    assert.match(component, /mode="bottom"/);
    assert.match(component, /:close-on-click-overlay="closeOnClickOverlay"/);
    assert.match(component, /:safe-area-inset-bottom="safeAreaInsetBottom"/);
    assert.match(component, /:root-portal="rootPortal"/);
    assert.match(component, /emit\('confirm', props\.modelValue\);\s*close\(\);/);
    assert.match(component, /function onClosed\(\)[\s\S]*?emit\('close'\)/);
    // 禁用态不允许被外部打开
    assert.match(component, /if \(value && props\.visible\) emit\('update:visible', false\)/);
});

test('snake-keyboard uses hover-class feedback instead of :active and keeps WXSS-safe styles', async () => {
    const component = await source();

    assert.match(component, /hover-class="snake-keyboard__key--hover"/);
    assert.match(component, /:hover-stay-time="100"/);
    assert.doesNotMatch(component, /:active/);
    // 按下态用中性灰：按键是常规输入控件，不该染品牌色的浅绿。
    // 取 divider(#e4e7ed) 而不是 border(#dcdfe6)：两家参考实现按下的灰都在这一档
    assert.match(
        component,
        /\.snake-keyboard__key--hover \{\s*background-color: var\(--snake-keyboard-key-hover-bg, var\(--snake-color-divider, #e4e7ed\)\);/
    );
    assert.doesNotMatch(component, /--snake-keyboard-key-hover-bg, var\(--snake-color-primary-light/);
    // 白键压浅灰面板：键底必须比面板浅一档，按下才有对比度
    assert.match(
        component,
        /\.snake-keyboard__panel \{[\s\S]*?var\(--snake-keyboard-panel-bg, var\(--snake-color-surface-muted/
    );
    assert.match(
        component,
        /\.snake-keyboard__key \{[\s\S]*?var\(--snake-keyboard-key-bg, var\(--snake-color-surface, #ffffff\)\)/
    );
    assert.match(
        component,
        /\.snake-keyboard__key--carLang \{[\s\S]*?var\(--snake-keyboard-function-bg, var\(--snake-color-border, #dcdfe6\)\)/
    );
    // 额外键是字符键，不进功能键那档灰，否则金额键盘里会多出一个灰块
    assert.doesNotMatch(component, /\.snake-keyboard__key--extra,/);
    // 右侧删除大键跟数字键同底色：大块灰会压过绿色完成键的视觉权重
    assert.match(
        component,
        /\.snake-keyboard__side \{[\s\S]*?var\(--snake-keyboard-side-bg, var\(--snake-color-surface, #ffffff\)\)/
    );
    // 按下态规则要写在功能键之后：同权重时后写的生效，删除键也能变色
    const hoverIndex = component.indexOf('.snake-keyboard__key--hover {');
    const functionIndex = component.indexOf('.snake-keyboard__key--delete,');
    assert.ok(hoverIndex > functionIndex && functionIndex > 0, 'hover rule must follow the function-key rule');
});

test('snake-keyboard exposes theme variables and localized labels', async () => {
    const component = await source();
    const zh = await read('locale/lang/zh-CN.ts');
    const en = await read('locale/lang/en-US.ts');

    for (const token of [
        '--snake-keyboard-panel-bg',
        '--snake-keyboard-key-bg',
        '--snake-keyboard-key-hover-bg',
        '--snake-keyboard-function-bg',
        '--snake-keyboard-side-bg',
        '--snake-keyboard-primary-bg',
        '--snake-keyboard-gap',
        '--snake-keyboard-key-height'
    ]) {
        assert.ok(component.includes(token), `${token}: missing theme variable`);
    }
    // 键高 56px 对齐 wot-ui 的行距（48 + 8），字号 26px 高于两家的 25 / 24
    assert.match(component, /height: var\(--snake-keyboard-key-height, 56px\)/);
    assert.match(component, /font-size: var\(--snake-keyboard-key-font-size, 26px\)/);
    assert.match(component, /height: var\(--snake-keyboard-car-key-height, 48px\)/);
    assert.match(component, /font-size: var\(--snake-keyboard-car-key-font-size, 18px\)/);
    for (const lang of [zh, en]) {
        assert.match(lang, /keyboard: \{ confirmText: .+, deleteText: .+, closeText: .+ \}/);
    }
    assert.match(component, /useLocale\('keyboard'\)/);
    assert.match(component, /props\.confirmText \|\| t\('confirmText'\)/);
    assert.match(component, /props\.deleteText \|\| t\('deleteText'\)/);
});

test('snake-keyboard ships a car-plate pad with 10 columns and a language switch', async () => {
    const component = await source();
    const typeContract = await types();
    const constants = await read('components/snake-keyboard/constants.ts');

    // 省份页 36 键、字母页 34 键；车牌不使用字母 I 与 O，与 uView-Pro / wot-ui 的参考表一致
    const areas = constants.match(/CAR_KEYBOARD_AREAS = \[([\s\S]*?)\]/)[1].match(/'[^']+'/g);
    const plates = constants.match(/CAR_KEYBOARD_KEYS = \[([\s\S]*?)\]/)[1].match(/'[^']+'/g);
    assert.equal(areas.length, 36);
    assert.equal(plates.length, 34);
    assert.ok(!plates.includes("'I'") && !plates.includes("'O'"), 'car plate skips I and O');

    // 两页共用 10 列网格，中英切换键与删除键各占两列
    assert.match(component, /\.snake-keyboard__grid--car \.snake-keyboard__cell \{\s*flex-basis: 10%;/);
    assert.match(component, /\.snake-keyboard__grid--car \.snake-keyboard__cell--wider \{\s*flex-basis: 20%;/);
    assert.match(component, /type: 'carLang', wider: true/);
    assert.match(component, /\{ text: '', type: 'delete', wider: true \}/);
    assert.match(component, /if \(props\.mode === 'car'\) return buildCarKeys\(carLangValue\.value\)/);

    // 语言：受控走 update:carLang，非受控改内部状态；自动切换只在非受控时生效
    assert.match(typeContract, /carLang: \{ type: String as PropType<CarKeyboardLang>, default: undefined \}/);
    assert.match(typeContract, /autoSwitchLang: \{ type: Boolean, default: false \}/);
    assert.match(typeContract, /'update:carLang': \[lang: CarKeyboardLang\]/);
    assert.match(component, /if \(props\.carLang\) \{\s*emit\('update:carLang', next\);/);
    assert.match(
        component,
        /if \(isCar\.value && wasEmpty && props\.autoSwitchLang && !props\.carLang\) setCarLang\('en'\)/
    );
    assert.match(
        component,
        /if \(isCar\.value && props\.autoSwitchLang && !props\.carLang && next\.length === 0\) setCarLang\('zh'\)/
    );
});
