import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../src/uni_modules/snake-ui/', import.meta.url);
const workspaceRoot = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const readWorkspace = path => readFile(new URL(path, workspaceRoot), 'utf8');

const source = () => read('components/snake-select-picker/snake-select-picker.vue');
const types = () => read('components/snake-select-picker/types.ts');

test('snake-select-picker owns a runtime props contract with single/multiple and guard options', async () => {
    const typeContract = await types();
    const component = await source();

    assert.match(typeContract, /export const selectPickerProps =/);
    assert.match(typeContract, /export type SelectPickerProps = ExtractPropTypes<typeof selectPickerProps>/);
    assert.match(typeContract, /export type SelectPickerValue = SelectPickerPrimitive \| SelectPickerPrimitive\[\]/);
    assert.match(
        typeContract,
        /export type SelectPickerBeforeConfirm = \(value: SelectPickerValue\) => boolean \| Promise<boolean>/
    );
    assert.match(typeContract, /export interface SelectPickerExpose/);
    assert.match(component, /defineProps\(selectPickerProps\)/);
    assert.doesNotMatch(component, /withDefaults\(defineProps/);

    // 单选默认标量、开 multiple 变数组；开合走 v-model:visible 而不是 v-model
    assert.match(typeContract, /multiple: \{ type: Boolean, default: false \}/);
    assert.match(typeContract, /visible: \{ type: Boolean, default: false \}/);
    assert.match(component, /get: \(\) => props\.visible/);
    assert.match(component, /emit\('update:visible', val\)/);
    assert.match(component, /const showConfirmResolved = computed\(\(\) => props\.showConfirm \?\? !props\.multiple\)/);

    // 多选上下限、搜索、加载与空态
    assert.match(component, /const maxReached = computed/);
    assert.match(component, /const canConfirm = computed/);
    assert.match(component, /const minTipVisible = computed/);
    assert.match(component, /:scroll-into-view="scrollIntoViewId"/);
    assert.match(component, /scroll-y/);
});

test('snake-select-picker keeps the draft local and commits only on confirm', async () => {
    const component = await source();

    // 草稿/已确认值分离：打开时装载，关闭时丢弃
    assert.match(component, /const draft = ref<SelectPickerPrimitive\[\]>\(\[\]\)/);
    assert.match(component, /draft\.value = normalizeValue\(props\.modelValue\)/);
    assert.match(component, /draft\.value = \[\];/);
    assert.match(component, /emit\('update:modelValue', value\)/);

    // 确认路径：beforeConfirm 显式放行才提交，否则保持弹层打开
    assert.match(component, /allowed = \(await hook\(finalValue\(\)\)\) === true/);
    assert.match(component, /if \(!allowed\) return;/);
    assert.match(component, /void formItem\?\.notify\('change'\)/);

    // 单选「点选即提交」
    assert.match(component, /if \(!props\.multiple && !showConfirmResolved\.value\) void submit\(\)/);

    // 达到上限后未选项不可点
    assert.match(
        component,
        /props\.loading \|\| isItemDisabled\(item\) \|\| \(maxReached\.value && !isChecked\(item\)\)/
    );
});

test('snake-select-picker renders an accessible bottom-sheet list without rpx literals', async () => {
    const component = await source();

    assert.match(component, /<snake-popup/);
    assert.match(component, /mode="bottom"/);
    assert.match(component, /:root-portal="rootPortal"/);
    assert.match(component, /<scroll-view/);
    assert.match(component, /:role="multiple \? 'checkbox' : 'radio'"/);
    assert.match(component, /:aria-checked="isChecked\(item\) \? 'true' : 'false'"/);
    assert.match(component, /aria-label="|:aria-label="closeTextValue"/);
    assert.match(component, /@see \/components\/select-picker/);

    // 尺寸一律走 375 稿 px，不写 rpx 字面量；不用小程序不支持的伪类选择器
    assert.doesNotMatch(component, /\d+rpx/);
    assert.doesNotMatch(component, /:active|:last-child|:first-child|:not\(/);
});

test('snake-select-picker ships locale copy, registry entries and documentation', async () => {
    const zh = await read('locale/lang/zh-CN.ts');
    const en = await read('locale/lang/en-US.ts');
    for (const messages of [zh, en]) {
        assert.match(messages, /selectPicker: \{/);
        assert.match(messages, /title: /);
        assert.match(messages, /noMatchText: /);
        assert.match(messages, /minText: '.*\{n\}.*'/);
    }

    const packageEntry = await read('index.ts');
    assert.match(packageEntry, /export \* from '\.\/components\/snake-select-picker\/types'/);

    const declarationEntry = await read('types/components.d.ts');
    assert.match(declarationEntry, /export \* from '\.\.\/components\/snake-select-picker\/types'/);
    assert.match(declarationEntry, /export const SnakeSelectPicker: Component<SelectPickerProps, SelectPickerEmits>/);

    const docs = await readWorkspace('docs/components/select-picker.md');
    assert.match(docs, /^# SelectPicker 单复选选择器$/m);
    assert.match(docs, /^preview: \/pages\/componentsA\/selectPicker\/index$/m);
    assert.match(docs, /^## 平台兼容性$/m);
    assert.match(docs, /^\| H5\s*\| App\s*\| 微信小程序\s*\| 支付宝小程序\s*\|$/m);
    assert.match(docs, /^## 基础用法$/m);
    assert.match(docs, /^## API$/m);
    assert.match(docs, /^### Props$/m);
    assert.match(docs, /^### Events$/m);
    assert.match(docs, /^## 主题变量$/m);
    assert.match(docs, /\|\s*参数\s*\|\s*说明\s*\|\s*类型\s*\|\s*默认值\s*\|/);
    assert.doesNotMatch(docs, /源码：/);

    const registry = await readWorkspace('docs/.vitepress/component-groups.ts');
    assert.match(registry, /link: '\/components\/select-picker'/);
    const llms = await readWorkspace('llms.txt');
    assert.match(llms, /docs\/components\/select-picker\.md/);
});

test('snake-select-picker demo page is registered and previewable', async () => {
    const page = await readWorkspace('src/pages/componentsA/selectPicker/index.vue');
    assert.match(page, /<DemoPage/);
    assert.match(page, /<DemoSection variant="preview"/);
    assert.match(page, /<DemoSection variant="controls"/);
    assert.match(page, /<DemoControlPanel/);
    assert.match(page, /<snake-select-picker/);
    assert.doesNotMatch(page, /DemoRenderer/);

    const pages = await readWorkspace('src/pages.json');
    assert.match(pages, /"path":\s*"selectPicker\/index"/);

    const config = await readWorkspace('src/pages/example/components.config.ts');
    assert.match(config, /item\(\s*'\/pages\/componentsA\/selectPicker\/index'/);

    const docs = await readWorkspace('docs/components/select-picker.md');
    const preview = docs.match(/^preview:\s*\/?([^\r\n]+)/m)?.[1];
    assert.equal(preview, 'pages/componentsA/selectPicker/index');
    await access(new URL('src/pages/componentsA/selectPicker/index.vue', workspaceRoot));
});
