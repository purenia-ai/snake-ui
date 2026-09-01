<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import DemoControlPanel from '../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../components/demo-page/demo-page.vue';
import DemoSection from '../components/demo-section/demo-section.vue';
import { createDemoState, getDemoDefinition, localizeDemoDefinition, type DemoValue } from './demo-config';
import { demoText, demoTitle, useDemoLocale } from '../common/demo-i18n';
import { cmsComponents } from '../common/fixtures';

const props = defineProps<{ kind: string; title: string }>();
const { localeName, text } = useDemoLocale();
const definition = computed(() => {
    const _locale = localeName.value;
    return localizeDemoDefinition(getDemoDefinition(props.kind), demoText);
});
const localizedTitle = computed(() => {
    const _locale = localeName.value;
    return demoTitle(props.kind, props.title);
});
const demoState = reactive<Record<string, DemoValue>>(createDemoState(props.kind));
const scrollTop = ref(0);
const viewportKinds = new Set(['snake-cms']);
const isViewportPreview = computed(() => viewportKinds.has(props.kind));
const categoryLabel = computed(() => definition.value.category);
const previewDescription = computed(() => definition.value.description);
const cmsPageInfo = { pageId: 'preview' };
const demoCmsComponents = computed(() => (demoState.cmsScene === 'simple' ? cmsComponents.slice(0, 1) : cmsComponents));

watch(
    () => props.kind,
    kind => {
        for (const key of Object.keys(demoState)) delete demoState[key];
        Object.assign(demoState, createDemoState(kind));
    }
);

function updateDemoValue(key: string, value: DemoValue) {
    demoState[key] = value;
}
</script>

<template>
    <DemoPage :title="localizedTitle" :eyebrow="categoryLabel" :desc="previewDescription" :viewport="isViewportPreview">
        <DemoSection :bare="isViewportPreview" variant="preview" :title="text('演示效果')">
            <snake-cms
                v-if="kind === 'snake-cms'"
                class="demo-snake-cms-showcase"
                :page-info="cmsPageInfo"
                :page-components="demoCmsComponents"
                :scroll-top="scrollTop"
            />
        </DemoSection>
        <DemoSection v-if="definition.controls.length" variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="definition.controls" :values="demoState" @change="updateDemoValue" />
        </DemoSection>
    </DemoPage>
</template>
