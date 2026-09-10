<script setup lang="ts">
/**
 * @component DropMenu
 * @description 负责多个 `DropMenuItem` 的布局、互斥展开和弹层定位。面板打开前会真实测量菜单底部位置，适用于普通布局和吸顶布局。
 * @see /components/drop-menu
 */

import { getCurrentInstance, onMounted, provide, ref, toRef, watch } from 'vue';
import zIndex from '../../libs/config/zIndex';
import { addUnit } from '../../libs/function/unit';
import { dropMenuKey } from '../../libs/internal/drop-menu';
import type { DropMenuEmits, DropMenuExpose, DropMenuProps } from './types';

defineOptions({ name: 'DropMenu', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<DropMenuProps>(), {
    activeColor: 'var(--snake-color-primary, #06D290)',
    inactiveColor: 'var(--snake-color-text-secondary, #606266)',
    closeOnClickMask: true,
    closeOnClickSelf: true,
    duration: 300,
    height: 40,
    borderBottom: false,
    titleSize: 28,
    menuIcon: 'down',
    menuIconSize: 18,
    zIndex: zIndex.dropdown,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<DropMenuEmits>();
const instance = getCurrentInstance();
const activeItem = ref<symbol | null>(null);
const highlighted = ref<number>();
const menuTop = ref(0);
const items: symbol[] = [];
function register(item: symbol) {
    if (!items.includes(item)) items.push(item);
    return items.indexOf(item);
}
function unregister(item: symbol) {
    const index = items.indexOf(item);
    if (index >= 0) items.splice(index, 1);
    if (activeItem.value === item) activeItem.value = null;
}
const indexOf = (item: symbol) => items.indexOf(item);
function openItem(item: symbol) {
    activeItem.value = item;
}
function close() {
    activeItem.value = null;
}
function open(index: number) {
    if (items[index]) openItem(items[index]);
}
function highlight(index?: number) {
    highlighted.value = index;
}
async function updateDropMenuRect() {
    if (typeof uni === 'undefined') return;
    await new Promise<void>(resolve => {
        uni.createSelectorQuery()
            .in(instance?.proxy as any)
            .select('.snake-drop-menu')
            .boundingClientRect((rect: any) => {
                if (rect) menuTop.value = Number(rect.bottom) || 0;
            })
            .exec(() => resolve());
    });
}
function colseAll() {
    close();
}
watch(activeItem, (value, previous) => {
    if (previous) emit('close', indexOf(previous));
    if (value) {
        void updateDropMenuRect();
        emit('open', indexOf(value));
    }
});
provide(dropMenuKey, {
    activeItem,
    highlighted,
    menuTop,
    activeColor: toRef(props, 'activeColor'),
    inactiveColor: toRef(props, 'inactiveColor'),
    titleSize: toRef(props, 'titleSize'),
    menuIcon: toRef(props, 'menuIcon'),
    menuIconSize: toRef(props, 'menuIconSize'),
    duration: toRef(props, 'duration'),
    closeOnClickMask: toRef(props, 'closeOnClickMask'),
    closeOnClickSelf: toRef(props, 'closeOnClickSelf'),
    zIndex: toRef(props, 'zIndex'),
    register,
    unregister,
    indexOf,
    open: openItem,
    close,
    updateRect: updateDropMenuRect
});
onMounted(() => void updateDropMenuRect());
defineExpose<DropMenuExpose>({ updateDropMenuRect, colseAll, close, open, highlight });
</script>

<template>
    <view
        class="snake-drop-menu"
        :class="[customClass, { 'snake-drop-menu--border': borderBottom }]"
        :style="[{ height: addUnit(height, 'px'), zIndex: props.zIndex }, customStyle]"
        ><slot
    /></view>
</template>
<style scoped>
.snake-drop-menu {
    position: relative;
    display: flex;
    width: 100%;
    background: var(--snake-color-surface, #fff);
}
.snake-drop-menu--border {
    border-bottom: 1px solid var(--snake-color-divider, #e4e7ed);
}
</style>
