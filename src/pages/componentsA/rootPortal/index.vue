<template>
    <DemoPage :title="title" :desc="text('把内容传送到页面根节点，解决复杂布局下 fixed 弹层失效的问题。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack">
                <text class="demo-variant-title">{{ isEnglish ? 'Transformed cage' : '带 transform 的容器' }}</text>
                <view class="demo-portal-cage" :style="{ transform: cageTransform }">
                    <text class="demo-portal-tip">
                        {{
                            isEnglish
                                ? 'A fixed popup here would be trapped, scaled and clipped'
                                : '这里的 fixed 弹层会被困住：跟随缩放、被裁剪'
                        }}
                    </text>
                    <snake-button type="primary" size="small" @click="show = true">
                        {{ isEnglish ? 'Show popup' : '显示弹层' }}
                    </snake-button>
                    <snake-root-portal v-if="state.usePortal">
                        <snake-popup :show="show" mode="bottom" round @close="show = false">
                            <view class="demo-portal-content">
                                <text class="demo-portal-title">
                                    {{ isEnglish ? 'Portaled popup' : '传送后的弹层' }}
                                </text>
                                <text class="demo-portal-text">
                                    {{
                                        isEnglish
                                            ? 'Rendered at the page root; theme vars still apply.'
                                            : '渲染在页面根节点，主题变量依然生效。'
                                    }}
                                </text>
                                <snake-button size="small" @click="show = false">
                                    {{ isEnglish ? 'Close' : '关闭' }}
                                </snake-button>
                            </view>
                        </snake-popup>
                    </snake-root-portal>
                    <snake-popup v-if="!state.usePortal" :show="show" mode="bottom" round @close="show = false">
                        <view class="demo-portal-content">
                            <text class="demo-portal-title">{{ isEnglish ? 'Trapped popup' : '被困住的弹层' }}</text>
                            <text class="demo-portal-text">
                                {{
                                    isEnglish
                                        ? 'Trapped by the transformed cage.'
                                        : '被 transform 容器困住，无法铺满视口。'
                                }}
                            </text>
                            <snake-button size="small" @click="show = false">
                                {{ isEnglish ? 'Close' : '关闭' }}
                            </snake-button>
                        </view>
                    </snake-popup>
                </view>
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
const show = ref(false);
const controls: DemoControl[] = [
    {
        key: 'usePortal',
        label: '使用根节点传送',
        type: 'switch',
        defaultValue: true
    },
    {
        key: 'cageScale',
        label: '容器缩放',
        type: 'slider',
        defaultValue: 70,
        min: 50,
        max: 100,
        step: 5,
        unit: '%'
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
    return demoTitle('root-portal', '根节点传送');
});
const cageTransform = computed(() => `scale(${Number(state.cageScale) / 100})`);
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
.demo-portal-cage {
    display: flex;
    min-height: 360rpx;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20rpx;
    padding: 32rpx;
    overflow: hidden;
    border: 2rpx dashed var(--snake-color-border);
    border-radius: 16rpx;
    background: var(--snake-color-surface-muted);
}
.demo-portal-tip {
    color: var(--snake-color-text);
    font-size: 26rpx;
    line-height: 1.5;
    text-align: center;
}
.demo-portal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16rpx;
    padding: 40rpx 32rpx;
}
.demo-portal-title {
    color: var(--snake-color-text);
    font-size: 30rpx;
    font-weight: 600;
}
.demo-portal-text {
    color: var(--snake-color-text);
    font-size: 26rpx;
    line-height: 1.5;
    text-align: center;
}
</style>
