<script setup lang="ts">
import { computed, reactive } from 'vue';
import { demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const controls: DemoControl[] = [
    {
        key: 'variant',
        label: '占位形态',
        type: 'select',
        defaultValue: 'rect',
        options: [
            { label: '文本', value: 'text' },
            { label: '矩形', value: 'rect' },
            { label: '圆形', value: 'circle' },
            { label: '图片', value: 'image' }
        ]
    },
    { key: 'animated', label: '流光动画', type: 'switch', defaultValue: true }
];
const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({
        ...control,
        label: text(control.label),
        options: control.options?.map(option => ({ ...option, label: text(option.label) }))
    }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('skeleton-item', '骨架占位');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<template>
    <DemoPage :title="title" :eyebrow="text('基础组件')" :desc="text('用于自由组合业务骨架结构。')">
        <DemoSection variant="preview" :title="text('占位形态')">
            <view class="demo-skeleton-item-showcase">
                <snake-skeleton-item
                    :variant="state.variant as any"
                    height="120rpx"
                    :animated="Boolean(state.animated)"
                />
                <snake-skeleton-item variant="circle" width="96rpx" height="96rpx" />
                <snake-skeleton-item variant="text" width="70%" />
                <snake-skeleton-item variant="rect" height="120rpx" />
                <snake-skeleton-item variant="image" height="240rpx" radius="20rpx" />
                <snake-skeleton-item variant="text" width="55%" :animated="false" />
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<style scoped>
.demo-skeleton-item-showcase {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
    padding: 24rpx;
    border-radius: 16rpx;
    background: var(--snake-color-surface-muted);
}
</style>
