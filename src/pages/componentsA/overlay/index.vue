<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const visible = ref(false);
const controls: DemoControl[] = [
    { key: 'overlayTip', label: '遮罩提示', type: 'input', defaultValue: '点击任意位置关闭' }
];
const state = reactive<Record<string, DemoValue>>({ overlayTip: '点击任意位置关闭' });
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('overlay', '遮罩层');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<template>
    <DemoPage :title="title" :desc="text('全屏遮罩用于隔离当前页面与浮层操作。')" viewport>
        <DemoSection bare variant="preview" :title="text('演示效果')">
            <view class="demo-trigger demo-overlay-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Overlay content' : '遮罩内容' }}</text>
                <snake-button @click="visible = true">{{ isEnglish ? 'Open overlay' : '打开遮罩' }}</snake-button>
                <snake-overlay v-model="visible"
                    ><view class="demo-overlay-tip">{{ state.overlayTip }}</view></snake-overlay
                >
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')"
            ><DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue"
        /></DemoSection>
    </DemoPage>
</template>

<style scoped>
.demo-trigger {
    padding: 48rpx 24rpx;
}
.demo-variant-title {
    display: block;
    margin-bottom: 24rpx;
    color: var(--snake-color-text);
    font-size: 28rpx;
    font-weight: 600;
}
.demo-overlay-tip {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    color: #fff;
}
</style>
