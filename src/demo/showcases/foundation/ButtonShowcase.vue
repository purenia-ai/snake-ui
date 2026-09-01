<script setup lang="ts">
import type { DemoValue } from '../../demo-config';

defineProps<{
    state: Record<string, DemoValue>;
    isEnglish: boolean;
}>();
</script>

<template>
    <view class="demo-button-showcase">
        <view class="demo-button-section">
            <text class="demo-button-section__title">{{ isEnglish ? 'Live preview' : '实时预览' }}</text>
            <snake-button
                :type="String(state.type)"
                :size="state.buttonSize as any"
                :shape="state.buttonShape as any"
                :plain="Boolean(state.plain)"
                :disabled="Boolean(state.disabled)"
                :loading="Boolean(state.loading)"
                :loading-text="isEnglish ? 'Processing' : '处理中'"
                :ripple="Boolean(state.ripple)"
                icon="checkmark"
            >
                Snake Button
            </snake-button>
        </view>
        <view class="demo-button-section">
            <text class="demo-button-section__title">{{ isEnglish ? 'Button themes' : '按钮主题' }}</text>
            <view class="demo-button-grid">
                <snake-button type="default">Default</snake-button>
                <snake-button type="primary">Primary</snake-button>
                <snake-button type="success">Success</snake-button>
                <snake-button type="info">Info</snake-button>
                <snake-button type="warning">Warning</snake-button>
                <snake-button type="error">Error</snake-button>
            </view>
        </view>
        <view class="demo-button-section">
            <text class="demo-button-section__title">{{ isEnglish ? 'Plain buttons' : '镂空按钮' }}</text>
            <view class="demo-button-grid">
                <snake-button type="primary" plain>Primary</snake-button>
                <snake-button type="success" plain>Success</snake-button>
                <snake-button type="warning" plain>Warning</snake-button>
                <snake-button type="error" plain>Error</snake-button>
            </view>
        </view>
        <view class="demo-button-section">
            <text class="demo-button-section__title">{{ isEnglish ? 'Button sizes' : '按钮尺寸' }}</text>
            <view class="demo-button-grid">
                <snake-button size="large">Large</snake-button>
                <snake-button>Default</snake-button>
            </view>
            <view class="demo-button-flow">
                <snake-button size="medium">Medium</snake-button>
                <snake-button size="small">Small</snake-button>
                <snake-button size="mini">Mini</snake-button>
            </view>
        </view>
        <view class="demo-button-section">
            <text class="demo-button-section__title">{{ isEnglish ? 'Button shapes' : '按钮形状' }}</text>
            <view class="demo-button-grid">
                <snake-button shape="square">{{ isEnglish ? 'Rounded' : '圆角按钮' }}</snake-button>
                <snake-button shape="circle">{{ isEnglish ? 'Pill' : '胶囊按钮' }}</snake-button>
            </view>
        </view>
        <view class="demo-button-section">
            <text class="demo-button-section__title">{{ isEnglish ? 'Button states' : '按钮状态' }}</text>
            <view class="demo-button-grid">
                <snake-button disabled>{{ isEnglish ? 'Disabled' : '禁用状态' }}</snake-button>
                <snake-button loading :loading-text="isEnglish ? 'Loading' : '加载中'" />
                <snake-button type="success" loading loading-mode="spinner">Spinner</snake-button>
            </view>
        </view>
        <view class="demo-button-section">
            <text class="demo-button-section__title">{{ isEnglish ? 'Icon buttons' : '图标按钮' }}</text>
            <view class="demo-button-flow">
                <snake-button size="medium" icon="checkmark">{{ isEnglish ? 'Confirm' : '确认' }}</snake-button>
                <snake-button size="small" type="info" icon="search">{{ isEnglish ? 'Search' : '搜索' }}</snake-button>
            </view>
        </view>
        <view class="demo-button-section">
            <text class="demo-button-section__title">{{ isEnglish ? 'Custom colors' : '自定义颜色' }}</text>
            <view class="demo-button-grid">
                <snake-button color="#7c3aed">Violet</snake-button>
                <snake-button color="#f97316" plain>Orange</snake-button>
            </view>
        </view>
        <view class="demo-button-section">
            <text class="demo-button-section__title">{{ isEnglish ? 'Ripple' : '水波纹' }}</text>
            <view class="demo-button-grid">
                <snake-button ripple>{{ isEnglish ? 'Tap anywhere' : '点击任意位置' }}</snake-button>
                <snake-button type="info" ripple ripple-bg-color="rgba(255,255,255,.42)">
                    {{ isEnglish ? 'Custom ripple' : '自定义水波纹' }}
                </snake-button>
            </view>
        </view>
    </view>
</template>

<style scoped>
.demo-button-showcase {
    display: flex;
    flex-direction: column;
    gap: 36rpx;
}

.demo-button-section {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.demo-button-section__title {
    color: var(--snake-color-text);
    font-size: 28rpx;
    font-weight: 600;
    line-height: 1.4;
}

.demo-button-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 18rpx;
}

.demo-button-flow {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 18rpx;
}
</style>
