<template>
    <DemoPage :title="title" :desc="text('根据页面装修配置按顺序渲染完整的 CMS 页面。')" viewport>
        <DemoSection bare variant="preview" :title="text('演示效果')">
            <snake-cms
                class="demo-snake-cms-showcase"
                :page-info="pageInfo"
                :page-components="components"
                :scroll-top="scrollTop"
            />
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { onPageScroll } from '@dcloudio/uni-app';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import { cmsComponents, navigationData, noticeData } from '../../../common/fixtures';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const scrollTop = ref(0);
onPageScroll(event => {
    scrollTop.value = event.scrollTop;
});
const pageInfo = { pageId: 'preview' };
const controls: DemoControl[] = [
    {
        key: 'cmsScene',
        label: '页面场景',
        type: 'select',
        defaultValue: 'full',
        options: [
            { label: '完整页面', value: 'full' },
            { label: '内容精简', value: 'simple' }
        ]
    }
];
const state = reactive<Record<string, DemoValue>>({ cmsScene: 'full' });
const localizedComponents = computed(() =>
    isEnglish.value
        ? [
              {
                  component: 'notice',
                  setStyle: {
                      ...noticeData,
                      textList: [
                          { text: 'Snake UI preview is ready', url: '' },
                          { text: 'All example data runs locally', url: '' }
                      ]
                  }
              },
              {
                  component: 'graphicnavigation',
                  setStyle: {
                      ...navigationData,
                      imageList: navigationData.imageList.map((item, index) => ({
                          ...item,
                          text: ['New', 'Auction', 'Featured', 'Services'][index]
                      }))
                  }
              }
          ]
        : cmsComponents
);
const components = computed(() =>
    state.cmsScene === 'simple' ? localizedComponents.value.slice(0, 1) : localizedComponents.value
);
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({
        ...control,
        label: demoText(control.label),
        options: control.options?.map(option => ({ ...option, label: demoText(option.label) }))
    }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('snake-cms', 'Snake CMS');
});

function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>
