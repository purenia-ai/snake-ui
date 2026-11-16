import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '../src/uni_modules/snake-ui');
const docsRoot = resolve(import.meta.dirname, '../docs');
const pagesRoot = resolve(import.meta.dirname, '../src/pages/componentsA');
const read = path => readFile(resolve(root, path), 'utf8');

test('selection controls expose the shared appearance contract', async () => {
    const [checkboxTypes, radioTypes, checkboxGroupTypes, radioGroupTypes] = await Promise.all([
        read('components/snake-checkbox/types.ts'),
        read('components/snake-radio/types.ts'),
        read('components/snake-checkbox-group/types.ts'),
        read('components/snake-radio-group/types.ts')
    ]);

    // 未选中颜色 / 标签颜色 / 指示器位置 / 行分隔线四个能力在子项与分组上成对出现
    for (const source of [checkboxTypes, radioTypes]) {
        for (const prop of ['inactiveColor', 'labelColor', 'placement', 'border'])
            assert.match(source, new RegExp(`${prop}: \\{`), `${prop}: item prop`);
    }
    for (const source of [checkboxGroupTypes, radioGroupTypes]) {
        for (const prop of ['inactiveColor', 'labelColor', 'placement', 'border', 'labelSize'])
            assert.match(source, new RegExp(`${prop}\\?:`), `${prop}: group prop`);
    }
    // 半选态只属于 checkbox；数量上下限只属于 checkbox-group
    assert.match(checkboxTypes, /indeterminate: \{ type: Boolean, default: false \}/);
    assert.doesNotMatch(radioTypes, /indeterminate/);
    for (const prop of ['min', 'maxText', 'minText'])
        assert.match(checkboxGroupTypes, new RegExp(`${prop}\\?:`), `${prop}: checkbox-group only`);
    assert.doesNotMatch(radioGroupTypes, /min\?: number/);
    // 分组宽度统一为 UnitValue（子项按 addUnit 处理），不再接受裸字符串
    assert.match(checkboxGroupTypes, /width\?: UnitValue;/);
    assert.match(radioGroupTypes, /width\?: UnitValue;/);
    // 表单提交标识符由 form-item 的 prop 承载，分组不再声明无实现的 name
    assert.doesNotMatch(checkboxGroupTypes, /name\?: boolean \| string;/);
});

