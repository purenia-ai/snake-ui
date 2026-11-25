<template>
    <view v-if="!isHidden" class="snake-avatar" :class="rootClass" :style="rootStyle" @click="onClick">
        <slot v-if="hasDefaultSlot" />
        <image v-else-if="showImage" class="snake-avatar__img" :src="src" :mode="fit" @error="onError" />
        <text v-else-if="showText" class="snake-avatar__text">{{ text }}</text>
        <SnakeIcon
            v-else
            :name="iconName"
            :size="iconSize"
            :color="resolvedColor"
            :margin-left="0"
            :margin-top="0"
            :margin-right="0"
            :margin-bottom="0"
        />
    </view>
</template>

<script setup lang="ts">
/**
 * @component Avatar
 * @description 头像：图片、文字、图标与插槽四种形态按固定优先级回退，图片失败自动降级，
 * 放进 `snake-avatar-group` 时参与叠层与折叠。
 * @see /components/avatar
 */
import { computed, ref, useSlots, watch } from 'vue';
import { addUnit, unitToPx } from '../../libs/function/unit';
import { useParent } from '../../libs/hooks';
import SnakeIcon from '../snake-icon/snake-icon.vue';
import { AVATAR_GROUP_KEY } from '../snake-avatar-group/types';
import { avatarProps, type AvatarEmits, type AvatarShape } from './types';

defineOptions({ name: 'SnakeAvatar', options: { virtualHost: true, styleIsolation: 'shared' } });

/** 既没传尺寸也没有头像组时的兜底尺寸。 */
const DEFAULT_SIZE = 40;
/** 无图片、无文字、无自定义图标时的内置占位图标。 */
const BUILT_IN_ICON = 'account';

const props = defineProps(avatarProps);
const emit = defineEmits<AvatarEmits>();
const slots = useSlots();

// 父子关系：头像组在 linkChildren 时下发尺寸、形状、折叠基线与重叠距离
const { parent: avatarGroup, index } = useParent(AVATAR_GROUP_KEY);

/** 当前图片地址是否已加载失败；换地址时复位，允许重新尝试。 */
const failed = ref(false);

const resolvedSize = computed(() => props.size ?? avatarGroup.value?.props.size ?? DEFAULT_SIZE);
const resolvedShape = computed<AvatarShape>(() => props.shape ?? avatarGroup.value?.props.shape ?? 'circle');
const sizePx = computed(() => unitToPx(resolvedSize.value));
/** 字号按尺寸的 0.4 倍现算成 px：rpx 进 calc() 在小程序端不稳定，这里不做动态自适应。 */
const resolvedFontSize = computed(() => addUnit(props.fontSize ?? Math.round(sizePx.value * 0.4)));
const iconSize = computed(() => Math.max(8, Math.round(sizePx.value * 0.5)));
const resolvedColor = computed(() => props.color || 'var(--snake-color-text-muted, #909399)');
const resolvedBgColor = computed(() => props.bgColor || 'var(--snake-color-surface-muted, #f1f1f1)');

const showImage = computed(() => Boolean(props.src) && !failed.value);
const showText = computed(() => !showImage.value && Boolean(props.text));
const iconName = computed(() => props.icon || BUILT_IN_ICON);
const hasDefaultSlot = computed(() => Boolean(slots.default));

const inGroup = computed(() => avatarGroup.value !== null);
const overlap = computed(() => avatarGroup.value?.overlap.value ?? '');

/** 折叠基线下标之后的项不渲染（不是 display:none），否则负 margin 与计数都会失真。 */
const isHidden = computed(() => {
    const group = avatarGroup.value;
    return group ? index.value >= group.visibleCount.value : false;
});

/** 叠层层级：默认后渲染的压在上面，折叠头像因此不会被邻居盖住。 */
const zIndex = computed(() => {
    const group = avatarGroup.value;
    if (!group) return 0;
    return group.props.cascading === 'first-on-top'
        ? Math.max(0, group.visibleCount.value - index.value)
        : index.value + 1;
});

const rootStyle = computed(() => {
    const style: Record<string, string> = {
        width: addUnit(resolvedSize.value),
        height: addUnit(resolvedSize.value),
        borderRadius: resolvedShape.value === 'circle' ? '50%' : addUnit(props.radius),
        backgroundColor: resolvedBgColor.value,
        color: resolvedColor.value,
        fontSize: resolvedFontSize.value
    };
    if (inGroup.value) {
        // 白环让重叠处能分离；负 margin 由子项自己算，不依赖跨组件选择器
        style.boxShadow =
            '0 0 0 var(--snake-avatar-ring-width, 2px) var(--snake-avatar-ring-color, var(--snake-color-surface))';
        style.zIndex = String(zIndex.value);
        if (index.value > 0 && overlap.value) style.marginLeft = `-${overlap.value}`;
    }
    return [style, props.customStyle];
});

const rootClass = computed(() => [
    `snake-avatar--${resolvedShape.value}`,
    { 'snake-avatar--group': inGroup.value },
    props.customClass
]);

function onClick() {
    emit('click');
}

function onError(event: unknown) {
    // 小程序端同一地址可能重复触发 error，这里只派发一次
    if (failed.value) return;
    failed.value = true;
    emit('error', event);
}

watch(
    () => props.src,
    () => {
        failed.value = false;
    }
);
</script>

<style scoped>
.snake-avatar {
    position: relative;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    overflow: hidden;
    vertical-align: middle;
    line-height: 1;
}

.snake-avatar__img {
    display: block;
    width: 100%;
    height: 100%;
}

.snake-avatar__text {
    max-width: 100%;
    overflow: hidden;
    font-size: inherit;
    line-height: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
