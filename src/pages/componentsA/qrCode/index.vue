<template>
    <DemoPage :title="title" :desc="text('把文本或链接渲染为可扫描的二维码，支持中心 Logo 与导出图片。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="qr-demo__box">
                <view class="qr-demo__plate" hover-class="qr-demo__plate--hover" @click="exportQr">
                    <snake-qr-code
                        ref="qrCodeRef"
                        :text="qrText"
                        :size="sizeValue"
                        :correct-level="String(state.cLevel)"
                        :margin="marginValue"
                        :logo="logoSrc"
                        :color-dark="preset.dark"
                        :color-light="preset.light"
                    />
                </view>
                <view class="qr-demo__url">{{ qrText || 'https://m.puresnake.com/snake-ui/' }}</view>
                <view class="qr-demo__actions">
                    <snake-button size="small" type="primary" @click="exportQr">{{ text('导出图片') }}</snake-button>
                    <snake-button size="small" plain type="primary" @click="cyclePreset">
                        {{ text('换一组配色') }}
                    </snake-button>
                </view>
            </view>
        </DemoSection>

        <DemoSection variant="preview" :title="text('配色方案')">
            <scroll-view class="qr-presets" scroll-x :show-scrollbar="false">
                <view
                    v-for="(item, index) in presets"
                    :key="item.key"
                    class="qr-preset"
                    :class="{ 'is-active': index === presetIndex }"
                    :style="{ backgroundColor: item.light }"
                    @click="presetIndex = index"
                >
                    <snake-qr-code
                        :text="presetText"
                        :size="96"
                        :margin="4"
                        correct-level="H"
                        :color-dark="item.dark"
                        :color-light="item.light"
                        :canvas-id="`qr-preset-${item.key}`"
                    />
                    <view class="qr-preset__name">{{ text(item.name) }}</view>
                    <view class="qr-preset__dots">
                        <view class="qr-preset__dot" :style="{ backgroundColor: item.dark }" />
                        <view class="qr-preset__dot qr-preset__dot--light" :style="{ backgroundColor: item.light }" />
                    </view>
                </view>
            </scroll-view>
            <view class="qr-presets__hint">{{ text('点击方案应用到上方二维码') }}</view>
        </DemoSection>

        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import demoLogo from '@/static/logo.png';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
import type { QrCodeExpose } from '../../../uni_modules/snake-ui';

const { localeName, text } = useDemoLocale();
const qrCodeRef = ref<QrCodeExpose>();

/** 配色预设：全部为深色模块 + 浅色底，保证任意配色都可稳定扫描。 */
const presets = [
    { key: 'ink', name: '经典墨', dark: '#111827', light: '#ffffff' },
    { key: 'mint', name: '薄荷', dark: '#04785c', light: '#e6faf4' },
    { key: 'indigo', name: '靛蓝', dark: '#312e81', light: '#eef2ff' },
    { key: 'amber', name: '琥珀', dark: '#92400e', light: '#fffbeb' }
] as const;
const presetIndex = ref(0);
const preset = computed(() => presets[presetIndex.value]);
const presetText = 'https://m.puresnake.com';

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
function cyclePreset() {
    presetIndex.value = (presetIndex.value + 1) % presets.length;
}
function exportQr() {
    qrCodeRef.value?.exportImage().then(
        path => {
            uni.previewImage({ urls: [path] });
        },
        () => {
            uni.showToast({ icon: 'none', title: demoText('导出失败') });
        }
    );
}
</script>

<style scoped lang="scss">
/* 演示区：muted 盒子 + 白色码牌，朴素为主 */
.qr-demo__box {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
    align-items: center;
    padding: 32rpx 24rpx;
    border-radius: 16rpx;
    background: var(--snake-color-surface-muted);
}

.qr-demo__plate {
    padding: 20rpx;
    border-radius: 16rpx;
    background: #ffffff;
    box-shadow: 0 6rpx 20rpx rgba(38, 39, 58, 0.08);
}

.qr-demo__plate--hover {
    opacity: 0.85;
}

.qr-demo__url {
    max-width: 80%;
    overflow: hidden;
    padding: 8rpx 22rpx;
    border-radius: 999rpx;
    background: var(--snake-color-surface);
    color: var(--snake-color-text-secondary);
    font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 20rpx;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.qr-demo__actions {
    display: flex;
    gap: 20rpx;
}

/* 配色预设：横滑小卡，选中态仅描边提示 */
.qr-presets {
    width: 100%;
    white-space: nowrap;
}

.qr-preset {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    width: 200rpx;
    padding: 22rpx 16rpx 18rpx;
    border: 2rpx solid transparent;
    border-radius: 16rpx;

    &.is-active {
        border-color: rgba(var(--snake-color-primary-rgb), 0.9);
    }

    & + & {
        margin-left: 20rpx;
    }
}

.qr-preset__name {
    margin-top: 12rpx;
    color: var(--snake-color-text);
    font-size: 24rpx;
    font-weight: 600;
}

.qr-preset__dots {
    display: flex;
    gap: 8rpx;
    margin-top: 8rpx;
}

.qr-preset__dot {
    width: 14rpx;
    height: 14rpx;
    border: 1rpx solid rgba(38, 39, 58, 0.15);
    border-radius: 50%;

    &--light {
        border-color: rgba(38, 39, 58, 0.1);
    }
}

.qr-presets__hint {
    margin-top: 18rpx;
    color: var(--snake-color-text-muted);
    font-size: 20rpx;
    text-align: center;
}
</style>
