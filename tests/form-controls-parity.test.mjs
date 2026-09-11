import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { getPathValue, setPathValue } from '../src/uni_modules/snake-ui/libs/form/path.ts';
import { validateFormValue } from '../src/uni_modules/snake-ui/libs/form/validate.ts';

const root = new URL('../src/uni_modules/snake-ui/', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
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
        assert.doesNotMatch(source, /uview-pro|uni\.\$u/);
        assert.ok(source.length > 120, `${components[index]} should expose a real typed contract`);
    }
});

test('form controls are exported from type and declaration entries', async () => {
    const [runtime, declaration, types] = await Promise.all([
        read('index.ts'),
        read('types/components.d.ts'),
        read('types/components.d.ts')
    ]);
    // 桶入口只导出 types（不再 re-export .vue，对齐 uView Pro），组件声明在 types/components.d.ts
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
    assert.match(source, /labelWidth: 90/);
});

test('form item matches uView Pro layout, size, slots, and field protocol', async () => {
    const [types, source] = await Promise.all([
        read('components/snake-form-item/types.ts'),
        read('components/snake-form-item/snake-form-item.vue')
    ]);
    // form ↔ form-item 单通道：类型化 formKey 注入，不再走组件名爬链
    assert.match(source, /inject\(formKey, null\)/);
    assert.doesNotMatch(source, /useCompRelation|useChildren\(|useParent\(/);
    assert.match(source, /small: \{ fontSize: 24, iconSize: 28, messageSize: 20 \}/);
    assert.match(source, /default: \{ fontSize: 28, iconSize: 32, messageSize: 24 \}/);
    assert.match(source, /large: \{ fontSize: 32, iconSize: 36, messageSize: 28 \}/);
    for (const name of ['leftIconPrefix', 'rightIconPrefix', 'leftIconStyle', 'rightIconStyle'])
        assert.match(types, new RegExp(name));
    for (const slot of ['leftIcon', 'rightIcon', 'right']) assert.match(source, new RegExp(`name="${slot}"`));
    for (const method of ['validation', 'resetField', 'onFormBlur', 'onFormChange'])
        assert.match(types + source, new RegExp(method));
});

test('selection controls use typed group protocols', async () => {
    const [checkbox, radio, checkboxGroup, radioGroup] = await Promise.all([
        read('components/snake-checkbox/snake-checkbox.vue'),
        read('components/snake-radio/snake-radio.vue'),
        read('components/snake-checkbox-group/snake-checkbox-group.vue'),
        read('components/snake-radio-group/snake-radio-group.vue')
    ]);
    // checkbox / radio 走类型化注入契约：useChildren 提供上下文、useParent 注入
    assert.match(checkbox, /useParent\(CHECKBOX_GROUP_KEY\)/);
    assert.match(checkboxGroup, /useChildren<[\w, ]+>\(CHECKBOX_GROUP_KEY\)/);
    assert.match(checkboxGroup, /linkChildren\(\{ props, emitEvent, validateSelection \}\)/);
    assert.match(checkboxGroup, /syncChildrenSelection/);
    assert.match(radio, /useParent\(RADIO_GROUP_KEY\)/);
    assert.match(radioGroup, /useChildren\(RADIO_GROUP_KEY\)/);
    assert.match(radioGroup, /linkChildren\(\{ props, setValue \}\)/);
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

test('form controls keep readable rpx size defaults', async () => {
    const [checkbox, checkboxGroup, radio, radioGroup, toggle, slider] = await Promise.all([
        read('components/snake-checkbox/snake-checkbox.vue'),
        read('components/snake-checkbox-group/snake-checkbox-group.vue'),
        read('components/snake-radio/snake-radio.vue'),
        read('components/snake-radio-group/snake-radio-group.vue'),
        read('components/snake-switch/snake-switch.vue'),
        read('components/snake-slider/snake-slider.vue')
    ]);
    // checkbox 对齐 uView Pro 的 sizeConfig 预设：盒子 34 / 字号 28 / 勾号 20
    assert.match(checkbox, /small: \{ size: 28, fontSize: 24, iconSize: 16 \}/);
    assert.match(checkbox, /default: \{ size: 34, fontSize: 28, iconSize: 20 \}/);
    assert.match(checkbox, /large: \{ size: 40, fontSize: 32, iconSize: 24 \}/);
    assert.match(checkboxGroup, /max: 999/);
    // radio 对齐 uView Pro 的 sizeConfig 预设：盒子 34 / 字号 28 / 勾号 20
    assert.match(radio, /small: \{ size: 28, fontSize: 24, iconSize: 16 \}/);
    assert.match(radio, /default: \{ size: 34, fontSize: 28, iconSize: 20 \}/);
    assert.match(radio, /large: \{ size: 40, fontSize: 32, iconSize: 24 \}/);
    assert.match(radioGroup, /width: 'auto'/);
    assert.match(toggle, /size === 'small' \? 40 : size === 'large' \? 60 : size === 'default' \? 50/);
    assert.match(slider, /height: 6,/);
    assert.match(slider, /blockWidth: 30,/);
});

test('form ports async-validator while controls remain independent from uView', async () => {
    const sourceByComponent = await Promise.all(
        components.map(name => read(`components/snake-${name}/snake-${name}.vue`))
    );
    const formItem = sourceByComponent[components.indexOf('form-item')];
    assert.match(formItem, /async-validator/);
    assert.match(await read('libs/form/async-validator.min.js'), /function Schema/);
    assert.doesNotMatch(sourceByComponent.join('\n'), /uni\.\$u|uview-pro|<u-/);
});

test('radio and checkbox render the iconfont checkmark', async () => {
    const [checkbox, radio] = await Promise.all([
        read('components/snake-checkbox/snake-checkbox.vue'),
        read('components/snake-radio/snake-radio.vue')
    ]);
    // checkbox 对齐 uView Pro：勾号常驻渲染，尺寸取自 sizeConfig 预设的 checkboxIconSize
    assert.ok(checkbox.includes('name="checkmark"'));
    assert.ok(checkbox.includes(':size="checkboxIconSize"'));
    assert.ok(!checkbox.includes('Number(iconSize) * (20 / 34)'));
    // radio 对齐 uView Pro：勾号常驻渲染，尺寸取自 sizeConfig 预设的 elIconSize
    assert.ok(radio.includes('name="checkmark"'));
    assert.ok(radio.includes(':size="elIconSize"'));
    assert.ok(!radio.includes('Number(iconSize) * (20 / 34)'));
    for (const source of [checkbox, radio]) {
        assert.ok(!source.includes('name="checkmark"\n                :color="iconColor"\n                bold'));
    }
});
