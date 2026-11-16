import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { cloneFormValue, getPathValue, setPathValue } from '../src/uni_modules/snake-ui/libs/form/path.ts';
import { validateFormValue } from '../src/uni_modules/snake-ui/libs/form/validate.ts';

const root = new URL('../src/uni_modules/snake-ui/', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
// 旧运行时标识模式（拼串书写，避免源码出现第三方库名）。
const legacyRuntimePattern = new RegExp(`uni\\.\\$u|${['u', 'view'].join('')}-pro|<u-`);
const components = [
    'form',
    'form-item',
    'input',
    'textarea',
    'checkbox',
    'checkbox-group',
    'radio',
    'radio-group',
    'switch',
    'slider'
];

test('form path helpers support nested objects and arrays', () => {
    const model = { profile: { name: 'Snake' }, items: [{ title: 'First' }] };
    assert.equal(getPathValue(model, 'profile.name'), 'Snake');
    assert.equal(getPathValue(model, 'items[0].title'), 'First');
    assert.equal(setPathValue(model, 'items.0.title', 'Updated'), true);
    assert.equal(model.items[0].title, 'Updated');
    assert.equal(setPathValue(model, 'profile.contact.mobile', '13800000000'), true);
    assert.equal(getPathValue(model, 'profile.contact.mobile'), '13800000000');
    assert.equal(setPathValue(model, 'items[0].title', 'Bracket updated'), true);
    assert.equal(model.items[0].title, 'Bracket updated');
});

test('form path helpers clone reset snapshots instead of retaining mutable references', () => {
    const initial = { tags: ['first'], profile: { verified: false } };
    const snapshot = cloneFormValue(initial);
    initial.tags.push('changed');
    initial.profile.verified = true;
    assert.deepEqual(snapshot, { tags: ['first'], profile: { verified: false } });
});

test('form validator covers built-in, trigger, sync, and async rules', async () => {
    assert.equal(
        (await validateFormValue('name', '', { required: true, message: '请输入姓名' }))[0].message,
        '请输入姓名'
    );
    assert.equal((await validateFormValue('name', 'ab', { min: 3, trigger: 'blur' }, 'change')).length, 0);
    assert.equal(
        (await validateFormValue('name', 'ab', { min: 3, message: '至少三个字符' }, 'blur'))[0].message,
        '至少三个字符'
    );
    assert.equal(
        (await validateFormValue('code', 'snake', { validator: (_rule, value) => value === 'snake' })).length,
        0
    );
    assert.equal(
        (await validateFormValue('code', 'bad', { asyncValidator: async () => new Error('异步校验失败') }))[0].message,
        '异步校验失败'
    );
    assert.equal(
        (
            await validateFormValue('accounts', [{ name: '' }], {
                type: 'array',
                defaultField: {
                    type: 'object',
                    fields: { name: { required: true, message: '请输入账户名' } }
                }
            })
        )[0].message,
        '请输入账户名'
    );
});

test('form control components expose independent contracts', async () => {
    const sources = await Promise.all(components.map(name => read(`components/snake-${name}/types.ts`)));
    for (const [index, source] of sources.entries()) {
        assert.match(source, /export interface [A-Z]/);
        assert.doesNotMatch(source, legacyRuntimePattern);
        assert.ok(source.length > 120, `${components[index]} should expose a real typed contract`);
    }
});

test('form controls are exported from type and declaration entries', async () => {
    const [runtime, declaration, types] = await Promise.all([
        read('index.ts'),
        read('types/components.d.ts'),
        read('types/components.d.ts')
    ]);
    // 桶入口只导出 types（不再 re-export .vue，对齐桶入口惯例），组件声明在 types/components.d.ts
    for (const name of [
        'Form',
        'FormItem',
        'Input',
        'Textarea',
        'Checkbox',
        'CheckboxGroup',
        'Radio',
        'RadioGroup',
        'Switch',
        'Slider'
    ]) {
        assert.match(declaration, new RegExp(`Snake${name}:`));
    }
    for (const path of components) {
        assert.match(runtime, new RegExp(`export \\* from './components/snake-${path}/types'`));
        assert.match(types, new RegExp(`snake-${path}/types`));
    }
});

test('form exposes validation and field lifecycle APIs', async () => {
    const [types, source] = await Promise.all([
        read('components/snake-form/types.ts'),
        read('components/snake-form/snake-form.vue')
    ]);
    for (const method of ['validate', 'validateField', 'resetFields', 'setRules', 'addField', 'removeField'])
        assert.match(types + source, new RegExp(method));
    assert.match(source, /provide\(formKey/);
    assert.match(types, /validate\(callback\?: FormCallback\): Promise<boolean>/);
    assert.doesNotMatch(types + source, /clearValidate/);
    assert.match(source, /errorType: \(\) => \['message', 'toast'\]/);
    assert.match(source, /labelWidth: 45/);
});

test('form demo covers rules, nested contacts, and exposed form actions', async () => {
    const source = await readFile(new URL('../src/pages/componentsA/form/index.vue', import.meta.url), 'utf8');
    for (const prop of [
        'name',
        'mobile',
        'password',
        'rePassword',
        'intro',
        'fruit',
        'flavor',
        'agreement',
        'accounts'
    ]) {
        assert.match(source, new RegExp(`${prop}:`));
    }
    assert.match(source, /:prop="`accounts\.\$\{index\}\.name`"/);
    assert.match(source, /formRef\.value\?\.validate\(/);
    assert.match(source, /formRef\.value\?\.validateField\('name'\)/);
    assert.match(source, /formRef\.value\?\.validateField\(\['name', 'password'\]\)/);
    assert.match(source, /formRef\.value\?\.setRules\(rules\.value\)/);
    assert.match(source, /formRef\.value\?\.resetFields\(\)/);
    assert.match(source, /function removeLastContact\(\)[\s\S]*model\.accounts\.pop\(\)/);
    // 新增能力的示例入口：整表禁用、校验时机、星号位置与主题变量
    assert.match(source, /:disabled="Boolean\(state\.formDisabled\)"/);
    assert.match(source, /:validate-trigger="validateTriggerValue"/);
    assert.match(source, /:asterisk-position="asteriskPosition"/);
    assert.match(source, /demo-form-themed/);
});

test('form propagates disabled, validate timing, and asterisk layout to fields and controls', async () => {
    const [formTypes, form, itemTypes, item, input, textarea, toggle, slider, checkboxGroup, radioGroup] =
        await Promise.all([
            read('components/snake-form/types.ts'),
            read('components/snake-form/snake-form.vue'),
            read('components/snake-form-item/types.ts'),
            read('components/snake-form-item/snake-form-item.vue'),
            read('components/snake-input/snake-input.vue'),
            read('components/snake-textarea/snake-textarea.vue'),
            read('components/snake-switch/snake-switch.vue'),
            read('components/snake-slider/snake-slider.vue'),
            read('components/snake-checkbox-group/snake-checkbox-group.vue'),
            read('components/snake-radio-group/snake-radio-group.vue')
        ]);

    // Form 级：disabled / validateTrigger / 星号默认值一起下发
    assert.match(formTypes, /disabled\?: boolean/);
    assert.match(formTypes, /validateTrigger\?: FormValidateTrigger \| FormValidateTrigger\[\]/);
    assert.match(formTypes, /asteriskPosition\?: 'start' \| 'end'/);
    assert.match(formTypes, /export function normalizeValidateTriggers/);
    assert.match(form, /normalizeValidateTriggers\(props\.validateTrigger\)/);
    assert.match(form, /disabled: toRef\(props, 'disabled'\)/);
    assert.match(form, /asteriskPosition: toRef\(props, 'asteriskPosition'\)/);
    // 注销按实例引用，同名字段不会互相误删
    assert.match(form, /fields\.value\.filter\(item => item !== field\)/);
    // 字段协议与 FormItem 实际注册的方法一致，不再靠 as any 抹平
    assert.match(formTypes, /validation\(trigger\?: string, callback\?: \(message: string\) => void\): void/);
    assert.match(formTypes, /resetField\(\): void/);
    assert.doesNotMatch(form, /as unknown as FormField/);

    // FormItem 合并禁用态、按住 validateTrigger 决定是否跑规则，并清掉过期提示
    assert.match(item, /const elDisabled = computed/);
    assert.match(item, /props\.disabled === '' \? Boolean\(form\?\.disabled\.value\)/);
    assert.match(item, /const validateTriggers = computed/);
    assert.match(item, /if \(!enabled\) \{[\s\S]{0,80}clearValidation\(\)/);
    assert.match(item, /disabled: elDisabled,/);
    assert.match(itemTypes, /disabled: Ref<boolean>/);
    // 星号改为标签行内的 flex 项，随 labelAlign 一起对齐，不再绝对定位
    assert.match(item, /class="snake-form-item__asterisk"/);
    assert.doesNotMatch(item, /position: absolute;\s*left: -8px/);
    assert.match(item, /asteriskPosition/);
    // 错误文案行高按 1.5 倍给，字号仍随档位
    assert.match(item, /line-height: 1\.5/);
    for (const variable of [
        '--snake-form-item-padding',
        '--snake-form-label-color',
        '--snake-form-label-font-size',
        '--snake-form-asterisk-color',
        '--snake-form-border-color',
        '--snake-form-message-color',
        '--snake-form-message-font-size'
    ]) {
        assert.match(item, new RegExp(variable));
    }

    // 六个叶子控件统一读取 FormItem 下发的禁用态
    for (const source of [input, textarea, toggle, slider, checkboxGroup, radioGroup]) {
        assert.match(source, /props\.disabled \|\| formItem\?\.disabled\.value/);
    }
    assert.match(checkboxGroup, /\{ 'is-disabled': elDisabled \}/);
    assert.match(radioGroup, /\{ 'is-disabled': elDisabled \}/);
});

test('form item waits for model updates, ignores stale validation, and resets immediately', async () => {
    const source = await read('components/snake-form-item/snake-form-item.vue');
    assert.match(source, /let validationVersion = 0/);
    assert.match(source, /if \(version !== validationVersion\)/);
    assert.match(source, /validationVersion \+= 1;/);
    assert.match(source, /return nextTick\(\)\.then\(/);
    assert.match(source, /validateState\.value = ''/);
    assert.match(source, /validateMessage\.value = ''/);
});

test('form item keeps legacy error channels independent and supports bracket array rule paths', async () => {
    const source = await read('components/snake-form-item/snake-form-item.vue');
    assert.match(source, /showError\('border'\)/);
    assert.ok(source.includes(".replace(/\\[(\\d+)\\]/g, '.$1')"));
    assert.ok(source.includes(".replace(/(?:^|\\.)(\\d+)(?=\\.|$)/g, '.defaultField.fields')"));
    assert.match(source, /setPathValue\(model, props\.prop, cloneFormValue\(initialValue\.value\)\)/);
});

test('form item matches the legacy layout, size, slots, and field protocol', async () => {
    const [types, source] = await Promise.all([
        read('components/snake-form-item/types.ts'),
        read('components/snake-form-item/snake-form-item.vue')
    ]);
    // form ↔ form-item 单通道：类型化 formKey 注入，不再走组件名爬链
    assert.match(source, /inject\(formKey, null\)/);
    assert.doesNotMatch(source, /useCompRelation|useChildren\(|useParent\(/);
    assert.match(source, /small: \{ fontSize: 12, iconSize: 14, messageSize: 10 \}/);
    assert.match(source, /default: \{ fontSize: 14, iconSize: 16, messageSize: 12 \}/);
    assert.match(source, /large: \{ fontSize: 16, iconSize: 18, messageSize: 14 \}/);
    for (const name of ['leftIconPrefix', 'rightIconPrefix', 'leftIconStyle', 'rightIconStyle'])
        assert.match(types, new RegExp(name));
    for (const slot of ['leftIcon', 'rightIcon', 'right']) assert.match(source, new RegExp(`name="${slot}"`));
    for (const method of ['validation', 'resetField', 'onFormBlur', 'onFormChange'])
        assert.match(types + source, new RegExp(method));
});

test('selection controls use typed group protocols', async () => {
    const [checkbox, radio, checkboxGroup, radioGroup, checkboxTypes, radioTypes] = await Promise.all([
        read('components/snake-checkbox/snake-checkbox.vue'),
        read('components/snake-radio/snake-radio.vue'),
        read('components/snake-checkbox-group/snake-checkbox-group.vue'),
        read('components/snake-radio-group/snake-radio-group.vue'),
        read('components/snake-checkbox/types.ts'),
        read('components/snake-radio/types.ts')
    ]);
    // checkbox / radio 走类型化注入契约：useChildren 提供上下文、useParent 注入
    assert.match(checkbox, /useParent\(CHECKBOX_GROUP_KEY\)/);
    assert.match(checkboxGroup, /useChildren<[\w, ]+>\(CHECKBOX_GROUP_KEY\)/);
    // 子项上下文同时下发合并后的禁用态（Form / FormItem 可统一禁用）
    assert.match(checkboxGroup, /linkChildren\(\{ props, disabled: elDisabled, toggleSelect \}\)/);
    // 选中态单一数据源：子项从 modelValue 派生，不再有收集 / 回推 / 防抖调和代码
    assert.doesNotMatch(checkboxGroup, /syncChildrenSelection|useDebounce/);
    assert.doesNotMatch(checkbox, /setTimeout|setChecked/);
    assert.match(radio, /useParent\(RADIO_GROUP_KEY\)/);
    assert.match(radioGroup, /useChildren\(RADIO_GROUP_KEY\)/);
    assert.match(radioGroup, /linkChildren\(\{ props, disabled: elDisabled, setValue \}\)/);
    assert.doesNotMatch(checkbox + radio, /props\.value/);
    for (const source of [checkboxTypes, radioTypes])
        assert.doesNotMatch(source, /^\s*value\??:\s*(?:string \| number;|\{)/m);
    assert.match(checkbox, /const checkboxValue = computed\(\(\) => props\.name\)/);
    assert.match(radio, /const radioValue = computed\(\(\) => props\.name\)/);
});

test('input controls notify forms and slider supports touch measurement', async () => {
    const [input, textarea, slider, toggle] = await Promise.all([
        read('components/snake-input/snake-input.vue'),
        read('components/snake-textarea/snake-textarea.vue'),
        read('components/snake-slider/snake-slider.vue'),
        read('components/snake-switch/types.ts')
    ]);
    assert.match(input, /formItem\?\.notify/);
    assert.match(textarea, /formItem\?\.notify/);
    assert.match(slider, /createSelectorQuery/);
    assert.match(slider, /touchmove/);
    assert.match(toggle, /activeValue/);
    assert.match(toggle, /inactiveValue/);
});

test('input and textarea keep the native value in sync and expose ref methods', async () => {
    const [input, textarea, inputTypes, textareaTypes] = await Promise.all([
        read('components/snake-input/snake-input.vue'),
        read('components/snake-textarea/snake-textarea.vue'),
        read('components/snake-input/types.ts'),
        read('components/snake-textarea/types.ts')
    ]);

    // 清除按钮默认「有内容就显示」，clearTrigger=focus 可退回聚焦式（对齐 wot-ui）
    assert.match(input, /const showClear = computed/);
    assert.match(input, /props\.clearTrigger === 'always' \|\| focused\.value/);
    assert.match(inputTypes, /clearTrigger\?: InputClearTrigger/);
    // 操作图标包一层 view 扩大热区，并阻止冒泡成根节点的 click
    assert.match(input, /class="snake-input__action" @click\.stop="clear"/);
    assert.match(input, /class="snake-input__action" @click\.stop="togglePassword"/);
    // 只读态原生控件被 disabled 会吞点击，用透明遮罩承接
    assert.match(input, /class="snake-input__mask" @click\.stop="onRootClick"/);
    assert.match(textarea, /class="snake-textarea__mask" @click\.stop="onRootClick"/);

    // 格式化砍字后必须回写原生值，否则被过滤的字符会留在输入框里
    for (const source of [input, textarea]) {
        assert.match(source, /function writeValue\(raw: string, next: string\)/);
        assert.match(source, /innerValue\.value = raw;[\s\S]{0,200}nextTick\(/);
        // 合成被失焦打断时复位，避免后续输入被永久吞掉
        assert.match(source, /composing\.value = false;\s*\n\s*const raw = readEventValue/);
        // change 只在失焦且值确实变化时派发
        assert.match(source, /if \(next !== valueAtFocus\) emit\('change', next\)/);
        // 禁用态不派发 click（对齐 uView 的 click 语义），包含 Form/FormItem 下发的禁用
        assert.match(source, /if \(isDisabled\.value\) return;\s*\n\s*emit\('click', event\)/);
        // 字数按码点统计，emoji 与生僻字只算一个
        assert.match(source, /Array\.from\(innerValue\.value\)\.length/);
        assert.match(source, /defineExpose\(exposed\)/);
    }

    assert.match(inputTypes, /showWordLimit\?: boolean/);
    assert.match(inputTypes, /error\?: boolean/);
    assert.match(inputTypes, /height\?: UnitValue/);
    assert.match(inputTypes, /placeholderClass\?: string/);
    assert.match(inputTypes, /customInputClass\?: string/);
    assert.match(textareaTypes, /formatter\?: \(value: string\) => string/);
    assert.match(textareaTypes, /trim\?: boolean/);
    assert.match(textareaTypes, /disableDefaultPadding\?: boolean/);
    assert.match(inputTypes, /export interface InputExpose/);
    assert.match(textareaTypes, /export interface TextareaExpose/);
    assert.match(input, /const exposed: InputExpose = \{ focus, blur, clear \}/);
    assert.match(textarea, /const exposed: TextareaExpose = \{ focus, blur, clear \}/);

    // 尺寸档位：两个组件共用一张尺寸表，size 真正影响高度/字号/图标
    const [fieldSize, inputDemo, textareaDemo] = await Promise.all([
        read('libs/function/fieldSize.ts'),
        read('../../pages/componentsA/input/index.vue'),
        read('../../pages/componentsA/textarea/index.vue')
    ]);
    assert.match(fieldSize, /small: \{ height: 32, fontSize: 13, iconSize: 14 \}/);
    assert.match(fieldSize, /default: \{ height: 40, fontSize: 14, iconSize: 16 \}/);
    assert.match(fieldSize, /large: \{ height: 48, fontSize: 16, iconSize: 18 \}/);
    assert.match(fieldSize, /export function getFieldSizeConfig/);
    for (const source of [input, textarea]) {
        assert.match(source, /getFieldSizeConfig/);
        assert.doesNotMatch(source, /font-size: 14px/);
    }
    // textarea 的 size 此前只有类名没有样式，必须存在对应规则
    assert.match(textarea, /\.snake-textarea--small\s*\{[^}]*min-height:\s*var\(--snake-textarea-height-small/s);
    assert.match(
        textarea,
        /\.snake-textarea--large \.snake-textarea__native\s*\{[^}]*font-size:\s*var\(--snake-textarea-font-size-large/s
    );
    // height 覆盖：容器与原生控件一起写，低于档位高度也不会溢出
    assert.match(
        textarea,
        /minHeight: props\.height\s*\?\s*addUnit\(Math\.max\(unitToPx\(props\.height\) - TEXTAREA_PADDING_Y/
    );
    // 组件级主题变量
    for (const variable of [
        '--snake-input-height',
        '--snake-input-font-size',
        '--snake-input-border-color',
        '--snake-input-icon-color'
    ]) {
        assert.match(input, new RegExp(variable));
    }
    for (const variable of [
        '--snake-textarea-height',
        '--snake-textarea-font-size',
        '--snake-textarea-border-color',
        '--snake-textarea-count-color'
    ]) {
        assert.match(textarea, new RegExp(variable));
    }
    // 示例页覆盖三档尺寸与 CSS 变量主题化
    assert.match(inputDemo, /size="small"/);
    assert.match(inputDemo, /size="large"/);
    assert.match(inputDemo, /demo-input-themed/);
    assert.match(textareaDemo, /demo-textarea-themed/);
});

test('textarea protects IME composition and interactive controls support keyboards', async () => {
    const [textarea, toggle, slider] = await Promise.all([
        read('components/snake-textarea/snake-textarea.vue'),
        read('components/snake-switch/snake-switch.vue'),
        read('components/snake-slider/snake-slider.vue')
    ]);

    assert.match(textarea, /const composing = ref\(false\)/);
    assert.match(textarea, /@compositionstart="composing = true"/);
    assert.match(textarea, /if \(composing\.value\)/);
    for (const source of [toggle, slider]) {
        assert.match(source, /tabindex/);
        assert.match(source, /@keydown\.enter|@keydown\.left/);
        assert.match(source, /aria-disabled/);
    }
});

test('form controls keep readable px size defaults', async () => {
    const [checkbox, checkboxGroup, radio, radioGroup, toggle, slider] = await Promise.all([
        read('components/snake-checkbox/snake-checkbox.vue'),
        read('components/snake-checkbox-group/snake-checkbox-group.vue'),
        read('components/snake-radio/snake-radio.vue'),
        read('components/snake-radio-group/snake-radio-group.vue'),
        read('components/snake-switch/snake-switch.vue'),
        read('components/snake-slider/snake-slider.vue')
    ]);
    // checkbox 对齐主流 sizeConfig 预设：盒子 34 / 字号 28 / 勾号 20
    assert.match(checkbox, /small: \{ size: 14, fontSize: 12, iconSize: 8 \}/);
    assert.match(checkbox, /default: \{ size: 17, fontSize: 14, iconSize: 10 \}/);
    assert.match(checkbox, /large: \{ size: 20, fontSize: 16, iconSize: 12 \}/);
    assert.match(checkboxGroup, /max: 999/);
    // radio 对齐主流 sizeConfig 预设：盒子 34 / 字号 28 / 勾号 20
    assert.match(radio, /small: \{ size: 14, fontSize: 12, iconSize: 8 \}/);
    assert.match(radio, /default: \{ size: 17, fontSize: 14, iconSize: 10 \}/);
    assert.match(radio, /large: \{ size: 20, fontSize: 16, iconSize: 12 \}/);
    assert.match(radioGroup, /width: 'auto'/);
    assert.match(toggle, /size === 'small' \? 20 : size === 'large' \? 30 : size === 'default' \? 25/);
    assert.match(slider, /height: 3,/);
    assert.match(slider, /blockWidth: 15,/);
});

test('form ports async-validator while controls remain independent from the legacy runtime', async () => {
    const sourceByComponent = await Promise.all(
        components.map(name => read(`components/snake-${name}/snake-${name}.vue`))
    );
    const formItem = sourceByComponent[components.indexOf('form-item')];
    assert.match(formItem, /async-validator/);
    assert.match(await read('libs/form/async-validator.min.js'), /function Schema/);
    assert.doesNotMatch(sourceByComponent.join('\n'), legacyRuntimePattern);
});

test('form item drops the stale error when a trigger has no matching rule', async () => {
    const formItem = await read('components/snake-form-item/snake-form-item.vue');
    // 确认型控件（select / switch）在 change 时机提交，规则没声明 trigger 时不应留下上一次的红字
    assert.match(
        formItem,
        /if \(!rules\.length\) \{\s*\/\/[^\n]*\n\s*if \(trigger && validateState\.value === 'error'\) clearValidation\(\);\s*callback\(''\);\s*return;\s*\}/
    );
    assert.match(formItem, /function clearValidation\(\) \{\s*validationVersion \+= 1;\s*validateState\.value = '';/);
});

test('radio and checkbox render the iconfont checkmark', async () => {
    const [checkbox, radio] = await Promise.all([
        read('components/snake-checkbox/snake-checkbox.vue'),
        read('components/snake-radio/snake-radio.vue')
    ]);
    // checkbox 对齐主流实现：勾号常驻渲染，尺寸取自 sizeConfig 预设的 checkboxIconSize
    assert.ok(checkbox.includes('name="checkmark"'));
    assert.ok(checkbox.includes(':size="checkboxIconSize"'));
    assert.ok(!checkbox.includes('Number(iconSize) * (20 / 34)'));
    // radio 对齐主流实现：勾号常驻渲染，尺寸取自 sizeConfig 预设的 elIconSize
    assert.ok(radio.includes('name="checkmark"'));
    assert.ok(radio.includes(':size="elIconSize"'));
    assert.ok(!radio.includes('Number(iconSize) * (20 / 34)'));
    for (const source of [checkbox, radio]) {
        assert.ok(!source.includes('name="checkmark"\n                :color="iconColor"\n                bold'));
    }
});
