<script setup lang="ts">
import { computed } from 'vue';
import type { SnakeTabItem, SnakeTabsEmits, SnakeTabsProps } from './types';
const props = withDefaults(defineProps<SnakeTabsProps>(), { list: () => [], current: 0, name: 'name', lineColor: 'var(--snake-color-primary, #06d290)', activeColor: 'var(--snake-color-text, #303133)', inactiveColor: 'var(--snake-color-text-secondary, #606266)', fontSize: '28rpx', activeItemStyle: () => ({}), barStyle: () => ({}), bgColor: 'transparent', scrollable: true });
const emit = defineEmits<SnakeTabsEmits>();
const label = (item: SnakeTabItem) => typeof item === 'string' ? item : String(item?.[props.name] ?? item?.name ?? '');
function select(item: SnakeTabItem, index: number){ emit('click', { index, item }); if(index !== props.current) emit('change', index); }
const lineStyle = computed(() => ({ backgroundColor: props.lineColor, ...props.barStyle }));
</script>
<template><scroll-view class="snake-tabs" scroll-x :show-scrollbar="false" :style="[$snakeThemeStyle, { backgroundColor: bgColor }]"><view class="snake-tabs__track"><view v-for="(item,index) in list" :key="index" class="snake-tabs__item" :style="[{ color: index === current ? activeColor : inactiveColor, fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize }, index === current ? activeItemStyle : {}]" @click="select(item,index)"><text>{{ label(item) }}</text><view v-if="index === current" class="snake-tabs__line" :style="lineStyle"/></view></view></scroll-view></template>
<style scoped>.snake-tabs{width:100%;white-space:nowrap}.snake-tabs__track{display:inline-flex;min-width:100%}.snake-tabs__item{position:relative;box-sizing:border-box;display:flex;flex:1;align-items:center;justify-content:center;min-width:120rpx;padding:24rpx 20rpx}.snake-tabs__line{position:absolute;bottom:4rpx;left:50%;width:40rpx;height:6rpx;border-radius:999px;transform:translateX(-50%)}</style>
