<template>
    <DemoPage :title="title" :desc="text('渲染后台编辑的图文和格式化内容。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <snake-rich-text class="demo-rich-text-showcase" :datas="data" />
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>
<script setup lang="ts">
import { computed, reactive } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const controls: DemoControl[] = [{ key: 'richHeading', label: '内容标题', type: 'input', defaultValue: 'Snake UI' }];
const state = reactive<Record<string, DemoValue>>({ richHeading: 'Snake UI' });
const data = computed(() => ({
    myValue: `<h3>${escapeHtml(String(state.richHeading))}</h3><p>${
        isEnglish.value
            ? 'This is an interactive uni-app cross-platform preview.'
            : '这是一个可交互的 uni-app 跨端实时预览。'
    }</p>`
}));
function escapeHtml(value: string) {
    return value.replace(/[&<>"']/g, character => {
        const entities: Record<string, string> = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return entities[character];
    });
}
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('rich-text', '富文本');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>
