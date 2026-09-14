<script setup lang="ts">
/**
 * @component Loadmore
 * @description 用于列表底部反馈分页状态。组件不直接请求数据，点击可加载状态时会派发 `loadmore`，由业务更新 `status`。
 * @see /components/loadmore
 */

import { computed } from 'vue';
import { addUnit } from '../../libs/function/unit';
import { translate } from '../../locale';
import Loading from '../snake-loading/snake-loading.vue';
import SnakeLine from '../snake-line/snake-line.vue';
import type { LoadmoreEmits, LoadmoreProps } from './types';

defineOptions({ name: 'Loadmore', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<LoadmoreProps>(), {
    status: 'loadmore',
    loadText: '',
    loadingText: '',
    nomoreText: '',
    bgColor: 'transparent',
    icon: true,
    iconType: 'circle',
    iconColor: 'var(--snake-color-text-light, #c0c4cc)',
    isDot: false,
    color: 'var(--snake-color-text-secondary, #606266)',
    fontSize: 28,
    marginTop: 0,
    marginBottom: 0,
    height: 'auto',
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<LoadmoreEmits>();
const labels = computed(() => (typeof props.loadText === 'object' ? props.loadText : {}));
const label = computed(() => {
    if (props.status === 'loading') return props.loadingText || labels.value.loading || translate('common.loading');
    if (props.status === 'nomore') return props.isDot ? '●' : props.nomoreText || labels.value.nomore || translate('common.noMore');
    return (typeof props.loadText === 'string' ? props.loadText : labels.value.loadmore) || translate('common.loadMore');
});
const rootStyle = computed(() => [
    {
        backgroundColor: props.bgColor,
        color: props.color,
        fontSize: addUnit(props.fontSize, 'rpx'),
        marginTop: addUnit(props.marginTop, 'rpx'),
        marginBottom: addUnit(props.marginBottom, 'rpx'),
        height: props.height === 'auto' ? 'auto' : addUnit(props.height, 'rpx')
    },
    props.customStyle
]);
function click() {
    emit('click', props.status);
    if (props.status === 'loadmore') emit('loadmore');
}
</script>

<template>
    <view class="snake-loadmore" :class="customClass" :style="rootStyle" @click="click">
        <SnakeLine class="snake-loadmore__line" length="50%" />
        <view class="snake-loadmore__content">
            <Loading
                v-if="status === 'loading' && icon"
                :type="iconType === 'flower' ? 'spinner' : iconType === 'circle' ? 'circular' : 'spinner'"
                :color="iconColor"
                size="34" />
            <text class="snake-loadmore__text">{{ label }}</text>
        </view>
        <SnakeLine class="snake-loadmore__line" length="50%" />
    </view>
</template>

<style scoped>
.snake-loadmore {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80rpx;
    gap: 12rpx;
    padding: 12rpx 24rpx;
    line-height: 1.5;
}
.snake-loadmore__line {
    min-width: 0;
    flex: 1;
}
.snake-loadmore__content {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    padding: 0 12rpx;
}
.snake-loadmore__text {
    color: inherit;
    font-size: inherit;
}
</style>