test('selection controls resolve custom numeric sizes instead of ignoring them', async () => {
    const [checkbox, radio] = await Promise.all([
        read('components/snake-checkbox/snake-checkbox.vue'),
        read('components/snake-radio/snake-radio.vue')
    ]);

    for (const source of [checkbox, radio]) {
        // 预设档位外的数值 size 直接作为盒子尺寸，勾号与字号按默认档比例推导
        assert.match(source, /const customSize = computed\(\(\) => \{/);
        assert.match(source, /Math\.round\(customSize\.value \* 0\.588\)/);
        assert.match(source, /Math\.round\(customSize\.value \* 0\.823\)/);
        // 盒子尺寸优先取自定义数值，未设置时回落到预设档位
        assert.match(source, /customSize\.value \|\| currentSizeConfig\.value\.size/);
        // 字号始终有值，避免自定义尺寸时标签回落到 CSS 默认字号
        assert.match(source, /return addUnit\(customSize\.value \?/);
    }
    assert.match(checkbox, /const checkboxSize = computed\(\(\) => customSize\.value/);
    assert.match(radio, /const elSize = computed\(\(\) => customSize\.value/);
});

test('selection controls grey out disabled and limit-locked items', async () => {
    const [checkbox, radio, checkboxGroup] = await Promise.all([
        read('components/snake-checkbox/snake-checkbox.vue'),
        read('components/snake-radio/snake-radio.vue'),
        read('components/snake-checkbox-group/snake-checkbox-group.vue')
    ]);

    // 禁用态不再只有图标变灰：标签同步降级为主题弱化色
    assert.match(
        checkbox,
        /\.snake-checkbox--disabled \.snake-checkbox__label \{\s*color: var\(--snake-color-text-muted/s
    );
    assert.match(radio, /\.snake-radio--disabled \.snake-radio__label \{\s*color: var\(--snake-color-text-muted/s);
    // 达 min/max 的项单独有锁定态，且不影响暴露的 isDisabled（toggleAll 仍需跳过真正禁用的项）
    assert.match(checkbox, /const isLocked = computed\(\(\) => \{/);
    assert.match(checkbox, /\.snake-checkbox--locked \.snake-checkbox__icon-wrap \{\s*opacity: 0\.5/s);
    assert.match(checkbox, /isLocked, value: checkboxValue, props/);
    // 上限提示走语言包 / 属性覆盖，不再硬编码中文
    assert.match(checkboxGroup, /useLocale\('checkbox'\)/);
    assert.match(checkboxGroup, /t\(fallbackKey, \{ n: limit \}\)/);
    assert.doesNotMatch(checkboxGroup, /超过最大选择数量/);
    assert.doesNotMatch(checkboxGroup, /console\.warn/);
    // 校验方法不再以弹窗作为副作用
    assert.match(checkboxGroup, /function validateSelection\(\) \{\s*return !elDisabled\.value/s);
});

test('selection controls announce state and answer the keyboard', async () => {
    const [checkbox, radio, checkboxGroup, radioGroup] = await Promise.all([
        read('components/snake-checkbox/snake-checkbox.vue'),
        read('components/snake-radio/snake-radio.vue'),
        read('components/snake-checkbox-group/snake-checkbox-group.vue'),
        read('components/snake-radio-group/snake-radio-group.vue')
    ]);

    assert.match(checkbox, /:role="'checkbox'"/);
    assert.match(checkbox, /:aria-checked="indeterminate \? 'mixed' : isChecked"/);
    assert.match(radio, /:role="'radio'"/);
    assert.match(radio, /:aria-checked="isChecked"/);
    for (const source of [checkbox, radio]) {
        assert.match(source, /:aria-disabled=/);
        assert.match(source, /:tabindex=".+ \? -1 : 0"/);
        assert.match(source, /@keydown\.enter\.prevent="toggle"/);
        assert.match(source, /@keydown\.space\.prevent="toggle"/);
        assert.match(source, /hover-class="snake-(?:checkbox|radio)--pressed"/);
    }
    // 分组提供角色上下文：单选是 radiogroup，多选是普通 group
    assert.match(checkboxGroup, /role="group"/);
    assert.match(radioGroup, /role="radiogroup"/);
});

test('selection control styles stay mini-program safe', async () => {
    const sources = await Promise.all(
        ['snake-checkbox', 'snake-radio', 'snake-checkbox-group', 'snake-radio-group'].map(name =>
            read(`components/${name}/${name}.vue`)
        )
    );
    for (const source of sources) {
        assert.doesNotMatch(source, /\drpx/);
        assert.doesNotMatch(source, /:active|:last-child|:first-child|:not\(/);
    }
    // 分隔线只依赖主题变量，最后一项由 useParent 暴露的 index 判定，不用伪类
    for (const source of sources.slice(0, 2)) {
        assert.match(source, /border-bottom: 1px solid var\(--snake-color-divider/);
        assert.match(source, /const \{ parent: \w+, index \} = useParent/);
        assert.match(source, /index\.value === total - 1/);
    }
});

test('selection control locales ship the same limit copy', async () => {
    const [zh, en] = await Promise.all([read('locale/lang/zh-CN.ts'), read('locale/lang/en-US.ts')]);
    for (const source of [zh, en]) {
        assert.match(source, /checkbox: \{ maxText: '[^']*\{n\}[^']*', minText: '[^']*\{n\}[^']*' \}/);
    }
    assert.match(zh, /最多选择 \{n\} 项/);
    assert.match(en, /Select at least \{n\} items/);
});

test('selection control docs describe the new contract and demos exercise it', async () => {
    const [checkboxDoc, radioDoc, checkboxDemo, radioDemo] = await Promise.all([
        readFile(resolve(docsRoot, 'components/checkbox.md'), 'utf8'),
        readFile(resolve(docsRoot, 'components/radio.md'), 'utf8'),
        readFile(resolve(pagesRoot, 'checkbox/index.vue'), 'utf8'),
        readFile(resolve(pagesRoot, 'radio/index.vue'), 'utf8')
    ]);

    for (const doc of [checkboxDoc, radioDoc]) {
        assert.match(doc, /^## 无障碍$/m);
        assert.match(doc, /`placement`/);
        assert.match(doc, /`border`/);
        assert.match(doc, /`inactiveColor`/);
        assert.doesNotMatch(doc, /源码：/);
    }
    assert.match(checkboxDoc, /role="checkbox"/);
    assert.match(radioDoc, /role="radiogroup"/);
    assert.match(checkboxDoc, /\{n\}/);
    assert.match(checkboxDoc, /`indeterminate`/);
    assert.match(checkboxDoc, /`toggleAll\(options\?\)`/);
    assert.match(checkboxDoc, /`min`/);
    // 分组不存在的 name 属性不应再出现在文档里
    assert.doesNotMatch(checkboxDoc, /在表单内提交时的标识符/);
    for (const demo of [checkboxDemo, radioDemo]) {
        assert.match(demo, /variant="preview"/);
        assert.match(demo, /placement="right"/);
        assert.match(demo, /border/);
        assert.match(demo, /snake-form/);
    }
    assert.match(checkboxDemo, /demo-checkbox-showcase/);
    assert.match(radioDemo, /demo-radio-showcase/);
    assert.match(checkboxDemo, /indeterminate/);
    assert.match(checkboxDemo, /toggleAll\(\{ checked: !allChecked\.value \}\)/);
});
