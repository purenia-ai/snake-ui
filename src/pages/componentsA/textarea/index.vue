<template>
    <DemoPage :title="title" :desc="text('支持字数统计和自适应高度的多行文本输入。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-textarea-showcase">
                <text class="demo-variant-title">{{ text('实时配置') }}</text>
                <snake-textarea
                    v-model="value"
                    :count="Boolean(state.textareaCount)"
                    :auto-height="Boolean(state.textareaAuto)"
                    :disabled="Boolean(state.textareaDisabled)"
                    :readonly="Boolean(state.textareaReadonly)"
                    :border="String(state.textareaBorder)"
                    :size="String(state.textareaSize)"
                    :placeholder="text('请输入内容')"
                    :maxlength="Number(state.textareaMaxlength)"
                />
                <text class="demo-textarea-caption"
                    >{{ text('已输入') }} {{ characterCount(value) }} {{ text('个字') }}</text
                >
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('尺寸与主题')">
            <view class="demo-textarea-showcase">
                <snake-textarea v-model="sizeValue" size="small" :placeholder="text('small / 64px / 13px')" />
                <snake-textarea v-model="sizeValue" :placeholder="text('default / 80px / 14px')" />
                <snake-textarea v-model="sizeValue" size="large" :placeholder="text('large / 112px / 16px')" />
                <snake-textarea v-model="sizeValue" :height="120" :placeholder="text('height 覆盖高度')" />
                <snake-textarea
                    v-model="themeValue"
                    custom-class="demo-textarea-themed"
                    :placeholder="text('主题变量覆盖')"
                />
            </view>
            <text class="demo-textarea-hint">{{ text('size 决定高度与字号，height 与 CSS 变量可以单独覆盖') }}</text>
        </DemoSection>
        <DemoSection variant="preview" :title="text('字数与格式化')">
            <view class="demo-textarea-showcase">
                <snake-textarea
                    v-model="countValue"
                    count
                    :maxlength="60"
                    :placeholder="text('输入 emoji 观察字数统计')"
                />
                <text class="demo-textarea-caption"> {{ text('字数') }}：{{ characterCount(countValue) }} / 60 </text>
                <snake-textarea
                    v-model="codeValue"
                    border="bottom"
                    :maxlength="20"
                    :formatter="uppercaseCode"
                    :placeholder="text('只保留字母数字并转大写')"
                />
                <text class="demo-textarea-caption">{{ text('格式化结果') }}：{{ codeValue || '—' }}</text>
                <snake-textarea v-model="trimValue" border="bottom" trim :placeholder="text('失焦时去掉首尾空格')" />
            </view>
            <text class="demo-textarea-hint">{{ text('字数按字符计数，emoji 与生僻字都算一个') }}</text>
        </DemoSection>
        <DemoSection variant="preview" :title="text('只读、禁用与错误态')">
            <view class="demo-textarea-showcase">
                <snake-textarea
                    v-model="readonlyValue"
                    readonly
                    :auto-height="true"
                    :placeholder="text('只读：点击整块可打开编辑页')"
                    @click="onReadonlyClick"
                />
                <snake-textarea v-model="readonlyValue" disabled :auto-height="true" :placeholder="text('禁用状态')" />
                <snake-textarea v-model="errorValue" error :auto-height="true" :placeholder="text('强制错误态')" />
            </view>
            <text class="demo-textarea-hint">{{
                readonlyTip || text('只读态会把点击交给外层，适合「点文本域打开编辑页」')
            }}</text>
        </DemoSection>
        <DemoSection variant="preview" :title="text('方法与自适应高度')">
            <view class="demo-textarea-showcase">
                <snake-textarea
                    ref="textareaRef"
                    v-model="methodValue"
                    :auto-height="true"
                    :placeholder="text('通过 ref 调用 focus() / blur() / clear()')"
                />
                <view class="demo-textarea-tools">
                    <snake-button size="small" :text="text('聚焦')" @click="callFocus" />
                    <snake-button size="small" :text="text('失焦')" @click="callBlur" />
                    <snake-button size="small" :text="text('清空')" @click="callClear" />
                </view>
                <text class="demo-textarea-caption">{{ text('当前值') }}：{{ methodValue || '—' }}</text>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { TextareaExpose } from '../../../uni_modules/snake-ui';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const value = ref('');
const countValue = ref('关注公众号领券🎉');
const sizeValue = ref('');
const themeValue = ref('');
const codeValue = ref('');
const trimValue = ref('');
const readonlyValue = ref('这是一段只读说明，点击整块会打开编辑页。');
const errorValue = ref('');
const methodValue = ref('');
const readonlyTip = ref('');
const textareaRef = ref<TextareaExpose | null>(null);
const controls: DemoControl[] = [
    { key: 'textareaCount', label: '显示字数', type: 'switch', defaultValue: true },
    {
        key: 'textareaMaxlength',
        label: '最大字数',
        type: 'slider',
        defaultValue: 80,
        min: 20,
        max: 200,
        step: 10,
        unit: '字'
    },
    {
        key: 'textareaSize',
        label: '组件尺寸',
        type: 'select',
        defaultValue: 'default',
        options: [
            { label: 'small', value: 'small' },
            { label: 'default', value: 'default' },
            { label: 'large', value: 'large' }
        ]
    },
    { key: 'textareaAuto', label: '高度自适应', type: 'switch', defaultValue: false },
    { key: 'textareaDisabled', label: '禁用状态', type: 'switch', defaultValue: false },
    { key: 'textareaReadonly', label: '只读状态', type: 'switch', defaultValue: false },
    {
        key: 'textareaBorder',
        label: '边框',
        type: 'select',
        defaultValue: 'surround',
        options: [
            { label: '四周', value: 'surround' },
            { label: '下划线', value: 'bottom' },
            { label: '无边框', value: 'none' }
        ]
    }
];
const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({
        ...control,
        label: demoText(control.label),
        options: control.options?.map(option => ({ ...option, label: demoText(option.label) }))
    }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('textarea', '文本域');
});
/** 按码点计数，emoji 不被算成两个。 */
function characterCount(input: string) {
    return Array.from(input).length;
}
/** 只保留字母数字并转大写，演示「格式化 + 原生值同步」。 */
function uppercaseCode(input: string) {
    return input.replace(/[^0-9a-z]/gi, '').toUpperCase();
}
function updateValue(key: string, nextValue: DemoValue) {
    state[key] = nextValue;
    if (key === 'textareaDisabled' && nextValue) state.textareaReadonly = false;
    if (key === 'textareaReadonly' && nextValue) state.textareaDisabled = false;
}
function onReadonlyClick() {
    readonlyTip.value = text('收到 click：可以在这里打开编辑页');
}
function callFocus() {
    textareaRef.value?.focus();
}
function callBlur() {
    textareaRef.value?.blur();
}
function callClear() {
    textareaRef.value?.clear();
}
</script>
<style scoped>
.demo-textarea-showcase {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.demo-textarea-caption {
    color: var(--snake-color-text-secondary);
    font-size: 13px;
}
.demo-textarea-hint {
    display: block;
    margin-top: 10px;
    color: var(--snake-color-text-muted);
    font-size: 12px;
}
.demo-textarea-tools {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
/* 主题变量覆盖：只在本页作用域内生效 */
.demo-textarea-themed {
    --snake-textarea-height: 100px;
    --snake-textarea-font-size: 16px;
    --snake-textarea-border-color: var(--snake-color-primary, #06d290);
    --snake-textarea-radius: 14px;
    --snake-textarea-count-color: var(--snake-color-primary, #06d290);
}
</style>
