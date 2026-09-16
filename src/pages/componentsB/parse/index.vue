<template>
    <view class="parse-demo">
        <snake-parse
            container-style="padding:20px"
            :content="content"
            domain="https://6874-html-foe72-1259071903.tcb.qcloud.la/demo"
            lazy-load
            scroll-table
            selectable
            use-anchor
            :tag-style="tagStyle"
            @load="load"
            @ready="ready"
            @imgtap="imgTap"
            @linktap="linkTap"
        />
    </view>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import demoContent from './content';
const content = ref('');
const tagStyle = {
    table: 'box-sizing:border-box;border-top:1px solid #dfe2e5;border-left:1px solid #dfe2e5;',
    th: 'border-right:1px solid #dfe2e5;border-bottom:1px solid #dfe2e5;',
    td: 'border-right:1px solid #dfe2e5;border-bottom:1px solid #dfe2e5;',
    li: 'margin:5px 0;'
};
onMounted(() =>
    setTimeout(() => {
        content.value = demoContent;
    }, 200)
);
function load() {
    console.log('snake-parse nodes loaded');
}
function ready() {
    console.log('snake-parse content ready');
}
function imgTap() {
    console.log('snake-parse image tapped');
}
function linkTap() {
    console.log('snake-parse link tapped');
}
</script>
<style lang="scss">
.parse-demo {
    padding: 24rpx;
    font-size: 32rpx;
    color: #303133;
    line-height: 1.6;
}
</style>
