<template>
    <text
        class="snake-link"
        :style="{
            color: color,
            fontSize: `${fontSize}rpx`,
            borderBottom: underLine ? `1px solid ${lineColor || color}` : 'none',
            paddingBottom: underLine ? '0rpx' : '0'
        }"
        @click.stop="openLink"
    >
        <slot>{{ text }}</slot>
    </text>
</template>

<script setup lang="ts">
/**
 * @component Link
 * @description 超链接，不同平台有不同表现形式：App 通过内置浏览器打开，小程序复制链接到粘贴板并提示，H5 使用 window.open。
 * @see /components/link
 */

import { computed } from 'vue';
import { toast } from '../../libs/function/toast';
import { useLocale } from '../../libs/hooks/useLocale';
import { linkProps, type LinkEmits } from './types';

defineOptions({ name: 'SnakeLink', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = defineProps(linkProps);
const emit = defineEmits<LinkEmits>();
const { t } = useLocale('link');

const mpTipsValue = computed(() => props.mpTips || t('mpTips'));

/** 打开链接，不同平台有不同表现形式。 */
function openLink() {
    if (!props.defaultClick) {
        emit('click', props.href);
        return;
    }
    // #ifdef APP-PLUS
    if (typeof plus !== 'undefined' && plus.runtime) {
        plus.runtime.openURL(props.href);
    }
    // #endif
    // #ifdef H5
    if (typeof window !== 'undefined') {
        window.open(props.href);
    }
    // #endif
    // #ifdef MP
    if (typeof uni !== 'undefined' && uni.setClipboardData) {
        uni.setClipboardData({
            data: props.href,
            success: () => {
                uni.hideToast();
                toast(mpTipsValue.value);
            }
        });
    }
    // #endif
}
</script>

<style scoped>
.snake-link {
    line-height: 1;
}
</style>
