<template>
    <DemoPage :title="title" :desc="text('页面滚动超过阈值后出现回到顶部按钮，点击平滑回到顶部。')">
        <DemoSection bare variant="preview" :title="text('演示效果')">
            <view class="demo-scroll demo-backtop-showcase">
                <text class="demo-variant-title">{{
                    isEnglish ? 'Scroll down to reveal the button' : '向下滚动，按钮出现在右下角'
                }}</text>
                <view v-for="item in 20" :key="item" class="demo-row">
                    {{ isEnglish ? 'Scroll item' : '滚动内容' }} {{ item }}
                </view>
            </view>
            <snake-backtop
                :scroll-top="scrollTop"
                :top="Number(state.backtopTop)"
                :bottom="Number(state.backtopBottom)"
                :shape="state.backtopShape === 'square' ? 'square' : 'circle'"
                :text="state.backtopText ? (isEnglish ? 'TOP' : '顶部') : ''"
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
const controls: DemoControl[] = [
    {
        key: 'backtopShape',
        label: '按钮形状',
        type: 'select',
        defaultValue: 'circle',
        options: [
            { label: '圆形', value: 'circle' },
            { label: '方形', value: 'square' }
        ]
    },
    {
        key: 'backtopTop',
        label: '显示阈值',
        type: 'slider',
        defaultValue: 200,
        min: 100,
        max: 600,
        step: 50,
        unit: 'px'
    },
    {
        key: 'backtopBottom',
        label: '距底部',
        type: 'slider',
        defaultValue: 100,
        min: 40,
        max: 200,
        step: 10,
        unit: 'px'
    },
    { key: 'backtopText', label: '显示文字', type: 'switch', defaultValue: false }
];
const state = reactive<Record<string, DemoValue>>({
    backtopShape: 'circle',
    backtopTop: 200,
    backtopBottom: 100,
    backtopText: false
});
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('backtop', '回到顶部');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<style scoped>
.demo-scroll {
    min-height: 150vh;
    padding-bottom: 120px;
    background: var(--snake-color-surface-muted);
}
.demo-variant-title {
    display: block;
    padding: 12px 12px 0;
}
.demo-row {
    margin: 10px 12px;
    padding: 16px;
    border: 1px solid var(--snake-color-divider);
    border-radius: 7px;
    background: var(--snake-color-surface);
}
</style>
