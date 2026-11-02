<template>
    <view :class="['showcase', { 'showcase--compact': compact }]">
        <view class="showcase__hero">
            <text class="showcase__eyebrow">{{ eyebrow }}</text>
            <text class="showcase__title">{{ heading }}</text>
            <text class="showcase__summary">{{ summary }}</text>
        </view>

        <template v-if="kind === 'commerce-home'">
            <snake-picture-ads :datas="showcasePictureAds" />
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
                @item-click="selectGoods"
            />
            <view class="showcase__section"
                ><text>{{ text('专属优惠') }}</text
                ><text>03 / 03</text></view
            >
            <snake-coupon
                :key="couponKey"
                :datas="couponData"
                :coupon-service="couponDemo.service"
                @received="onCouponReceived"
                @error="onCouponError"
            />
            <snake-button
                v-if="couponActionAvailable"
                class="showcase__reset"
                plain
                size="small"
                @click="resetCoupon"
                >{{ text('再次体验') }}</snake-button
            >
        </template>

        <template v-else-if="kind === 'campaign'">
            <snake-notice :datas="showcaseNotice" />
            <view class="showcase__section"
                ><text>{{ text('限时活动') }}</text
                ><text>01 / 03</text></view
            >
            <snake-picture-ads :datas="showcasePictureAds" />
            <view class="showcase__countdown">
                <text>{{ text(countdownLabel) }}</text>
                <snake-count-down
                    :timestamp="remainingSeconds"
                    color="var(--snake-color-primary-deep)"
                    :show-border="true"
                    @end="onCountdownEnd"
                />
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
                @item-click="selectGoods"
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
    auxiliaryData,
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
const showcaseNavigation = computed(() => ({
    ...navigationData,
    imageList: navigationData.imageList.map((item, index) => ({
        ...item,
        text: text(item.text),
        url: [
            '/pages/componentsB/goodsList/index',
            '/pages/componentsB/activityList/index',
            '/pages/componentsB/goodsList/index',
            '/pages/componentsB/coupon/index'
        ][index]
    }))
}));
const showcasePictureAds = computed(() => ({
    ...pictureAdsData,
    imageList: [
        {
            src: '/static/demo-showcase-banner-1.png',
            text: text('限时活动'),
            url: props.kind === 'campaign' ? '/pages/componentsB/activityList/index' : '/pages/showcase/campaign/index'
        },
        {
            src: '/static/demo-showcase-banner-2.png',
            text: text('精选商品'),
            url: '/pages/componentsB/goodsList/index'
        }
    ]
}));
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
const showcaseCmsComponents = computed(() => [
    { component: 'notice', setStyle: showcaseNotice.value },
    { component: 'pictureads', setStyle: showcasePictureAds.value },
    { component: 'auxiliarysegmentation', setStyle: auxiliaryData },
    { component: 'graphicnavigation', setStyle: showcaseNavigation.value }
]);
const currentActivity = ref('001');
const clockNow = ref(Date.now());
const selectedActivity = computed(() => activities.find(item => item.id === currentActivity.value) || activities[0]);
const countdownLabel = computed(() =>
    clockNow.value >= selectedActivity.value.endTime
        ? '活动已结束'
        : clockNow.value < selectedActivity.value.startTime
          ? '距离活动开始'
          : '距离活动结束'
);
const remainingSeconds = computed(() => {
    const target =
        clockNow.value < selectedActivity.value.startTime
            ? selectedActivity.value.startTime
            : selectedActivity.value.endTime;
    return Math.max(0, Math.ceil((target - clockNow.value) / 1000));
});
const feedback = ref('');
const couponActionAvailable = ref(false);
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

function selectActivity(item: { id: string | number; name?: string }) {
    currentActivity.value = String(item.id);
    clockNow.value = Date.now();
    feedback.value = `${text('已切换活动场次')}: ${item.name || ''}`;
}
function onCountdownEnd() {
    clockNow.value = Date.now();
}
function selectGoods(item: { name?: string; goodsName?: string }) {
    feedback.value = `${text('已选择商品')}: ${item.goodsName || item.name || ''}`;
}
function onCouponReceived() {
    feedback.value = text('优惠券已领取');
    couponActionAvailable.value = true;
}
function onCouponError() {
    feedback.value = text('领取失败，请重试');
    couponActionAvailable.value = true;
}
function resetCoupon() {
    couponDemo.reset();
    couponKey.value += 1;
    feedback.value = '';
    couponActionAvailable.value = false;
}
</script>

<style lang="scss" scoped>
.showcase {
    overflow: hidden;
    border: 1px solid var(--snake-color-divider);
    border-radius: 12px;
    background: var(--snake-color-surface);
}
.showcase__hero {
    position: relative;
    overflow: hidden;
    padding: 25px 18px 27px;
    color: #effff8;
    background: linear-gradient(120deg, var(--snake-color-primary-deeper), var(--snake-color-primary-deep));
}
.showcase__hero::after {
    content: '';
    position: absolute;
    width: 115px;
    height: 115px;
    right: -25px;
    top: -35px;
    border: 1px solid rgba(255, 255, 255, 0.28);
    border-radius: 16px;
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
    font-size: 10px;
    letter-spacing: 1.5px;
    opacity: 0.72;
}
.showcase__title {
    margin-top: 7px;
    font-size: 21px;
    font-weight: 740;
}
.showcase__summary {
    max-width: 260px;
    margin-top: 6px;
    font-size: 12px;
    line-height: 1.55;
    opacity: 0.82;
}
.showcase__section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 13px 12px 8px;
    color: var(--snake-color-text);
    font-size: 14px;
    font-weight: 680;
}
.showcase__section text:last-child {
    color: var(--snake-color-text-muted);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 1px;
}
.showcase__countdown {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    margin: 11px 12px;
    padding: 11px;
    border-radius: 7px;
    background: var(--snake-color-primary-light);
    color: var(--snake-color-primary-deep);
    font-size: 11.5px;
}
.showcase__feedback {
    display: block;
    margin: 8px 12px 12px;
    color: var(--snake-color-primary-deep);
    font-size: 11px;
}
.showcase__reset {
    margin: 8px 12px;
}
.showcase--compact .showcase__hero {
    padding: 17px 14px;
}
.showcase--compact .showcase__title {
    font-size: 17px;
}
.showcase--compact .showcase__summary {
    font-size: 11px;
}
</style>
