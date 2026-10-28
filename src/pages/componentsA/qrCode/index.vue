<template>
    <DemoPage :title="title" :desc="text('把文本或链接渲染为可扫描的二维码，支持中心 Logo 与导出图片。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-qr-showcase">
                <snake-qr-code
                    ref="qrCodeRef"
                    :text="qrText"
                    :size="sizeValue"
                    :correct-level="String(state.cLevel)"
                    :margin="marginValue"
                    :logo="logoSrc"
                />
                <snake-button size="mini" custom-style="width: auto" @click="exportQr">
                    {{ text('导出图片') }}
                </snake-button>
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
import type { QrCodeExpose } from '../../../uni_modules/snake-ui';

const { localeName, text } = useDemoLocale();
const qrCodeRef = ref<QrCodeExpose>();
const demoLogo = 'https://cdn.puresnake.com/joker/static/default-profile.png';

const controls: DemoControl[] = [
    {
        key: 'cText',
        label: '二维码内容',
        type: 'input',
        defaultValue: 'https://m.puresnake.com/snake-ui/',
        placeholder: 'text or url'
    },
    { key: 'cSize', label: '边长', type: 'slider', defaultValue: 200, min: 120, max: 320, step: 10, unit: 'px' },
    {
        key: 'cLevel',
        label: '纠错级别',
        type: 'select',
        defaultValue: 'H',
        options: [
            { label: 'L 约 7%', value: 'L' },
            { label: 'M 约 15%', value: 'M' },
            { label: 'Q 约 25%', value: 'Q' },
            { label: 'H 约 30%', value: 'H' }
        ]
    },
    { key: 'cMargin', label: '留白', type: 'slider', defaultValue: 0, min: 0, max: 20, step: 2, unit: 'px' },
    { key: 'cLogo', label: '显示 Logo', type: 'switch', defaultValue: false }
];
const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
const qrText = computed(() => String(state.cText || ''));
const sizeValue = computed(() => Number(state.cSize) || 200);
const marginValue = computed(() => Number(state.cMargin) || 0);
const logoSrc = computed(() => (state.cLogo ? demoLogo : ''));
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
    return demoTitle('qr-code', '二维码');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function exportQr() {
    qrCodeRef.value?.exportImage().then(
        path => {
            uni.previewImage({ urls: [path] });
        },
        () => {}
    );
}
</script>

<style scoped lang="scss">
.demo-qr-showcase {
    gap: 24rpx;
    align-items: center;
}
</style>
