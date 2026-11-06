<template>
    <view
        class="snake-drop-menu"
        :class="[customClass, { 'snake-drop-menu--border': borderBottom }]"
        :style="[{ height: addUnit(height, 'px'), zIndex: props.zIndex }, customStyle]"
    >
        <snake-overlay
            :show="overlayShow"
            :duration="duration"
            :z-index="props.zIndex"
            :opacity="0.45"
            :lock-scroll="true"
            :custom-style="overlayStyle"
            @click="overlayClick"
        />
        <view class="snake-drop-menu__bar">
            <view
                v-for="(item, index) in visibleItems"
                :key="item.id"
                class="snake-drop-menu__trigger"
                :class="{ 'is-active': isActive(index), 'is-disabled': item.props.disabled }"
                :style="{ color: triggerColor(index) }"
                @click="triggerClick(index)"
            >
                <text class="snake-drop-menu__title" :style="{ fontSize: addUnit(titleSize) }">
                    {{ displayTitle(item) }}
                </text>
                <snake-icon
                    class="snake-drop-menu__arrow"
                    :class="{ 'snake-drop-menu__arrow--open': isActive(index) }"
                    :name="menuIcon"
                    :size="menuIconSize"
                    :color="triggerColor(index)"
                />
            </view>
        </view>
        <slot />
    </view>
</template>

<script setup lang="ts">
/**
 * @component DropMenu
 * @description 负责渲染标题菜单栏、共享遮罩与多个 `DropMenuItem` 面板的互斥展开。标题栏和面板在打开前真实测量菜单底部位置（含 H5 导航栏补偿），适用于普通布局和吸顶布局。
 * @see /components/drop-menu
 */

import { computed, getCurrentInstance, onBeforeUnmount, provide, ref, shallowRef, toRef, watch } from 'vue';
import zIndex from '../../libs/config/zIndex';
import { addUnit } from '../../libs/function/unit';
import { dropMenuKey } from './types';
import type { DropMenuEmits, DropMenuExpose, DropMenuProps, DropMenuRegistration } from './types';
import type { DropMenuBeforeToggle, DropMenuItemProps } from '../snake-drop-menu-item/types';

defineOptions({ name: 'DropMenu', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<DropMenuProps>(), {
    activeColor: 'var(--snake-color-primary, #06D290)',
    inactiveColor: 'var(--snake-color-text-secondary, #606266)',
    closeOnClickMask: true,
    closeOnClickSelf: true,
    duration: 300,
    height: 40,
    borderBottom: false,
    titleSize: 14,
    menuIcon: 'arrow-down',
    menuIconSize: 9,
    zIndex: zIndex.dropdown,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<DropMenuEmits>();
const instance = getCurrentInstance();
const activeItem = ref<symbol | null>(null);
const highlighted = ref<number>();
const offset = ref(0);
const items = shallowRef<DropMenuRegistration[]>([]);

// 模块级展开登记：同屏多个 DropMenu 实例互斥，展开一个时收起其他（对齐 wot-ui 全局队列行为）。
const openClosers = new Set<() => void>();

/** 登记表中的可见项（show !== false），标题栏与 open/highlight 的下标均以可见项为准。 */
const visibleItems = computed(() => items.value.filter(item => item.props.show !== false));
const overlayShow = computed(() => activeItem.value !== null);
const overlayStyle = computed(() => ({
    top: `calc(var(--window-top, 0px) + ${offset.value}px)`,
    bottom: 0
}));

function register(id: symbol, itemProps: DropMenuItemProps) {
    if (items.value.some(item => item.id === id)) return;
    // shallowRef：登记表整体替换更新（深层 props 含 StyleValue 递归类型，深响应解包会触发 TS2589）
    items.value = [...items.value, { id, props: itemProps }];
}
function unregister(id: symbol) {
    items.value = items.value.filter(item => item.id !== id);
    if (activeItem.value === id) activeItem.value = null;
}
function isActive(index: number) {
    const item = visibleItems.value[index];
    return !!item && activeItem.value === item.id;
}
function displayTitle(item: DropMenuRegistration) {
    if (item.props.title) return item.props.title;
    const selected = item.props.options?.find(option => option.value === item.props.modelValue);
    return selected?.label ?? '';
}
function triggerColor(index: number) {
    const item = visibleItems.value[index];
    if (!item) return props.inactiveColor;
    if (item.props.disabled) return 'var(--snake-color-text-muted, #909399)';
    return isActive(index) || highlighted.value === index ? props.activeColor : props.inactiveColor;
}
/** resolve 回调式 beforeToggle 统一包装为 Promise。 */
function runBeforeToggle(beforeToggle?: DropMenuBeforeToggle) {
    if (!beforeToggle) return Promise.resolve(true);
    return new Promise<boolean>(resolve => beforeToggle({ resolve }));
}
async function triggerClick(index: number) {
    const item = visibleItems.value[index];
    if (!item || item.props.disabled) return;
    if (activeItem.value === item.id) {
        if (props.closeOnClickSelf) close();
        return;
    }
    if (!(await runBeforeToggle(item.props.beforeToggle))) return;
    await updateDropMenuRect();
    openItem(item);
}
function openItem(item: DropMenuRegistration) {
    openClosers.forEach(closer => closer !== closeSelf && closer());
    activeItem.value = item.id;
    openClosers.add(closeSelf);
}
function close() {
    activeItem.value = null;
}
function closeSelf() {
    if (activeItem.value !== null) activeItem.value = null;
}
function overlayClick() {
    if (props.closeOnClickMask) close();
}
async function open(index: number) {
    const item = visibleItems.value[index];
    if (!item) return;
    await updateDropMenuRect();
    openItem(item);
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
                if (rect) offset.value = Number(rect.bottom) || 0;
            })
            .exec(() => resolve());
    });
}

watch(activeItem, (value, previous) => {
    if (value === null) openClosers.delete(closeSelf);
    const previousIndex = previous ? visibleItems.value.findIndex(item => item.id === previous) : -1;
    if (previousIndex >= 0) emit('close', previousIndex);
    if (value)
        emit(
            'open',
            visibleItems.value.findIndex(item => item.id === value)
        );
});
onBeforeUnmount(() => openClosers.delete(closeSelf));

provide(dropMenuKey, {
    activeItem,
    offset,
    duration: toRef(props, 'duration'),
    zIndex: toRef(props, 'zIndex'),
    register,
    unregister,
    close
});
defineExpose<DropMenuExpose>({ updateDropMenuRect, close, open, highlight });
</script>
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
.snake-drop-menu__bar {
    display: flex;
    width: 100%;
    height: 100%;
}
.snake-drop-menu__trigger {
    display: flex;
    flex: 1;
    min-width: 0;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 0 6px;
    line-height: 1;
}
.snake-drop-menu__trigger.is-disabled {
    opacity: 0.55;
}
.snake-drop-menu__title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.snake-drop-menu__arrow {
    flex: none;
    line-height: 1;
    transition: transform 0.3s;
}
.snake-drop-menu__arrow--open {
    transform: rotate(180deg);
}
</style>
