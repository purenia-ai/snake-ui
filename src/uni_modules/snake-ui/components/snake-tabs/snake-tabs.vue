<script setup lang="ts">
import { computed } from 'vue';
import { addUnit } from '../../libs/function/unit';
import type { SnakeTabItem, SnakeTabsEmits, SnakeTabsProps } from './types';

defineOptions({ name: 'SnakeTabs', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<SnakeTabsProps>(), {
  list: () => [], current: 0, name: 'name', count: 'count', scrollable: true, height: 80, fontSize: 30,
  duration: 0.3, lineColor: 'var(--snake-color-primary, #06D290)', activeColor: 'var(--snake-color-text, #303133)',
  inactiveColor: 'var(--snake-color-text-secondary, #606266)', barWidth: 40, barHeight: 6, gutter: 30,
  bgColor: 'transparent', offset: () => [5, 20], isDot: false, bold: true, activeItemStyle: '', showBar: true,
  barStyle: '', itemWidth: 'auto', customClass: '', customStyle: '',
});
const emit = defineEmits<SnakeTabsEmits>();
const active = computed(() => Math.max(0, Math.min(props.list.length - 1, Number(props.current) || 0)));
const canScroll = computed(() => props.isScroll ?? props.scrollable);
const scrollIntoView = computed(() => canScroll.value ? `snake-tab-${active.value}` : '');
const rootStyle = computed(() => [{ height: addUnit(props.height, 'px'), backgroundColor: props.bgColor }, props.customStyle]);
const label = (item: SnakeTabItem) => typeof item === 'string' ? item : String(item?.[props.name] ?? item?.name ?? '');
const badge = (item: SnakeTabItem) => typeof item === 'string' ? '' : item?.[props.count];
const disabled = (item: SnakeTabItem) => typeof item !== 'string' && Boolean(item?.disabled);
const itemStyle = (index: number) => [{ color: index === active.value ? props.activeColor : props.inactiveColor, fontSize: addUnit(props.fontSize, 'rpx'), fontWeight: index === active.value && props.bold ? '600' : '400', flex: canScroll.value ? 'none' : '1', width: props.itemWidth === 'auto' ? undefined : addUnit(props.itemWidth, 'rpx'), paddingLeft: addUnit(props.gutter, 'rpx'), paddingRight: addUnit(props.gutter, 'rpx'), opacity: disabled(props.list[index]) ? 0.45 : 1 }, index === active.value ? props.activeItemStyle : ''];
const lineStyle = computed(() => [{ width: addUnit(props.barWidth, 'rpx'), height: addUnit(props.barHeight, 'rpx'), backgroundColor: props.lineColor, transitionDuration: `${Number(props.duration) || 0.3}s` }, props.barStyle]);
function select(item: SnakeTabItem, index: number) { emit('click', { index, item }); if (!disabled(item) && index !== active.value) emit('change', index); }
</script>

<template>
  <scroll-view class="snake-tabs" :class="customClass" scroll-x :scroll-into-view="scrollIntoView" scroll-with-animation :show-scrollbar="false" :style="[$snakeThemeStyle, rootStyle]">
    <view class="snake-tabs__track" :class="{ 'is-scrollable': canScroll }">
      <view v-for="(item, index) in list" :id="`snake-tab-${index}`" :key="index" class="snake-tabs__item" :style="itemStyle(index)" @click="select(item, index)">
        <view class="snake-tabs__label"><text>{{ label(item) }}</text><text v-if="badge(item) !== ''" class="snake-tabs__badge" :class="{ 'is-dot': isDot }" :style="{ top: `${offset[0]}px`, right: `${offset[1]}px` }">{{ isDot ? '' : badge(item) }}</text></view>
        <view v-if="showBar && index === active" class="snake-tabs__line" :style="lineStyle" />
      </view>
    </view>
  </scroll-view>
</template>

<style scoped>
.snake-tabs { width: 100%; white-space: nowrap; }.snake-tabs__track { display: flex; min-width: 100%; height: 100%; }.snake-tabs__track.is-scrollable { display: inline-flex; }
.snake-tabs__item { position: relative; box-sizing: border-box; display: flex; height: 100%; align-items: center; justify-content: center; transition: color .2s ease; }
.snake-tabs__label { position: relative; display: inline-flex; align-items: center; height: 100%; }.snake-tabs__badge { position: absolute; min-width: 28rpx; height: 28rpx; padding: 0 7rpx; border-radius: 14rpx; color: #fff; font-size: 18rpx; line-height: 28rpx; text-align: center; background: var(--snake-color-error, #FE0832); transform: translate(100%, -30%); }.snake-tabs__badge.is-dot { min-width: 12rpx; width: 12rpx; height: 12rpx; padding: 0; }
.snake-tabs__line { position: absolute; bottom: 0; left: 50%; border-radius: 999px; transform: translateX(-50%); transition-property: width, background-color; }
</style>
