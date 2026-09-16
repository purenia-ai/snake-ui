<template>
    <DemoPage :title="title" :desc="text('完整解析 HTML 图文内容，覆盖表格、列表、图片、链接与样式。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <snake-parse
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
        </DemoSection>
    </DemoPage>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
import demoContent from './content';

const { localeName, text } = useDemoLocale();
const content = ref('');
const tagStyle = {
    table: 'box-sizing:border-box;border-top:1px solid #dfe2e5;border-left:1px solid #dfe2e5;',
    th: 'border-right:1px solid #dfe2e5;border-bottom:1px solid #dfe2e5;',
    td: 'border-right:1px solid #dfe2e5;border-bottom:1px solid #dfe2e5;',
    li: 'margin:5px 0;'
};
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('parse', 'Parse 富文本解析');
});

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
