<template>
    <view class="page-popup">
        <snake-popup
            v-model="show"
            border-radius="10rpx"
            :mode="datas.popupMode"
            :bg-color="datas.popupMode === 'bottom' ? 'var(--snake-color-surface, #fff)' : 'transparent'"
        >
            <view class="popup-container">
                <view :class="[`page-popup-popup page-popup-popup--${datas.popupMode}`]">
                    <view
                        :class="[`close close--${datas.popupMode}`]"
                        @click.stop="show = false"
                        v-if="datas.popupMode === 'bottom'"
                    >
                        <snake-icon name="close" color="var(--snake-color-text, #26273a)" size="18"></snake-icon>
                    </view>
                    <image
                        class="page-popup-img"
                        mode="aspectFill"
                        :src="datas.image"
                        @click.stop="handleToPage"
                    ></image>
                </view>
                <view
                    :class="[`close close--${datas.popupMode}`]"
                    @click.stop="show = false"
                    v-if="datas.popupMode === 'center'"
                >
                    <snake-icon name="close-circle-fill" color="#fff" size="28"></snake-icon>
                </view>
            </view>
        </snake-popup>
    </view>
</template>

<script setup lang="ts">
/**
 * @component PagePopup
 * @description 页面进入后立即展示居中或底部图片弹窗，并支持图片跳转。
 */

import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { PagePopupProps } from './types';

defineOptions({ name: 'PagePopup', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<PagePopupProps>(), {
    datas: () => ({}),
    autoOpen: true
});
const show = ref(props.autoOpen);

watch(show, visible => {
    if (props.datas.popupMode !== 'bottom') return;
    if (visible) {
        uni.hideTabBar({ animation: true });
    } else {
        uni.$snake.sleep(300).then(() => {
            if (!show.value || props.datas.popupMode !== 'bottom') uni.showTabBar({ animation: true });
        });
    }
});

watch(
    () => props.datas.popupMode,
    (mode, previousMode) => {
        if (!show.value) return;
        if (mode === 'bottom') uni.hideTabBar({ animation: true });
        else if (previousMode === 'bottom') uni.showTabBar({ animation: true });
    }
);

onMounted(() => {
    if (show.value && props.datas.popupMode === 'bottom') {
        uni.hideTabBar({ animation: true });
    }
});

onBeforeUnmount(() => {
    if (show.value && props.datas.popupMode === 'bottom') uni.showTabBar({ animation: true });
});

function open() {
    show.value = true;
}

function close() {
    show.value = false;
}

defineExpose({ open, close });

function handleToPage() {
    if (props.datas.url) uni.$snake.navTo(props.datas.url);
}
</script>

<style lang="scss" scoped>
.page-popup {
    width: 100%;
    height: 100%;
}

.popup-container {
    position: relative;
    width: 100%;
    height: 100%;

    .page-popup-popup {
        box-sizing: border-box;
        width: 100%;
        height: 572rpx;

        &--center {
            width: 540rpx;
            height: 740rpx;

            .page-popup-img {
                height: 740rpx !important;
            }
        }

        .page-popup-img {
            display: block;
            width: 100%;
            height: 524rpx;
            border-radius: 6rpx;
        }
    }

    .close {
        display: flex;
        justify-content: flex-end;
        padding-top: 16rpx;
        padding-right: 16rpx;

        &--center {
            position: absolute;
            bottom: -100rpx;
            left: 50%;
            transform: translateX(-50%);
        }
    }
}
</style>
