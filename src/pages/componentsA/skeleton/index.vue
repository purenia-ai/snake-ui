<template>
    <DemoPage :title="title" :desc="text('在首次加载时预显示接近真实内容的页面结构。')">
        <DemoSection variant="preview" :title="text('快速模式')">
            <view class="demo-skeleton-showcase">
                <snake-skeleton
                    :loading="Boolean(state.loading)"
                    :animated="Boolean(state.animated)"
                    :title="Boolean(state.skTitle)"
                    :rows="Number(state.skRows)"
                    :avatar="Boolean(state.skAvatar)"
                    :avatar-shape="String(state.skAvatarShape)"
                >
                    <view class="demo-skeleton-content">{{ text('数据加载完成，展示真实内容。') }}</view>
                </snake-skeleton>
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('自定义模板')">
            <snake-skeleton :loading="Boolean(state.loading)" :animated="Boolean(state.animated)">
                <template #template>
                    <view class="demo-card-grid">
                        <view v-for="index in 2" :key="index" class="demo-card">
                            <snake-skeleton-item variant="image" height="90px" />
                            <snake-skeleton-item width="78%" custom-style="margin-top: 8px" />
                            <snake-skeleton-item width="48%" height="12px" custom-style="margin-top: 6px" />
                        </view>
                    </view>
                </template>
                <view class="demo-card-grid">
                    <view v-for="index in 2" :key="index" class="demo-card demo-card--loaded">
                        {{ text('真实卡片') }} {{ index }}
                    </view>
                </view>
            </snake-skeleton>
        </DemoSection>
        <DemoSection variant="preview" :title="text('占位形态')">
            <view class="demo-skeleton-item-showcase">
                <snake-skeleton-item
                    :variant="state.variant as any"
                    :width="state.variant === 'circle' ? '48px' : state.variant === 'text' ? '70%' : '100%'"
                    :height="state.variant === 'circle' ? '48px' : state.variant === 'text' ? '12px' : '60px'"
                    :animated="Boolean(state.animated)"
                />
                <snake-skeleton-item variant="circle" width="48px" height="48px" />
                <snake-skeleton-item variant="text" width="70%" />
                <snake-skeleton-item variant="rect" height="60px" />
                <snake-skeleton-item variant="image" height="120px" radius="10px" />
                <snake-skeleton-item variant="text" width="55%" :animated="false" />
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const controls: DemoControl[] = [
    { key: 'loading', label: '显示骨架', type: 'switch', defaultValue: true },
    { key: 'animated', label: '流光动画', type: 'switch', defaultValue: true },
    { key: 'skTitle', label: '标题占位', type: 'switch', defaultValue: true },
    { key: 'skRows', label: '段落行数', type: 'slider', defaultValue: 3, min: 1, max: 6, step: 1, unit: '行' },
    { key: 'skAvatar', label: '头像占位', type: 'switch', defaultValue: true },
    {
        key: 'skAvatarShape',
        label: '头像形状',
        type: 'select',
        defaultValue: 'circle',
        options: [
            { label: '圆形', value: 'circle' },
            { label: '方形', value: 'square' }
        ]
    },
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
    }
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
    return demoTitle('skeleton', '骨架屏');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<style scoped>
.demo-skeleton-showcase,
.demo-card,
.demo-skeleton-item-showcase {
    padding: 12px;
    border: 1px solid var(--snake-color-divider);
    border-radius: 8px;
    background: var(--snake-color-surface);
}
.demo-skeleton-item-showcase {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.demo-skeleton-content,
.demo-card--loaded {
    color: var(--snake-color-text-secondary);
    font-size: 14px;
}
.demo-card-grid {
    display: flex;
    gap: 10px;
}
.demo-card {
    box-sizing: border-box;
    width: calc((100% - 10px) / 2);
}
.demo-card--loaded {
    display: flex;
    min-height: 120px;
    align-items: center;
    justify-content: center;
}
</style>
