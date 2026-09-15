<template>
    <DemoPage
        tabbar
        current-tab="templates"
        :title="text('页面模板')"
        :eyebrow="text('Snake UI')"
        :desc="text('可直接参考的商城与 CMS 页面组合')"
        :nav-back="false"
        :nav-home="false"
    >
        <view class="template-switcher">
            <view
                v-for="item in templates"
                :key="item.key"
                :class="['template-tab', { 'template-tab--active': item.key === active }]"
                @click="choose(item.key)"
            >
                <snake-icon :name="item.icon || 'page'" :size="18" />
                <text>{{ text(item.title) }}</text>
            </view>
        </view>
        <DemoSection bare variant="preview" :title="text('模板预览')">
            <view class="template-preview">
                <view class="template-preview__top">
                    <text class="template-preview__eyebrow">{{ current.titleEn }}</text>
                    <text class="template-preview__title">{{ text(current.title) }}</text>
                    <text class="template-preview__desc">{{ text(current.desc) }}</text>
                </view>
                <view v-if="active === 'commerce-home'" class="template-preview__body">
                    <snake-picture-ads
                        :datas="{
                            imageList: [
                                { src: '/static/logo.png', url: '' },
                                { src: '/static/logo.png', url: '' }
                            ],
                            height: 180
                        }"
                    />
                    <snake-graphic-navigation
                        :datas="{
                            imageList: [
                                { text: '新品', src: '/static/logo.png', url: '' },
                                { text: '活动', src: '/static/logo.png', url: '' },
                                { text: '服务', src: '/static/logo.png', url: '' }
                            ]
                        }"
                    />
                    <snake-goods-list
                        :goods-list="goods"
                        list-type="sale"
                        :commodity-type="0"
                        :page-margin="12"
                        :image-margin="8"
                    />
                </view>
                <view v-else-if="active === 'campaign'" class="template-preview__body">
                    <snake-notice
                        :datas="{
                            direction: 'row',
                            textList: [{ text: 'Snake UI 限时活动进行中', url: '' }]
                        }"
                    />
                    <snake-picture-ads
                        :datas="{
                            imageList: [{ src: '/static/logo.png', url: '' }],
                            height: 210
                        }"
                    />
                    <snake-activity-list :list="activities" current="001" />
                </view>
                <view v-else class="template-preview__body">
                    <snake-cms
                        :page-info="{ pageId: 'template-preview' }"
                        :page-components="[{ component: 'notice' }, { component: 'graphicnavigation' }]"
                        :scroll-top="0"
                    />
                </view>
            </view>
        </DemoSection>
        <DemoSection :title="text('使用的组件')" :description="text('点击组件卡片查看独立 API 演示')">
            <view class="component-links">
                <view
                    v-for="item in active === 'commerce-home'
                        ? [
                              { title: '商品列表', path: '/pages/componentsB/goodsList/index' },
                              { title: '图文导航', path: '/pages/componentsB/graphicNavigation/index' },
                              { title: '轮播广告', path: '/pages/componentsB/pictureAds/index' }
                          ]
                        : active === 'campaign'
                          ? [
                                { title: '活动列表', path: '/pages/componentsB/activityList/index' },
                                { title: '通知公告', path: '/pages/componentsB/notice/index' }
                            ]
                          : [{ title: 'Snake CMS', path: '/pages/componentsB/snakeCms/index' }]"
                    :key="item.path"
                    class="component-link"
                    @click="openComponent(item.path)"
                >
                    <text>{{ text(item.title) }}</text>
                    <snake-icon name="arrow-right" :size="16" />
                </view>
            </view>
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import DemoPage from '../../components/demo-page/demo-page.vue';
import DemoSection from '../../components/demo-section/demo-section.vue';
import { useDemoLocale } from '../../common/demo-i18n';
import { goods, activities } from '../../common/fixtures';
import templates from './templates.config';

defineOptions({ name: 'ExampleTemplates' });
const { text } = useDemoLocale();
const active = ref('commerce-home');
const current = computed(() => templates.find(item => item.key === active.value) || templates[0]);
const choose = (key: string) => {
    active.value = key;
};
const openComponent = (path: string) => uni.navigateTo({ url: path });
</script>

<style lang="scss" scoped>
@import '../../common/demo.scss';
.template-switcher {
    display: flex;
    gap: 12rpx;
    overflow-x: auto;
    margin-bottom: 22rpx;
    padding-bottom: 4rpx;
}
.template-tab {
    display: flex;
    flex: none;
    padding: 18rpx 22rpx;
    align-items: center;
    gap: 10rpx;
    border: 1px solid var(--snake-color-divider);
    border-radius: 999rpx;
    color: var(--snake-color-text-secondary);
    background: var(--snake-color-surface);
    font-size: 24rpx;
}
.template-tab--active {
    border-color: var(--snake-color-primary);
    color: var(--snake-color-primary-deep);
    background: var(--snake-color-primary-light);
    font-weight: 650;
}
.template-preview {
    overflow: hidden;
    border: 1px solid var(--snake-color-divider);
    border-radius: 22rpx;
    background: var(--snake-color-surface-muted);
}
.template-preview__top {
    padding: 32rpx;
    color: #effff8;
    background: linear-gradient(135deg, var(--snake-color-primary-deeper), var(--snake-color-primary-deep));
}
.template-preview__eyebrow,
.template-preview__title,
.template-preview__desc {
    display: block;
}
.template-preview__eyebrow {
    color: rgba(239, 255, 248, 0.7);
    font-size: 20rpx;
    letter-spacing: 2rpx;
    text-transform: uppercase;
}
.template-preview__title {
    margin-top: 10rpx;
    font-size: 38rpx;
    font-weight: 750;
}
.template-preview__desc {
    margin-top: 8rpx;
    color: rgba(239, 255, 248, 0.78);
    font-size: 24rpx;
    line-height: 1.5;
}
.template-preview__body {
    padding: 18rpx;
}
.component-links {
    display: grid;
    gap: 10rpx;
}
.component-link {
    display: flex;
    padding: 22rpx 24rpx;
    align-items: center;
    justify-content: space-between;
    border: 1px solid var(--snake-color-divider);
    border-radius: 14rpx;
    color: var(--snake-color-text);
    background: var(--snake-color-surface);
    font-size: 26rpx;
}
</style>
