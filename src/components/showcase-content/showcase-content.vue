<template>
    <view :class="['showcase', { 'showcase--compact': compact }]">
        <view class="showcase__hero">
            <text class="showcase__eyebrow">{{ eyebrow }}</text>
            <text class="showcase__title">{{ heading }}</text>
            <text class="showcase__summary">{{ summary }}</text>
        </view>

        <template v-if="kind === 'commerce-home'">
            <snake-picture-ads :datas="pictureAdsData" />
            <view class="showcase__section"
                ><text>{{ text('发现好物') }}</text
                ><text>01 / 03</text></view
            >
            <snake-graphic-navigation :datas="showcaseNavigation" />
            <view class="showcase__section"
                ><text>{{ text('精选商品') }}</text
                ><text>02 / 03</text></view
            >
            <snake-goods-list
                :goods-list="showcaseGoods"
                list-type="sale"
                :commodity-type="0"
                :page-margin="12"
                :image-margin="8"
            />
            <view class="showcase__section"
                ><text>{{ text('专属优惠') }}</text
                ><text>03 / 03</text></view
            >
            <snake-coupon
                :key="couponKey"
                :datas="couponData"
                :coupon-service="couponDemo.service"
                @received="feedback = text('优惠券已领取')"
                @error="feedback = text('领取失败，请重试')"
            />
            <snake-button v-if="feedback" class="showcase__reset" plain size="small" @click="resetCoupon">{{
                text('再次体验')
            }}</snake-button>
        </template>

        <template v-else-if="kind === 'campaign'">
            <snake-notice :datas="showcaseNotice" />
            <view class="showcase__section"
                ><text>{{ text('限时活动') }}</text
                ><text>01 / 03</text></view
            >
            <snake-picture-ads :datas="pictureAdsData" />
            <view class="showcase__countdown">
                <text>{{ text('距离活动结束') }}</text>
                <snake-count-down :timestamp="86461" color="var(--snake-color-primary-deep)" :show-border="true" />
            </view>
            <view class="showcase__section"
                ><text>{{ text('活动场次') }}</text
                ><text>02 / 03</text></view
            >
            <snake-activity-list :list="showcaseActivities" :current="currentActivity" @change="selectActivity" />
            <view class="showcase__section"
                ><text>{{ text('活动商品') }}</text
                ><text>03 / 03</text></view
            >
            <snake-goods-list
                :goods-list="showcaseGoods"
                list-type="sale"
                :commodity-type="0"
                :page-margin="12"
                :image-margin="8"
            />
        </template>

        <template v-else>
            <view class="showcase__section"
                ><text>{{ text('内容编排') }}</text
                ><text>01 / 01</text></view
            >
            <snake-cms
                :page-info="{ pageId: 'showcase-cms' }"
                :page-components="showcaseCmsComponents"
                :scroll-top="scrollTop"
            />
        </template>
        <text v-if="feedback" class="showcase__feedback" aria-live="polite">{{ feedback }}</text>
    </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
    activities,
    cmsComponents,
    couponData,
    createDemoCouponService,
    goods,
    navigationData,
    noticeData,
    pictureAdsData
} from '../../common/fixtures';
import { useDemoLocale } from '../../common/demo-i18n';

