<template>
    <view class="cms-v2-hotzone"><image class="cms-v2-hotzone__image" :src="data.image || ''" mode="widthFix" /><view v-for="(zone, index) in zones" :key="zone.id ?? index" class="cms-v2-hotzone__zone" :style="zoneStyle(zone)" @click="openV2Link(zone, linkService, pageInfo)" /></view>
</template>
<script setup lang="ts">
/** @component CmsV2Hotzone @description CMS v2 热区图片内部渲染器。 @see /cms/components */
import { computed } from 'vue';
import { openV2Link, type V2BlockProps, type V2Record } from './shared';
const props = defineProps<V2BlockProps>();
const zones = computed(() => Array.isArray(props.data.zones) ? props.data.zones : []);
const percent = (value: unknown) => `${Math.min(100, Math.max(0, Number(value) || 0))}%`;
const zoneStyle = (zone: V2Record) => ({ top: percent(zone.top), left: percent(zone.left), width: percent(zone.width), height: percent(zone.height) });
</script>
<style scoped>.cms-v2-hotzone { position: relative; width: 100%; line-height: 0; } .cms-v2-hotzone__image { display: block; width: 100%; } .cms-v2-hotzone__zone { position: absolute; z-index: 1; }</style>
