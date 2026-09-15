<template>
    <DemoPage :title="title" :desc="text('弹出层支持从页面不同方向出现并承载业务内容。')" viewport>
        <DemoSection bare variant="preview" :title="text('演示效果')">
            <view class="demo-trigger demo-popup-showcase">
                <text class="demo-variant-title">
                    {{ isEnglish ? 'Position and closing behavior' : '位置与关闭行为' }}
                </text>
                <snake-button @click="visible = true">{{ isEnglish ? 'Open popup' : '打开弹窗' }}</snake-button>
                <snake-popup
                    v-model="visible"
                    :mode="state.popupMode as any"
                    :close-on-click-overlay="Boolean(state.closeOverlay)"
                >
                    <view class="demo-popup">
                        <text class="demo-popup__title">Snake Popup</text>
                        <text>{{ isEnglish ? 'This is an interactive popup.' : '这是一个可交互的弹出层。' }}</text>
                        <snake-button custom-style="margin-top: 32rpx" @click="visible = false">
                            {{ isEnglish ? 'Close' : '关闭' }}
                        </snake-button>
                    </view>
                </snake-popup>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

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
    {
        key: 'popupMode',
        label: '弹出方向',
        type: 'select',
        defaultValue: 'bottom',
        options: [
            { label: '底部', value: 'bottom' },
            { label: '居中', value: 'center' },
            { label: '顶部', value: 'top' }
        ]
    },
    { key: 'closeOverlay', label: '点击遮罩关闭', type: 'switch', defaultValue: true }
];
const state = reactive<Record<string, DemoValue>>({ popupMode: 'bottom', closeOverlay: true });
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
    return demoTitle('popup', '弹出层');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

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
.demo-popup {
    padding: 40rpx 32rpx calc(40rpx + env(safe-area-inset-bottom));
    color: var(--snake-color-text-secondary);
}
.demo-popup__title {
    display: block;
    margin-bottom: 16rpx;
    color: var(--snake-color-text);
    font-size: 34rpx;
    font-weight: 700;
}
</style>
