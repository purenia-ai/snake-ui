<template>
    <view class="auxiliarysegmentation">
        <view
            class="contan"
            :style="{
                height: addUnit(datas.blankHeight, 'px'),
                padding: datas.paddType === 0 ? '0px' : '0px 15px',
                backgroundColor: datas.bgColor
            }"
        >
            <view
                v-show="datas.segmentationtype === 1"
                style="width: 100%; height: 1px; border-top-width: 1px"
                :style="{
                    'border-top-style': datas.bordertp,
                    'border-top-color': datas.auxliarColor
                }"
            />
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component AuxiliarySegmentation
 * @description 在装修页面中插入留白，或在留白区域中央绘制一条可配置分割线。
 */

import { addUnit } from '../../libs/function/unit';
import type { AuxiliarySegmentationProps } from './types';

defineOptions({ name: 'AuxiliarySegmentation', options: { virtualHost: true, styleIsolation: 'shared' } });
withDefaults(defineProps<AuxiliarySegmentationProps>(), { datas: () => ({}) });
</script>

<style scoped lang="scss">
.auxiliarysegmentation {
    .contan {
        display: flex;
        align-items: center;
        width: 100%;
    }
}
</style>
