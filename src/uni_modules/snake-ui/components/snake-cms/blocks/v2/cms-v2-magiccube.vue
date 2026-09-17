<template>
    <view class="cms-v2-magiccube" :style="rootStyle">
        <view class="cms-v2-magiccube__grid" :style="gridStyle">
            <image
                v-for="(cell, index) in cells"
                :key="index"
                class="cms-v2-magiccube__cell"
                :style="cellStyle(index)"
                :src="activeImage(cell).src || ''"
                mode="aspectFill"
                @click="openV2Link(activeImage(cell).link, linkService, pageInfo)"
            />
        </view>
    </view>
</template>
<script setup lang="ts">
/** @component CmsV2Magiccube @description CMS v2 魔方布局与定时投放内部渲染器。 @see /cms/overview */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { blockStyle, openV2Link, rpx, type V2BlockProps, type V2Record } from './shared';
const props = defineProps<V2BlockProps>();
const now = ref(new Date());
const slideIndex = ref(0);
let scheduleTimer: ReturnType<typeof setInterval> | undefined;
let slideTimer: ReturnType<typeof setInterval> | undefined;
const layouts: Record<string, { template: string; columns: string; rows: string }> = {
    grid2x2: { template: '"a b" "c d"', columns: '1fr 1fr', rows: '1fr 1fr' },
    left1right2: { template: '"a b" "a c"', columns: '1fr 1fr', rows: '1fr 1fr' },
    top1bottom2: { template: '"a a" "b c"', columns: '1fr 1fr', rows: '1fr 1fr' },
    left1right3: { template: '"a b b" "a c d"', columns: '1fr 1fr 1fr', rows: '1fr 1fr' },
    left2right1: { template: '"a c" "b c"', columns: '1fr 1fr', rows: '1fr 1fr' },
    left3right1: { template: '"a a d" "b c d"', columns: '1fr 1fr 1fr', rows: '1fr 1fr' }
};
const cells = computed(() => (Array.isArray(props.data.cells) ? props.data.cells : []));
const rootStyle = computed(() => ({ ...blockStyle(props.data.style), height: rpx(props.data.style?.height, 188) }));
const gridStyle = computed(() => {
    const layout = layouts[props.data.layout];
    return layout
        ? {
              gridTemplateAreas: layout.template,
              gridTemplateColumns: layout.columns,
              gridTemplateRows: layout.rows,
              gap: rpx(props.data.style?.gap)
          }
        : {
              gridTemplateColumns: `repeat(${Math.min(6, Math.max(1, Number(props.data.columns) || 4))}, 1fr)`,
              gap: rpx(props.data.style?.gap)
          };
});
const cellStyle = (index: number) => ({
    ...(props.data.layout === 'row' || !layouts[props.data.layout]
        ? {}
        : { gridArea: String.fromCharCode(97 + index) }),
    borderRadius: rpx(props.data.style?.radius),
    overflow: 'hidden'
});
function activeImage(cell: V2Record): V2Record {
    const current = now.value;
    const weekday = current.getDay() || 7;
    const time = `${String(current.getHours()).padStart(2, '0')}:${String(current.getMinutes()).padStart(2, '0')}`;
    const schedules = Array.isArray(cell.schedules) ? cell.schedules : [];
    const active = schedules.filter(
        (item: V2Record) =>
            (!Array.isArray(item.weeks) || item.weeks.includes(weekday)) &&
            (!item.startTime || item.startTime <= time) &&
            (!item.endTime || item.endTime >= time)
    );
    return active.length ? active[slideIndex.value % active.length] : cell;
}
onMounted(() => {
    scheduleTimer = setInterval(() => (now.value = new Date()), 30_000);
    slideTimer = setInterval(
        () => (slideIndex.value += 1),
        Math.max(1000, Number(props.data.play?.interval || 3) * 1000)
    );
});
onBeforeUnmount(() => {
    clearInterval(scheduleTimer);
    clearInterval(slideTimer);
});
</script>
<style scoped>
.cms-v2-magiccube__grid {
    display: grid;
    width: 100%;
    height: 100%;
}
.cms-v2-magiccube__cell {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
}
</style>
