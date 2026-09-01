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
});

test('form control components expose independent contracts', async () => {
    const sources = await Promise.all(components.map(name => read(`components/snake-${name}/types.ts`)));
    for (const [index, source] of sources.entries()) {
        assert.match(source, /export interface Snake/);
        assert.doesNotMatch(source, /uview-pro|uni\.\$u/);
        assert.ok(source.length > 120, `${components[index]} should expose a real typed contract`);
    }
});

test('form controls are exported from runtime and declaration entries', async () => {
    const [runtime, declaration, types] = await Promise.all([
        read('index.ts'),
        read('types/components.d.ts'),
        read('types/components.d.ts')
    ]);
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
        assert.match(runtime, new RegExp(`Snake${name}`));
        assert.match(declaration, new RegExp(`Snake${name}`));
    }
    for (const path of components) assert.match(types, new RegExp(`snake-${path}/types`));
});

test('form exposes validation and field lifecycle APIs', async () => {
    const [types, source] = await Promise.all([
        read('components/snake-form/types.ts'),
        read('components/snake-form/snake-form.vue')
    ]);
    for (const method of ['validate', 'validateField', 'resetFields', 'clearValidate', 'setRules'])
        assert.match(types + source, new RegExp(method));
    assert.match(source, /provide\(snakeFormKey/);
});

test('selection controls use typed group protocols', async () => {
    const [checkbox, radio, checkboxGroup, radioGroup] = await Promise.all([
        read('components/snake-checkbox/snake-checkbox.vue'),
        read('components/snake-radio/snake-radio.vue'),
        read('components/snake-checkbox-group/snake-checkbox-group.vue'),
        read('components/snake-radio-group/snake-radio-group.vue')
    ]);
    assert.match(checkbox, /snakeCheckboxGroupKey/);
    assert.match(radio, /snakeRadioGroupKey/);
    assert.match(checkboxGroup, /provide\(snakeCheckboxGroupKey/);
    assert.match(radioGroup, /provide\(snakeRadioGroupKey/);
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
    for (const source of [checkbox, checkboxGroup, radio, radioGroup]) assert.match(source, /iconSize[^\n]*34/);
    assert.match(toggle, /size === 'small' \? 40 : size === 'large' \? 60 : size === 'default' \? 50/);
    assert.match(slider, /height: 6,/);
    assert.match(slider, /blockWidth: 30,/);
});

test('third parity batch remains independent from uView and async-validator', async () => {
    const source = (await Promise.all(components.map(name => read(`components/snake-${name}/snake-${name}.vue`)))).join(
        '\n'
    );
    assert.doesNotMatch(source, /uni\.\$u|uview-pro|async-validator|<u-/);
});

test('radio and checkbox use the compact iconfont checkmark', async () => {
    const [checkbox, radio] = await Promise.all([
        read('components/snake-checkbox/snake-checkbox.vue'),
        read('components/snake-radio/snake-radio.vue')
    ]);
    for (const source of [checkbox, radio]) {
        assert.ok(source.includes('Number(iconSize) * (20 / 34)'));
        assert.ok(!source.includes('name="checkmark"\n                :color="iconColor"\n                bold'));
    }
});