const props = withDefaults(
    defineProps<{
        kind: 'commerce-home' | 'campaign' | 'cms-content';
        compact?: boolean;
        scrollTop?: number;
    }>(),
    { compact: false, scrollTop: 0 }
);

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const showcaseGoods = computed(() =>
    isEnglish.value
        ? goods.map((item, index) => ({
              ...item,
              name: index ? 'Offline preview product' : 'Snake UI demo product',
              goodsName: index ? 'Offline preview product' : 'Snake UI demo product',
              tag: index ? 'New' : 'Featured'
          }))
        : goods
);
const showcaseActivities = computed(() =>
    isEnglish.value
        ? activities.map((item, index) => ({
              ...item,
              name: index ? 'Tonight at eight' : 'Live auction',
              subtitle: index ? 'Coming soon' : 'Limited-time bidding'
          }))
        : activities
);
const showcaseNavigation = computed(() =>
    isEnglish.value
        ? {
              ...navigationData,
              imageList: navigationData.imageList.map((item, index) => ({
                  ...item,
                  text: ['New', 'Auction', 'Featured', 'Services'][index]
              }))
          }
        : navigationData
);
const showcaseNotice = computed(() =>
    isEnglish.value
        ? {
              ...noticeData,
              textList: [
                  { text: 'The Snake UI demo is ready', url: '' },
                  { text: 'All example data runs locally', url: '' }
              ]
          }
        : noticeData
);
const showcaseCmsComponents = computed(() =>
    isEnglish.value
        ? [
              { component: 'notice', setStyle: showcaseNotice.value },
              { component: 'graphicnavigation', setStyle: showcaseNavigation.value }
          ]
        : cmsComponents
);
const currentActivity = ref('001');
const feedback = ref('');
const couponKey = ref(0);
const couponDemo = createDemoCouponService();
const eyebrow = computed(
    () =>
        ({ 'commerce-home': 'SNAKE / COMMERCE', campaign: 'SNAKE / CAMPAIGN', 'cms-content': 'SNAKE / CMS' })[
            props.kind
        ]
);
const heading = computed(() =>
    text({ 'commerce-home': '商品首页', campaign: '活动专题页', 'cms-content': 'CMS 内容页' }[props.kind])
);
const summary = computed(() =>
    text(
        {
            'commerce-home': '从发现商品到领取优惠，体验完整的商城首页。',
            campaign: '通知、倒计时、场次和商品组成的活动页面。',
            'cms-content': '用装修配置组合公告与图文导航。'
        }[props.kind]
    )
);

function selectActivity(item: { id: string | number }) {
    currentActivity.value = String(item.id);
    feedback.value = text('已切换活动场次');
}
function resetCoupon() {
    couponDemo.reset();
    couponKey.value += 1;
    feedback.value = '';
}
</script>

<style lang="scss" scoped>
.showcase {
    overflow: hidden;
    border: 1px solid var(--snake-color-divider);
    border-radius: 24rpx;
    background: var(--snake-color-surface);
}
.showcase__hero {
    position: relative;
    overflow: hidden;
    padding: 50rpx 36rpx 54rpx;
    color: #effff8;
    background: linear-gradient(120deg, var(--snake-color-primary-deeper), var(--snake-color-primary-deep));
}
.showcase__hero::after {
    content: '';
    position: absolute;
    width: 230rpx;
    height: 230rpx;
    right: -50rpx;
    top: -70rpx;
    border: 1px solid rgba(255, 255, 255, 0.28);
    border-radius: 32rpx;
    transform: rotate(28deg);
}
.showcase__eyebrow,
.showcase__title,
.showcase__summary {
    display: block;
    position: relative;
    z-index: 1;
}
.showcase__eyebrow {
    font-size: 20rpx;
    letter-spacing: 3rpx;
    opacity: 0.72;
}
.showcase__title {
    margin-top: 14rpx;
    font-size: 42rpx;
    font-weight: 740;
}
.showcase__summary {
    max-width: 520rpx;
    margin-top: 12rpx;
    font-size: 24rpx;
    line-height: 1.55;
    opacity: 0.82;
}
.showcase__section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 26rpx 24rpx 16rpx;
    color: var(--snake-color-text);
    font-size: 28rpx;
    font-weight: 680;
}
.showcase__section text:last-child {
    color: var(--snake-color-text-muted);
    font-size: 18rpx;
    font-weight: 500;
    letter-spacing: 2rpx;
}
.showcase__countdown {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12rpx;
    margin: 22rpx 24rpx;
    padding: 22rpx;
    border-radius: 14rpx;
    background: var(--snake-color-primary-light);
    color: var(--snake-color-primary-deep);
    font-size: 23rpx;
}
.showcase__feedback {
    display: block;
    margin: 16rpx 24rpx 24rpx;
    color: var(--snake-color-primary-deep);
    font-size: 22rpx;
}
.showcase__reset {
    margin: 16rpx 24rpx;
}
.showcase--compact .showcase__hero {
    padding: 34rpx 28rpx;
}
.showcase--compact .showcase__title {
    font-size: 34rpx;
}
.showcase--compact .showcase__summary {
    font-size: 22rpx;
}
</style>
