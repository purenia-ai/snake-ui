<template>
    <DemoPage :title="title" :desc="text('以横向或竖向线条分隔内容块，支持半像素细线。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-line-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Live preview' : '实时预览' }}</text>
                <snake-line
                    margin="16rpx 0"
                    :direction="String(state.lineDirection)"
                    :color="String(state.lineColor)"
                    :border-style="String(state.lineBorderStyle)"
                    :hair-line="Boolean(state.lineHair)"
                />
                <view class="demo-line-col-box">
                    <snake-line
                        direction="col"
                        length="160"
                        :color="String(state.lineColor)"
                        :border-style="String(state.lineBorderStyle)"
                        :hair-line="Boolean(state.lineHair)"
                    />
                    <text class="demo-line-col-text">{{ isEnglish ? 'Vertical' : '竖向线条' }}</text>
                </view>
                <text class="demo-variant-title">{{ isEnglish ? 'Line styles' : '线条类型' }}</text>
                <snake-line margin="16rpx 0" border-style="solid" />
                <snake-line margin="16rpx 0" border-style="dashed" />
                <snake-line margin="16rpx 0" border-style="dotted" />
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const controls: DemoControl[] = [
    {
        key: 'lineDirection',
        label: '线条方向',
        type: 'select',
        defaultValue: 'row',
        options: [
            { label: '横向', value: 'row' },
            { label: '纵向', value: 'col' }
        ]
    },
    {
        key: 'lineColor',
        label: '线条颜色',
        type: 'select',
        defaultValue: '#e4e7ed',
        options: [
            { label: '默认', value: '#e4e7ed' },
            { label: '品牌绿', value: '#06D290' },
            { label: '警示色', value: '#fa3534' }
        ]
    },
    {
        key: 'lineBorderStyle',
        label: '线条类型',
        type: 'select',
        defaultValue: 'solid',
        options: [
            { label: '实线', value: 'solid' },
            { label: '虚线', value: 'dashed' },
            { label: '圆点', value: 'dotted' }
        ]
    },
    { key: 'lineHair', label: '半像素细线', type: 'switch', defaultValue: true }
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
    return demoTitle('line', '分隔线');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
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
.demo-line-col-box {
    display: flex;
    align-items: center;
    height: 120rpx;
    gap: 24rpx;
}
.demo-line-col-text {
    color: var(--snake-color-text-muted);
    font-size: 24rpx;
}
</style>
