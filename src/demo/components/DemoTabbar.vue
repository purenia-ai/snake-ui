<script setup lang="ts">
import { onMounted } from 'vue';
import type { DemoTab } from '../demo-tabbar';
import { useDemoLocale } from '../demo-i18n';

const props = defineProps<{ current: DemoTab }>();
const { text } = useDemoLocale();
const items: Array<{ key: DemoTab; label: string; icon: string; url: string }> = [
    { key: 'components', label: '组件', icon: 'menu', url: '/pages/example/components' },
    { key: 'tools', label: '工具', icon: 'setting', url: '/pages/example/tools' },
    { key: 'about', label: '关于', icon: 'info', url: '/pages/example/about' }
];

onMounted(() => {
    uni.hideTabBar({ animation: false });
});

function switchTab(key: DemoTab, url: string) {
    if (key !== props.current) uni.switchTab({ url });
}
</script>

<template>
    <view class="demo-tabbar-spacer" />
    <view class="demo-tabbar" role="navigation">
        <view class="demo-tabbar__inner">
            <view
                v-for="item in items"
                :key="item.key"
                :class="['demo-tabbar__item', { 'demo-tabbar__item--active': item.key === current }]"
                hover-class="demo-tabbar__item--hover"
                :aria-label="text(item.label)"
                @click="switchTab(item.key, item.url)"
            >
                <snake-icon :name="item.icon" :size="20" :bold="item.key === current" />
                <text class="demo-tabbar__label">{{ text(item.label) }}</text>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.demo-tabbar-spacer {
    height: calc(104rpx + env(safe-area-inset-bottom));
}

.demo-tabbar-spacer {
    height: calc(104rpx + env(safe-area-inset-bottom));
}

.demo-tabbar {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 120;
    padding-bottom: env(safe-area-inset-bottom);
    border-top: 1px solid var(--snake-color-divider);
    background: var(--snake-color-surface);
    box-shadow: 0 -6rpx 24rpx rgba(6, 39, 28, 0.07);
}

.demo-tabbar__inner {
    display: flex;
    max-width: 760px;
    height: 104rpx;
    margin: 0 auto;
    align-items: stretch;
}

.demo-tabbar__item {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5rpx;
    color: var(--snake-color-text-muted);
}

.demo-tabbar__item--hover {
    background: var(--snake-color-surface-muted);
}

.demo-tabbar__item--active {
    color: var(--snake-color-primary);
    font-weight: 650;
}

.demo-tabbar__label {
    font-size: 22rpx;
    line-height: 1.2;
}

@media (prefers-reduced-motion: reduce) {
    .demo-tabbar__item {
        transition: none;
    }
}
</style>
