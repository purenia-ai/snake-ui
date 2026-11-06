<template>
    <snake-transition
        :show="isOpen"
        name="fade-down"
        :duration="menu?.duration.value || 300"
        custom-class="snake-drop-item__panel"
        :custom-style="panelStyle"
        @after-enter="emit('opened')"
        @after-leave="emit('closed')"
    >
        <slot v-if="$slots.default" />
        <scroll-view v-else class="snake-drop-item__options" scroll-y>
            <view
                v-for="(option, index) in options"
                :key="index"
                class="snake-drop-item__option"
                :class="{ 'is-active': option.value === modelValue, 'is-disabled': option.disabled }"
                @click="select(option.value, option.disabled)"
            >
                <text>{{ option.label }}</text>
                <snake-icon v-if="option.value === modelValue" name="checkmark" />
            </view>
        </scroll-view>
    </snake-transition>
</template>

<script setup lang="ts">
/**
 * @component DropMenuItem
 * @description 下拉菜单的内容面板，必须作为 `DropMenu` 的直接子组件使用；标题栏由 `DropMenu` 统一渲染。可通过 options 快速生成选项，也可完全自定义内容。
 * @see /components/drop-menu
 */

import { computed, inject, onBeforeUnmount, watch, type CSSProperties } from 'vue';
import zIndex from '../../libs/config/zIndex';
import { addUnit } from '../../libs/function/unit';
import { dropMenuKey } from '../snake-drop-menu/types';
import type { DropMenuItemEmits, DropMenuItemProps } from './types';

defineOptions({ name: 'DropMenuItem', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<DropMenuItemProps>(), {
    title: '',
    options: () => [],
    disabled: false,
    height: 'auto',
    show: true,
    beforeToggle: undefined,
    customStyle: ''
});
const emit = defineEmits<DropMenuItemEmits>();
const menu = inject(dropMenuKey);
const itemId = Symbol('snake-drop-menu-item');
menu?.register(itemId, props);
const isOpen = computed(() => menu?.activeItem.value === itemId);
const panelStyle = computed(() => [
    {
        // 面板定位/底色直接内联：custom-class 应用在 snake-transition 根节点上，
        // 而 scoped 样式带的是本组件 data-v，选择器匹配不上；top 加 --window-top
        // 补偿 H5 导航栏（测量值不含该高度），带 0px 回退保证小程序端 calc 合法。
        position: 'fixed',
        top: `calc(var(--window-top, 0px) + ${menu?.offset.value || 0}px)`,
        left: 0,
        right: 0,
        zIndex: (menu?.zIndex.value || zIndex.dropdown) + 1,
        maxHeight: props.height === 'auto' ? '70vh' : addUnit(props.height),
        boxSizing: 'border-box',
        overflow: 'hidden',
        background: 'var(--snake-color-surface, #fff)',
        boxShadow: '0 9px 24px var(--snake-color-shadow, rgba(15, 30, 24, 0.12))'
    } as CSSProperties,
    props.customStyle
]);
function select(value: unknown, disabled?: boolean) {
    if (disabled) return;
    emit('update:modelValue', value);
    emit('change', value);
    menu?.close();
}
watch(isOpen, (value, previous) => {
    if (value && !previous) emit('open');
    else if (!value && previous) emit('close');
});
onBeforeUnmount(() => menu?.unregister(itemId));
</script>

<style scoped>
/* 面板定位/底色已内联在 panelStyle（跨组件 custom-class 无法命中 scoped 选择器） */
.snake-drop-item__options {
    max-height: 70vh;
}
.snake-drop-item__option {
    display: flex;
    min-height: 44px;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
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
