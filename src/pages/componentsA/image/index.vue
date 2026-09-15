<template>
    <DemoPage :title="title" :desc="text('图片容器支持不同填充模式、圆角和加载失败状态。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack">
                <text class="demo-variant-title">{{ text('正常图片') }}</text>
                <snake-image
                    src="/static/logo.png"
                    width="100%"
                    height="320rpx"
                    :radius="Number(state.radius)"
                    :mode="String(state.imageMode)"
                />
                <text class="demo-variant-title">{{ text('加载失败') }}</text>
                <snake-image src="/static/not-found.png" width="100%" height="180rpx" :radius="Number(state.radius)" />
                <text class="demo-variant-title">
                    {{ localeName === 'en-US' ? 'Viewport lazy loading' : '视口懒加载' }}
                </text>
                <snake-image
                    src="/static/logo.png"
                    lazy-load
                    width="100%"
                    height="180rpx"
                    :radius="Number(state.radius)"
                >
                    <template #loading>
                        <view class="demo-image-placeholder">
                            {{ localeName === 'en-US' ? 'Loading…' : '正在加载…' }}
                        </view>
                    </template>
                </snake-image>
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
const controls: DemoControl[] = [
    {
        key: 'imageMode',
        label: '裁剪模式',
        type: 'select',
        defaultValue: 'aspectFit',
        options: [
            { label: '完整显示', value: 'aspectFit' },
            { label: '填充裁剪', value: 'aspectFill' }
        ]
    },
    { key: 'radius', label: '圆角', type: 'slider', defaultValue: 12, min: 0, max: 32, step: 4, unit: 'rpx' }
];
const state = reactive<Record<string, DemoValue>>({ imageMode: 'aspectFit', radius: 12 });
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
    return demoTitle('image', '图片');
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
.demo-image-placeholder {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    color: var(--snake-color-text-muted);
    font-size: 24rpx;
}
</style>
