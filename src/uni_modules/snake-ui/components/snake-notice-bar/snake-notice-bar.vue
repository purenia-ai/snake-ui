<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import type { SnakeNoticeBarEmits, SnakeNoticeBarProps } from './types';
const props = withDefaults(defineProps<SnakeNoticeBarProps>(), { list: () => [], text: '', mode: 'horizontal', direction: 'row', volumeIcon: false, bgColor: 'var(--snake-color-notice-background, #fff8e6)', color: 'var(--snake-color-notice, #f9ae3d)', duration: 3000, customStyle: '' });
const emit = defineEmits<SnakeNoticeBarEmits>();
const current = ref(0); const items = computed(() => props.list.length ? props.list : Array.isArray(props.text) ? props.text : [props.text].filter(Boolean)); let timer: ReturnType<typeof setInterval> | undefined;
function restart(){ if(timer) clearInterval(timer); if((props.mode === 'vertical' || props.direction === 'column') && items.value.length > 1) timer = setInterval(() => { current.value = (current.value + 1) % items.value.length; emit('change', current.value); }, props.duration); }
watch([items, () => props.duration], restart, { immediate: true }); onBeforeUnmount(() => timer && clearInterval(timer));
</script>
<template><view class="snake-notice-bar" :style="[$snakeThemeStyle, { backgroundColor: bgColor, color }, customStyle]" @click="emit('click', current)"><text v-if="volumeIcon" class="snake-notice-bar__icon">◖</text><text class="snake-notice-bar__text">{{ items[current] || '' }}</text></view></template>
<style scoped>.snake-notice-bar{box-sizing:border-box;display:flex;align-items:center;width:100%;overflow:hidden;padding:18rpx 24rpx;font-size:26rpx}.snake-notice-bar__icon{margin-right:12rpx}.snake-notice-bar__text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}</style>
