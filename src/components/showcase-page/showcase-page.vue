<template>
    <DemoPage :title="text(item.title)" :desc="text(item.desc)">
        <ShowcaseContent :kind="kind" :scroll-top="scrollTop" />
        <DemoSection :title="text('使用的组件')" :description="text('查看独立组件演示与参数配置')">
            <view class="showcase-links">
                <view
                    v-for="link in links"
                    :key="link.path"
                    class="showcase-link"
                    hover-class="showcase-link--hover"
                    @click="open(link.path)"
                >
                    <text>{{ text(link.title) }}</text>
                    <snake-icon name="arrow-right" :size="16" />
                </view>
            </view>
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDemoLocale } from '../../common/demo-i18n';
import DemoPage from '../demo-page/demo-page.vue';
import DemoSection from '../demo-section/demo-section.vue';
import ShowcaseContent from '../showcase-content/showcase-content.vue';
import templates from '../../pages/example/templates.config';

const props = withDefaults(
    defineProps<{
        kind: 'commerce-home' | 'campaign' | 'cms-content';
        scrollTop?: number;
    }>(),
    { scrollTop: 0 }
);
const { text } = useDemoLocale();
const item = computed(() => templates.find(template => template.key === props.kind) ?? templates[0]);
const related = {
    'commerce-home': [
        { title: '轮播广告', path: '/pages/componentsB/pictureAds/index' },
        { title: '图文导航', path: '/pages/componentsB/graphicNavigation/index' },
        { title: '商品列表', path: '/pages/componentsB/goodsList/index' },
        { title: '优惠券', path: '/pages/componentsB/coupon/index' }
    ],
    campaign: [
        { title: '通知公告', path: '/pages/componentsB/notice/index' },
        { title: '倒计时', path: '/pages/componentsA/countDown/index' },
        { title: '活动列表', path: '/pages/componentsB/activityList/index' },
        { title: '商品列表', path: '/pages/componentsB/goodsList/index' }
    ],
    'cms-content': [
        { title: 'Snake CMS', path: '/pages/componentsB/snakeCms/index' },
        { title: '图文导航', path: '/pages/componentsB/graphicNavigation/index' }
    ]
};
const links = computed(() => related[props.kind]);
const open = (path: string) => uni.navigateTo({ url: path });
</script>

<style lang="scss" scoped>
.showcase-links {
    display: grid;
    gap: 12rpx;
}
.showcase-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22rpx 24rpx;
    border: 1px solid var(--snake-color-divider);
    border-radius: 14rpx;
    color: var(--snake-color-text);
    background: var(--snake-color-surface);
    font-size: 26rpx;
}
.showcase-link--hover {
    border-color: var(--snake-color-primary);
    background: var(--snake-color-primary-light);
}
</style>
