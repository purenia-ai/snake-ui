<template>
    <view class="snake-hotzone">
        <!-- 无背景图占位 -->
        <view v-if="!datas.image" class="snake-hotzone__empty">热区图</view>
        <!-- 背景图 + 百分比热区 -->
        <view v-else class="snake-hotzone__wrap">
            <image class="snake-hotzone__image" :src="datas.image" mode="widthFix" show-menu-by-longpress />
            <view
                v-for="(zone, index) in hotzoneList"
                :key="zone.id ?? index"
                class="snake-hotzone__zone"
                :style="zoneStyle(zone)"
                role="link"
                :tabindex="zone.http ? 0 : -1"
                :aria-label="`打开热区链接 ${index + 1}`"
                @click="handleZoneClick(zone)"
                @keydown.enter.prevent="handleZoneClick(zone)"
                @keydown.space.prevent="handleZoneClick(zone)"
            />
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component SnakeHotzone
 * @description 在一张背景图上按百分比布局多个可点击热区，热区范围与跳转链接由装修编辑器（sanke-editor）配置。
 * @see /components/hotzone
 */

import { computed } from 'vue';
import { resolveSnakeCmsOptions } from '../../libs/cms';
import { navTo, toast } from '../../libs/function/platform';
import { SnakeCmsError, type SnakeCmsLinkService, type SnakeCmsPageInfo } from '../snake-cms/types';
import type { SnakeHotzoneItem } from './types';

defineOptions({
    name: 'SnakeHotzone',
    options: { virtualHost: true, addGlobalClass: true, styleIsolation: 'shared' }
});

const props = withDefaults(
    defineProps<{
        datas?: Record<string, any>;
        linkService?: SnakeCmsLinkService;
        pageInfo?: SnakeCmsPageInfo;
    }>(),
    { datas: () => ({}), linkService: undefined, pageInfo: () => ({}) }
);
const emit = defineEmits<{ error: [error: SnakeCmsError] }>();

const hotzoneList = computed<SnakeHotzoneItem[]>(() => {
    const list = props.datas?.hotzoneList;
    return Array.isArray(list) ? list : [];
});

function zoneStyle(zone: SnakeHotzoneItem): Record<string, string> {
    return {
        top: `${zone.top ?? 0}%`,
        left: `${zone.left ?? 0}%`,
        width: `${zone.width ?? 0}%`,
        height: `${zone.height ?? 0}%`
    };
}

async function handleZoneClick(zone: SnakeHotzoneItem): Promise<void> {
    const url = (zone.http || '').trim();
    if (!url) return;
    if (zone.httpType === 11) {
        await openExternal(url);
        return;
    }
    // httpType 10 内部链接:navigateTo 失败自动降级 switchTab,H5 下 http 链接由浏览器接管
    navTo(url);
}

async function openExternal(url: string): Promise<void> {
    const service = props.linkService || resolveSnakeCmsOptions().services?.link;
    if (!service) {
        const error = new SnakeCmsError('link', '未配置 CMS 跳转服务');
        emit('error', error);
        toast(error.message);
        return;
    }
    try {
        await service.open({ type: 'external', url }, { pageInfo: props.pageInfo });
    } catch (cause) {
        const error = new SnakeCmsError('link', '热区外链跳转失败', cause);
        emit('error', error);
        toast(error.message);
    }
}
</script>

<style lang="scss" scoped>
.snake-hotzone {
    position: relative;

    &__empty {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 300rpx;
        background: #ccc;
    }

    &__wrap {
        position: relative;
        width: 100%;
    }

    &__image {
        display: block;
        width: 100%;
    }

    &__zone {
        position: absolute;
    }
}
</style>
