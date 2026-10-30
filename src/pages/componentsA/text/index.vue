<template>
    <DemoPage :title="title" :desc="text('价格、脱敏、日期与链接等常用文本场景。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-text-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Live preview' : '实时预览' }}</text>
                <snake-text
                    :mode="String(state.tMode)"
                    :type="String(state.tType)"
                    :text="sampleText()"
                    :format="sampleFormat()"
                    :bold="Boolean(state.tBold)"
                    :block="Boolean(state.tBlock)"
                    :decoration="String(state.tDecoration)"
                    :align="String(state.tAlign)"
                    :lines="state.tLines ? Number(state.tLines) : ''"
                    :size="Number(state.tSize)"
                    :color="String(state.tColor) || undefined"
                    :prefix-icon="String(state.tPrefix)"
                    :suffix-icon="String(state.tSuffix)"
                    href="https://github.com/purenia-ai/snake-ui"
                    @click="onTextClick"
                />
                <text class="demo-variant-sub">{{ lastClick || (isEnglish ? 'No event yet' : '暂无事件') }}</text>
                <text class="demo-variant-title">{{ isEnglish ? 'Preset modes' : '模式示例' }}</text>
                <snake-text :text="'13800138000'" mode="phone" format="encrypt" />
                <snake-text :text="'张三丰'" mode="name" format="encrypt" />
                <snake-text :text="1288" mode="price" />
                <snake-text :text="new Date(2026, 0, 1).getTime()" mode="date" />
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const lastClick = ref('');
const controls: DemoControl[] = [
    {
        key: 'tMode',
        label: '文本模式',
        type: 'select',
        defaultValue: 'text',
        options: [
            { label: '普通文本', value: 'text' },
            { label: '价格', value: 'price' },
            { label: '手机号', value: 'phone' },
            { label: '姓名', value: 'name' },
            { label: '日期', value: 'date' },
            { label: '超链接', value: 'link' }
        ]
    },
    {
        key: 'tType',
        label: '主题颜色',
        type: 'select',
        defaultValue: '',
        options: [
            { label: '无预设', value: '' },
            { label: '品牌绿', value: 'primary' },
            { label: '警示色', value: 'warning' },
            { label: '成功', value: 'success' },
            { label: '信息', value: 'info' },
            { label: '错误', value: 'error' }
        ]
    },
    { key: 'tBold', label: '粗体', type: 'switch', defaultValue: false },
    { key: 'tBlock', label: '块状', type: 'switch', defaultValue: false },
    {
        key: 'tDecoration',
        label: '装饰线',
        type: 'select',
        defaultValue: 'none',
        options: [
            { label: '无', value: 'none' },
            { label: '下划线', value: 'underline' },
            { label: '删除线', value: 'line-through' }
        ]
    },
    {
        key: 'tAlign',
        label: '对齐方式',
        type: 'select',
        defaultValue: 'left',
        options: [
            { label: '左对齐', value: 'left' },
            { label: '居中', value: 'center' },
            { label: '右对齐', value: 'right' }
        ]
    },
    {
        key: 'tLines',
        label: '显示行数',
        type: 'select',
        defaultValue: '',
        options: [
            { label: '无限制', value: '' },
            { label: '1 行', value: '1' },
            { label: '2 行', value: '2' }
        ]
    },
    { key: 'tSize', label: '字体大小', type: 'slider', defaultValue: 28, min: 24, max: 48, step: 2, unit: 'rpx' },
    {
        key: 'tColor',
        label: '文字颜色',
        type: 'select',
        defaultValue: '',
        options: [
            { label: '默认', value: '' },
            { label: '品牌绿', value: '#06D290' },
            { label: '警示色', value: '#fa3534' },
            { label: '黑色', value: '#000000' }
        ]
    },
    {
        key: 'tPrefix',
        label: '前置图标',
        type: 'select',
        defaultValue: '',
        options: [
            { label: '无图标', value: '' },
            { label: '搜索', value: 'search' },
            { label: '手机', value: 'phone' }
        ]
    },
    {
        key: 'tSuffix',
        label: '后置图标',
        type: 'select',
        defaultValue: '',
        options: [
            { label: '无图标', value: '' },
            { label: '箭头', value: 'arrow-right' }
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
    return demoTitle('text', '文本');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function sampleText(): string | number {
    switch (String(state.tMode)) {
        case 'price':
            return 1288;
        case 'phone':
            return '13800138000';
        case 'name':
            return '张三丰';
        case 'date':
            return new Date(2026, 0, 1, 10, 30).getTime();
        case 'link':
            return isEnglish.value ? 'Open Snake UI' : '打开 Snake UI';
        default:
            if (state.tLines) {
                return isEnglish.value
                    ? 'Snake UI keeps reusable interface components consistent across commerce and content pages. This longer sample lets you compare one-line and two-line truncation while adjusting text size and style.'
                    : 'Snake UI 将常用界面组件组合到商城和内容页面中。这段较长的示例文字用于观察单行与双行截断效果，也方便比较字号、颜色和图标设置后的变化。';
            }
            return isEnglish.value ? 'Snake UI text component' : 'Snake UI 文本组件示例';
    }
}
function sampleFormat() {
    if (String(state.tMode) === 'phone' || String(state.tMode) === 'name') return 'encrypt';
    return '';
}
function onTextClick() {
    lastClick.value = text('点击事件');
}
</script>

<style scoped>
.demo-stack {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
}
.demo-variant-title {
    color: var(--snake-color-text);
    font-size: 28rpx;
    font-weight: 600;
    line-height: 1.4;
}
.demo-variant-sub {
    color: var(--snake-color-text-muted);
    font-size: 24rpx;
}
</style>
