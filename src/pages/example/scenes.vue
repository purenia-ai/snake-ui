<template>
    <DemoPage
        tabbar
        current-tab="scenes"
        :title="text('业务场景')"
        :eyebrow="text('Snake UI')"
        :desc="text('用现有组件快速组合真实的商城与 CMS 场景')"
        :nav-back="false"
        :nav-home="false"
    >
        <view class="scene-hero">
            <view class="scene-hero__glow" />
            <text class="scene-hero__eyebrow">SNAKE / SCENES</text>
            <text class="scene-hero__title">{{ text('把组件放进真实业务里') }}</text>
            <text class="scene-hero__desc">{{ text('从商品浏览到内容营销，直接查看可复用的组合方式。') }}</text>
        </view>
        <DemoSection
            v-for="group in scenes"
            :key="group.key"
            :title="text(group.title)"
            :description="text(group.titleEn)"
        >
            <view class="scene-grid">
                <view
                    v-for="item in group.items"
                    :key="item.key"
                    class="scene-card"
                    hover-class="scene-card--hover"
                    @click="open(item.path)"
                >
                    <view class="scene-card__icon"><snake-icon :name="item.icon || group.icon" :size="22" /></view>
                    <view class="scene-card__body">
                        <view class="scene-card__title-row">
                            <text class="scene-card__title">{{ text(item.title) }}</text>
                            <text class="scene-card__badge">{{
                                text(item.kind === 'scene' ? '完整场景' : '组件演示')
                            }}</text>
                        </view>
                        <text class="scene-card__en">{{ item.titleEn }}</text>
                        <text class="scene-card__desc">{{ text(item.desc) }}</text>
                    </view>
                    <snake-icon name="arrow-right" :size="18" />
                </view>
            </view>
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import DemoPage from '../../components/demo-page/demo-page.vue';
import DemoSection from '../../components/demo-section/demo-section.vue';
import { useDemoLocale } from '../../common/demo-i18n';
import scenes from './scenes.config';

defineOptions({ name: 'ExampleScenes' });
const { text } = useDemoLocale();
const open = (path: string) => uni.navigateTo({ url: path });
</script>

<style lang="scss" scoped>
@import '../../common/demo.scss';
.scene-hero {
    position: relative;
    overflow: hidden;
    margin: 0 0 26rpx;
    padding: 38rpx 32rpx;
    border-radius: 24rpx;
    color: #effff8;
    background: linear-gradient(135deg, var(--snake-color-primary-deeper), var(--snake-color-primary-deep));
}
.scene-hero__glow {
    position: absolute;
    width: 260rpx;
    height: 260rpx;
    right: -80rpx;
    top: -100rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.14);
}
.scene-hero__eyebrow,
.scene-hero__title,
.scene-hero__desc {
    display: block;
    position: relative;
}
.scene-hero__eyebrow {
    color: rgba(239, 255, 248, 0.7);
    font-size: 20rpx;
    letter-spacing: 4rpx;
}
.scene-hero__title {
    margin-top: 14rpx;
    font-size: 42rpx;
    font-weight: 750;
    line-height: 1.25;
}
.scene-hero__desc {
    margin-top: 12rpx;
    color: rgba(239, 255, 248, 0.78);
    font-size: 25rpx;
    line-height: 1.6;
}
.scene-grid {
    display: grid;
    gap: 14rpx;
}
.scene-card {
    display: flex;
    min-height: 132rpx;
    padding: 24rpx;
    align-items: center;
    gap: 18rpx;
    border: 1px solid var(--snake-color-divider);
    border-radius: 18rpx;
    background: var(--snake-color-surface);
    transition:
        border-color 0.2s,
        background-color 0.2s,
        transform 0.2s;
}
.scene-card--hover {
    border-color: var(--snake-color-primary);
    background: var(--snake-color-primary-light);
    transform: translateY(-2rpx);
}
.scene-card__icon {
    display: flex;
    width: 68rpx;
    height: 68rpx;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: 18rpx;
    color: var(--snake-color-primary);
    background: var(--snake-color-primary-light);
}
.scene-card__body {
    min-width: 0;
    flex: 1;
}
.scene-card__title-row {
    display: flex;
    align-items: center;
    gap: 10rpx;
}
.scene-card__title {
    color: var(--snake-color-text);
    font-size: 30rpx;
    font-weight: 700;
}
.scene-card__badge {
    padding: 2rpx 8rpx;
    border-radius: 999rpx;
    color: var(--snake-color-primary-deep);
    background: var(--snake-color-primary-light);
    font-size: 18rpx;
}
.scene-card__en {
    display: block;
    margin-top: 4rpx;
    color: var(--snake-color-text-muted);
    font-size: 20rpx;
}
.scene-card__desc {
    display: block;
    margin-top: 8rpx;
    color: var(--snake-color-text-secondary);
    font-size: 24rpx;
    line-height: 1.4;
}
@media (prefers-reduced-motion: reduce) {
    .scene-card {
        transition: none;
    }
    .scene-card--hover {
        transform: none;
    }
}
</style>
