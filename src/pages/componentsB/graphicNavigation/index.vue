<template>
    <DemoPage :title="title" :desc="text('以图片和文字组合多个快捷导航入口。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <snake-graphic-navigation class="demo-graphic-navigation-showcase" :datas="data" @click="handleNavClick" />
            <text v-if="feedback" class="navigation-feedback" aria-live="polite">{{ feedback }}</text>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { navigationData } from '../../../common/fixtures';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const selectedIndex = ref<number | null>(null);
const controls: DemoControl[] = [
    { key: 'navRadius', label: '图片圆角', type: 'slider', defaultValue: 16, min: 0, max: 32, step: 4, unit: 'px' },
    {
        key: 'navTextColor',
        label: '文字颜色',
        type: 'select',
        defaultValue: '#24342c',
        options: [
            { label: '深色', value: '#24342c' },
            { label: '品牌绿', value: '#06D290' }
        ]
    }
];
const state = reactive<Record<string, DemoValue>>({ navRadius: 16, navTextColor: '#24342c' });
const data = computed(() => ({
    ...navigationData,
    imageList: navigationData.imageList.map((item, index) => ({
        ...item,
        text: isEnglish.value ? ['New', 'Auction', 'Featured', 'Services'][index] : item.text
    })),
    borderRadius: Number(state.navRadius),
    textColor: String(state.navTextColor)
}));
const feedback = computed(() => {
    if (selectedIndex.value === null) return '';
    const selected = data.value.imageList[selectedIndex.value];
    return isEnglish.value ? `Selected: ${selected?.text || ''}` : `已选择：${selected?.text || ''}`;
});
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
    return demoTitle('graphic-navigation', '图文导航');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function handleNavClick({ index }: { index: number }) {
    selectedIndex.value = index;
}
</script>
<style scoped>
.navigation-feedback {
    display: block;
    margin: 16rpx 24rpx 0;
    color: var(--snake-color-text-secondary);
    font-size: 24rpx;
}
</style>
