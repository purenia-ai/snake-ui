<template>
    <view>
        <view
            class="snake-read-more__content"
            :class="[elId, customClass]"
            :style="[
                {
                    height: isLongContent && !showMore ? `${showHeight}rpx` : 'auto',
                    textIndent: textIndent
                },
                customStyle
            ]"
        >
            <slot />
        </view>
        <view
            v-if="isLongContent"
            class="snake-read-more__toggle"
            :class="{ 'snake-read-more__toggle--open': showMore }"
            :style="[innerShadowStyle]"
            @click="toggleReadMore"
        >
            <text
                class="snake-read-more__toggle__btn"
                :style="{
                    fontSize: `${fontSize}rpx`,
                    color: color
                }"
            >
                {{ showMore ? openTextValue : closeTextValue }}
            </text>
            <view class="snake-read-more__toggle__btn__icon">
                <snake-icon :color="color" :size="fontSize" :name="showMore ? 'arrow-up' : 'arrow-down'" />
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component ReadMore
 * @description 阅读更多，用于内容较长时预先收起一部分、点击展开全部内容的场景，支持自定义提示与阴影。
 * @see /components/read-more
 */

import { computed, getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue';
import { guid } from '../../libs/function/guid';
import { getRect } from '../../libs/function/getRect';
import { useLocale } from '../../libs/hooks/useLocale';
import Icon from '../snake-icon/snake-icon.vue';
import { readMoreProps, type ReadMoreEmits, type ReadMoreExpose } from './types';

defineOptions({ name: 'ReadMore', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = defineProps(readMoreProps);
const emit = defineEmits<ReadMoreEmits>();
const { t } = useLocale('readMore');

// 是否需要隐藏一部分内容
const isLongContent = ref(false);
// 当前隐藏与显示的状态，true 显示，false 收起
const showMore = ref(false);
// 生成唯一 class 用于测量内容高度
const elId = ref('');
const instance = getCurrentInstance();

// 展开后无需阴影，收起时才需要阴影样式
const innerShadowStyle = computed(() => (showMore.value ? {} : props.shadowStyle));

const openTextValue = computed(() => props.openText || t('openText'));
const closeTextValue = computed(() => props.closeText || t('closeText'));

// 监听 toggle 和 showHeight 变化，重新初始化
watch(
    () => `${props.toggle}-${props.showHeight}`,
    () => {
        init();
    }
);

onMounted(() => {
    elId.value = guid();
    nextTick(() => {
        init();
    });
});

/** 初始化内容高度判断，决定是否显示展开/收起按钮。 */
function init() {
    getRect(`.${elId.value}`, instance).then(rect => {
        // 真实内容高度大于占位高度时，显示收起与展开的控制按钮
        if (rect.height > uni.upx2px(Number(props.showHeight))) {
            isLongContent.value = true;
            showMore.value = false;
        }
    });
}

defineExpose<ReadMoreExpose>({ init });

/** 展开或收起内容，发出 open/close 事件。 */
function toggleReadMore() {
    showMore.value = !showMore.value;
    // toggle 为 false 时，隐藏收起部分的内容
    if (props.toggle === false) isLongContent.value = false;
    if (showMore.value) emit('open', props.index);
    else emit('close', props.index);
}
</script>

<style scoped>
.snake-read-more__content {
    overflow: hidden;
    font-size: 30rpx;
    color: var(--snake-color-text-secondary, #606266);
    line-height: 1.8;
    text-align: left;
}
.snake-read-more__toggle {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding-bottom: 26rpx;
}
.snake-read-more__toggle--open {
    padding-top: 0;
    margin-top: 20rpx;
    background: none;
}
.snake-read-more__toggle__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}
.snake-read-more__toggle__btn__icon {
    margin-left: 14rpx;
}
</style>
