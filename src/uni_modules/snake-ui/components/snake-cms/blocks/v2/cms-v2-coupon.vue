<template>
    <snake-coupon
        :datas="legacyData"
        :coupon-service="couponService"
        :link-service="linkService"
        :page-info="pageInfo"
        @error="$emit('error', $event)"
        @received="$emit('received')"
    />
</template>
<script setup lang="ts">
/** @component CmsV2Coupon @description CMS v2 优惠券协议内部渲染器。 @see /cms/overview */
import { computed } from 'vue';
import Coupon from '../../../snake-coupon/snake-coupon.vue';
import type { CmsCouponService, CmsError, CmsLinkService, CmsPageInfo } from '../../../../libs/cms';
import { v2CouponLegacyData } from './shared';
const props = defineProps<{
    data: Record<string, any>;
    couponService?: CmsCouponService;
    linkService?: CmsLinkService;
    pageInfo?: CmsPageInfo;
}>();
defineEmits<{ error: [error: CmsError]; received: [] }>();
const legacyData = computed(() => v2CouponLegacyData(props.data));
</script>
