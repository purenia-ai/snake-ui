<template>
    <DemoPage :title="title" :desc="text('完整解析 HTML 图文内容，覆盖表格、列表、图片、链接与样式。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <snake-parse
                :content="content"
                :lazy-load="Boolean(state.lazyLoad)"
                :scroll-table="Boolean(state.scrollTable)"
                selectable
                use-anchor
                :tag-style="tagStyle"
                @load="load"
                @ready="ready"
                @imgtap="imgTap"
                @linktap="linkTap"
            />
            <text v-if="feedback" class="parse-feedback" aria-live="polite">{{ feedback }}</text>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="controls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
import demoContent from './content';

const { localeName, text } = useDemoLocale();
const content = ref('');
const feedback = ref('');
const controls = computed<DemoControl[]>(() => [
    { key: 'lazyLoad', label: text('图片懒加载'), type: 'switch', defaultValue: true },
    { key: 'scrollTable', label: text('表格横向滚动'), type: 'switch', defaultValue: true }
]);
const state = reactive<Record<string, DemoValue>>({ lazyLoad: true, scrollTable: true });
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

let timer: ReturnType<typeof setTimeout> | undefined;
onMounted(() => {
    timer = setTimeout(() => {
        content.value = demoContent;
    }, 200);
});
onBeforeUnmount(() => {
    if (timer) clearTimeout(timer);
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function load() {
    feedback.value = text('内容已加载');
}
function ready() {
    feedback.value = text('内容已就绪');
}
function imgTap() {
    feedback.value = text('已点击图片');
}
function linkTap() {
    feedback.value = text('已点击链接');
}
</script>
<style scoped>
.parse-feedback {
    display: block;
    margin: 16rpx;
    color: var(--snake-color-primary-deep);
    font-size: 24rpx;
}
</style>
