<template>
    <view class="coupon" :style="$snakeThemeStyle">
        <!-- 页面显示 -->
        <view @click="handleReceiveCoupon" v-if="datas.modeType === 'page'">
            <view v-show="isCouponCheck">
                <image :src="datas.beforeImage" mode="widthFix" style="display: block; width: 100%" />
            </view>
            <view v-show="!isCouponCheck">
                <image :src="datas.afterImage" mode="widthFix" style="display: block; width: 100%" />
            </view>
        </view>
        <!-- 弹窗显示 -->
        <template v-if="datas.modeType === 'popup'">
            <snake-popup
                v-model="show"
                :mode="datas.popupMode"
                :bg-color="datas.popupMode === 'bottom' ? 'var(--snake-color-surface, #fff)' : 'transparent'"
            >
                <view class="popup-container">
                    <view :class="[`coupon-popup coupon-popup--${datas.popupMode}`]">
                        <view
                            :class="[`close close--${datas.popupMode}`]"
                            @click.stop="show = false"
                            v-if="!datas.popupMode || datas.popupMode === 'bottom'"
                        >
                            <snake-icon name="close2" color="var(--snake-color-text, #26273a)" size="18"></snake-icon>
                        </view>
                        <image
                            class="coupon-img"
                            mode="aspectFill"
                            :src="datas.beforeImage"
                            @click.stop="handleReceiveCoupon"
                        ></image>
                    </view>
                    <view
                        :class="[`close close--${datas.popupMode}`]"
                        @click.stop="show = false"
                        v-if="datas.popupMode === 'center'"
                    >
                        <snake-icon name="close2" color="#fff" size="28"></snake-icon>
                    </view>
                </view>
            </snake-popup>
        </template>
    </view>
</template>

<script setup lang="ts">
/**
 * @component SnakeCoupon
 * @description 检查领取资格，以页面图片或弹窗形式展示优惠券，并在领取后执行内部或外部跳转。
 * @see /components/coupon
 */

import { computed, onMounted, ref, watch } from 'vue';
import { resolveSnakeCmsOptions } from '../../libs/cms';
import { sleep, toast } from '../../libs/function/platform';
import {
    SnakeCmsError,
} from '../snake-cms/types';
import type { SnakeCouponEmits, SnakeCouponProps } from './types';

defineOptions({ name: 'SnakeCoupon', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(
    defineProps<SnakeCouponProps>(),
    { datas: () => ({}), couponService: undefined, linkService: undefined, pageInfo: () => ({}) }
);
const emit = defineEmits<SnakeCouponEmits>();
const resolved = computed(() => resolveSnakeCmsOptions());
const couponService = computed(() => props.couponService || resolved.value.services?.coupon);
const linkService = computed(() => props.linkService || resolved.value.services?.link);
const isCouponCheck = ref(true);
const tipMessage = ref('');
const show = ref(false);

watch(show, value => {
    if (!value && props.datas.modeType === 'popup' && props.datas.popupMode === 'bottom') {
        sleep(300).then(() => uni.showTabBar({ animation: true }));
    }
});

async function getCouponCheck(): Promise<void> {
    if (!couponService.value) return;
    try {
        const result = await couponService.value.check({ config: props.datas, pageInfo: props.pageInfo });
        isCouponCheck.value = result.claimable;
        tipMessage.value = result.message || '';
        if (props.datas.modeType === 'popup' && result.claimable) {
            await sleep(30);
            show.value = true;
        }
    } catch (cause) {
        emit('error', new SnakeCmsError('coupon', '优惠券状态加载失败', cause));
    }
}

async function openAfterAction(): Promise<void> {
    if (!props.datas.afterUrl) return;
    if (!linkService.value) {
        toast('未配置 CMS 跳转服务');
        return;
    }
    await linkService.value.open(
        { type: props.datas.type === '10' ? 'navigate' : 'external', url: props.datas.afterUrl },
        { pageInfo: props.pageInfo }
    );
}

async function handleReceiveCoupon(): Promise<void> {
    if (!isCouponCheck.value) {
        toast(tipMessage.value || '您已经领取过啦');
        await openAfterAction();
        return;
    }
    if (!couponService.value) {
        const error = new SnakeCmsError('coupon', '未配置 CMS 优惠券服务');
        emit('error', error);
        toast(error.message);
        return;
    }
    try {
        const result = await couponService.value.receive({ config: props.datas, pageInfo: props.pageInfo });
        if (!result.success) {
            toast(result.message || '领取失败');
            await getCouponCheck();
            return;
        }
        isCouponCheck.value = false;
        show.value = false;
        toast(result.message || '领取成功');
        emit('received');
        await sleep(1000);
        await openAfterAction();
    } catch (cause) {
        const error = new SnakeCmsError('coupon', '优惠券领取失败', cause);
        emit('error', error);
        toast(error.message);
    }
}

onMounted(() => {
    void getCouponCheck();
    if (props.datas.modeType === 'popup' && props.datas.popupMode === 'bottom') {
        uni.hideTabBar({ animation: true });
    }
});
</script>

<style lang="scss" scoped>
.coupon {
    width: 100%;
    height: 100%;
}

.popup-container {
    width: 100%;
    height: 100%;

    .coupon-popup {
        box-sizing: border-box;
        width: 100%;
        height: 572rpx;
        background-color: var(--snake-color-surface, #fff);

        &--center {
            width: 540rpx;
            height: 740rpx;
            background: var(--snake-color-surface, #fff);

            .coupon-img {
                height: 740rpx !important;
            }
        }

        .coupon-img {
            display: block;
            width: 100%;
            height: 524rpx;
        }
    }

    .close {
        display: flex;
        justify-content: flex-end;
        padding-top: 16rpx;
        padding-right: 16rpx;

        &--center {
            display: flex;
            justify-content: center;
            margin-top: 70rpx;
        }
    }
}
</style>
