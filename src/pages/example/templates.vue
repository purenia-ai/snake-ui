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
            <button
                v-for="item in templates"
                :key="item.key"
                :class="['template-tab', { 'template-tab--active': item.key === active }]"
                @click="choose(item.key)"
            >
                <snake-icon :name="item.icon || 'page'" :size="18" />
                <text>{{ text(item.title) }}</text>
            </button>
        </view>
        <DemoSection bare variant="preview" :title="text('模板预览')">
            <view class="template-preview">
                <view class="template-preview__top">
                    <text v-if="!isEnglish" class="template-preview__eyebrow">{{ current.titleEn }}</text>
                    <text class="template-preview__title">{{ text(current.title) }}</text>
                    <text class="template-preview__desc">{{ text(current.desc) }}</text>
                </view>
                <ShowcaseContent :key="active" :kind="active" compact />
                <view class="template-preview__actions">
                    <snake-button type="primary" @click="openTemplate(current.path)">{{
                        text('查看完整页面')
                    }}</snake-button>
                </view>
            </view>
        </DemoSection>
        <DemoSection :title="text('使用的组件')" :description="text('点击组件卡片查看独立 API 演示')">
            <view class="component-links">
                <view
                    v-for="item in related[active]"
                    :key="item.path"
                    class="component-link"
                    hover-class="component-link--hover"
                    role="button"
                    tabindex="0"
                    @click="openComponent(item.path)"
                    @keydown.enter="openComponent(item.path)"
                >
                    <text>{{ isEnglish ? item.titleEn : item.title }}</text>
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
import ShowcaseContent from '../../components/showcase-content/showcase-content.vue';
import { useDemoLocale } from '../../common/demo-i18n';
import templates from './templates.config';

defineOptions({ name: 'ExampleTemplates' });
const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
type TemplateKey = 'commerce-home' | 'campaign' | 'cms-content';
const active = ref<TemplateKey>('commerce-home');
const current = computed(() => templates.find(item => item.key === active.value) || templates[0]);
const related: Record<TemplateKey, { title: string; titleEn: string; path: string }[]> = {
    'commerce-home': [
        { title: '商品列表', titleEn: 'Goods list', path: '/pages/componentsB/goodsList/index' },
        { title: '图文导航', titleEn: 'Graphic navigation', path: '/pages/componentsB/graphicNavigation/index' },
        { title: '轮播广告', titleEn: 'Picture ads', path: '/pages/componentsB/pictureAds/index' },
        { title: '优惠券', titleEn: 'Coupon', path: '/pages/componentsB/coupon/index' }
    ],
    campaign: [
        { title: '活动列表', titleEn: 'Activity list', path: '/pages/componentsB/activityList/index' },
        { title: '通知公告', titleEn: 'Notice', path: '/pages/componentsB/notice/index' },
        { title: '倒计时', titleEn: 'Count down', path: '/pages/componentsA/countDown/index' },
        { title: '商品列表', titleEn: 'Goods list', path: '/pages/componentsB/goodsList/index' }
    ],
    'cms-content': [
        { title: 'Snake CMS', titleEn: 'Snake CMS', path: '/pages/componentsB/snakeCms/index' },
        { title: '通知公告', titleEn: 'Notice', path: '/pages/componentsB/notice/index' },
        { title: '图文导航', titleEn: 'Graphic navigation', path: '/pages/componentsB/graphicNavigation/index' }
    ]
};
const choose = (key: string) => {
    if (!(key in related)) return;
    active.value = key as TemplateKey;
};
const openComponent = (path: string) => uni.navigateTo({ url: path });
const openTemplate = (path: string) => uni.navigateTo({ url: path });
</script>

<style lang="scss" scoped>
@import '../../common/demo.scss';
.template-switcher {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    margin-bottom: 11px;
    padding-bottom: 2px;
}
.template-tab {
    display: flex;
    flex: none;
    margin: 0;
    padding: 9px 11px;
    align-items: center;
    gap: 5px;
    border: 1px solid var(--snake-color-divider);
    border-radius: 499.5px;
    color: var(--snake-color-text-secondary);
    background: var(--snake-color-surface);
    font-size: 12px;
    line-height: 1.3;
}
.template-tab::after {
    border: 0;
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
    border-radius: 11px;
    background: var(--snake-color-surface-muted);
}
.template-preview__top {
    padding: 16px;
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
    font-size: 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
}
.template-preview__title {
    margin-top: 5px;
    font-size: 19px;
    font-weight: 750;
}
.template-preview__desc {
    margin-top: 4px;
    color: rgba(239, 255, 248, 0.78);
    font-size: 12px;
    line-height: 1.5;
}
.template-preview__actions {
    padding: 10px;
}
.component-links {
    display: grid;
    gap: 5px;
}
.component-link {
    display: flex;
    padding: 11px 12px;
    align-items: center;
    justify-content: space-between;
    border: 1px solid var(--snake-color-divider);
    border-radius: 7px;
    color: var(--snake-color-text);
    background: var(--snake-color-surface);
    font-size: 13px;
}
.component-link--hover {
    border-color: var(--snake-color-primary);
    background: var(--snake-color-primary-light);
}
.component-link:focus-visible {
    border-color: var(--snake-color-primary);
    background: var(--snake-color-primary-light);
}
</style>
