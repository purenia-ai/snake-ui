<script setup lang="ts">
/**
 * @component SnakeDropMenuItem
 * @description 提供菜单触发器、遮罩和内容面板，必须作为 `DropMenu` 的直接子组件使用。可通过 options 快速生成选项，也可完全自定义内容。
 * @see /components/drop-menu
 */

import { computed, inject, onBeforeUnmount, watch, type CSSProperties } from 'vue';
import zIndex from '../../libs/config/zIndex';
import { addUnit } from '../../libs/function/unit';
import { snakeDropMenuKey } from '../../libs/internal/drop-menu';
import SnakeIcon from '../snake-icon/snake-icon.vue';
import SnakeTransition from '../snake-transition/snake-transition.vue';
import type { SnakeDropMenuItemEmits, SnakeDropMenuItemProps } from './types';

defineOptions({ name: 'SnakeDropMenuItem', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<SnakeDropMenuItemProps>(), {
    title: '',
    options: () => [],
    disabled: false,
    height: 'auto',
    beforeToggle: undefined,
    customStyle: ''
});
const emit = defineEmits<SnakeDropMenuItemEmits>();
const menu = inject(snakeDropMenuKey);
const itemId = Symbol('snake-drop-menu-item');
const itemIndex = menu?.register(itemId) ?? -1;
const isOpen = computed(() => menu?.activeItem.value === itemId || props.show === true);
const selected = computed(() => props.options.find(option => option.value === props.modelValue));
const displayTitle = computed(() => props.title || selected.value?.label || '请选择');
const color = computed(() =>
    isOpen.value || menu?.highlighted.value === itemIndex ? menu?.activeColor.value : menu?.inactiveColor.value
);
const panelStyle = computed(() => [
    ({
        // 面板定位/底色直接内联，避免依赖跨组件 scoped class（custom-class 应用在
        // snake-transition 根节点上，而 scoped 样式带的是本组件 data-v，选择器匹配不上）。
        position: 'fixed',
        top: `${menu?.menuTop.value || 0}px`,
        left: 0,
        right: 0,
        zIndex: (menu?.zIndex.value || zIndex.dropdown) + 1,
        maxHeight: props.height === 'auto' ? '70vh' : addUnit(props.height, 'rpx'),
        boxSizing: 'border-box',
        overflow: 'hidden',
        background: 'var(--snake-color-surface, #fff)',
        boxShadow: '0 18rpx 48rpx var(--snake-color-shadow, rgba(15, 30, 24, 0.12))'
    } as CSSProperties),
    props.customStyle
]);
function requestOpen() {
    if (!props.beforeToggle) return Promise.resolve(true);
    return new Promise<boolean>(resolve => props.beforeToggle?.({ resolve }));
}
async function toggle() {
    if (!menu || props.disabled) return;
    if (isOpen.value) {
        if (menu.closeOnClickSelf.value) menu.close();
        return;
    }
    if (await requestOpen()) {
        await menu.updateRect();
        menu.open(itemId);
        emit('open');
    }
}
function close() {
    menu?.close();
}
function maskClick() {
    if (menu?.closeOnClickMask.value) close();
}
function select(value: unknown, disabled?: boolean) {
    if (disabled) return;
    emit('update:modelValue', value);
    emit('change', value);
    close();
}
watch(isOpen, (value, previous) => {
    if (previous && !value) emit('close');
});
onBeforeUnmount(() => menu?.unregister(itemId));
</script>

<template>
    <view class="snake-drop-item">
        <view
            class="snake-drop-item__trigger"
            :style="{ color, fontSize: addUnit(menu?.titleSize.value || 28, 'rpx') }"
            @click="toggle"
        >
            <text class="snake-drop-item__title">{{ displayTitle }}</text
            ><snake-icon
                class="snake-drop-item__arrow"
                :name="isOpen ? 'arrow-up' : 'arrow-down'"
                :size="menu?.menuIconSize.value || 18"
                aria-hidden="true"
            />
        </view>
        <view
            v-if="isOpen"
            class="snake-drop-item__mask"
            :style="{ top: `${menu?.menuTop.value || 0}px`, zIndex: menu?.zIndex.value || zIndex.dropdown }"
            @click="maskClick"
        />
        <snake-transition
            :show="isOpen"
            name="fade-down"
            :duration="menu?.duration.value || 300"
            custom-class="snake-drop-item__panel"
            :custom-style="panelStyle"
        >
            <slot v-if="$slots.default" />
            <scroll-view v-else class="snake-drop-item__options" scroll-y>
                <view
                    v-for="(option, index) in options"
                    :key="index"
                    class="snake-drop-item__option"
                    :class="{ 'is-active': option.value === modelValue, 'is-disabled': option.disabled }"
                    @click="select(option.value, option.disabled)"
                    ><text>{{ option.label }}</text
                    ><snake-icon v-if="option.value === modelValue" name="checkmark"
                /></view>
            </scroll-view>
        </snake-transition>
    </view>
</template>

<style scoped>
.snake-drop-item {
    flex: 1;
    min-width: 0;
}
.snake-drop-item__trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    width: 100%;
    height: 100%;
    padding: 0 12rpx;
    line-height: 1;
}
.snake-drop-item__title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.snake-drop-item__arrow {
    flex: none;
    line-height: 1;
}
.snake-drop-item__mask {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.45);
}
/* 面板定位/底色已内联在 panelStyle（跨组件 custom-class 无法命中 scoped 选择器） */
.snake-drop-item__options {
    max-height: 70vh;
}
.snake-drop-item__option {
    display: flex;
    min-height: 88rpx;
    align-items: center;
    justify-content: space-between;
    padding: 0 32rpx;
    border-bottom: 1px solid var(--snake-color-divider, #e4e7ed);
    color: var(--snake-color-text-secondary, #606266);
}
.snake-drop-item__option.is-active {
    color: var(--snake-color-primary, #06d290);
}
.snake-drop-item__option.is-disabled {
    opacity: 0.45;
}
</style>
