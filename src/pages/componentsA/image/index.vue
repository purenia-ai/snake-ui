<template>
    <DemoPage :title="title" :desc="text('图片容器支持真实加载、失败反馈、懒加载、预览、形状和状态插槽。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="image-lab">
                <view class="image-lab__stage">
                    <snake-image
                        ref="imageRef"
                        :src="currentSrc"
                        :alt="isEnglish ? 'Snake UI demo image' : 'Snake UI 示例图片'"
                        :width="Number(state.width)"
                        :height="Number(state.height)"
                        :mode="String(state.mode)"
                        :shape="state.shape === 'circle' ? 'circle' : 'square'"
                        :radius="Number(state.radius)"
                        :lazy-load="Boolean(state.lazyLoad)"
                        :fade="Boolean(state.fade)"
                        :preview="Boolean(state.preview)"
                        :show-loading="Boolean(state.showLoading)"
                        :show-error="Boolean(state.showError)"
                        @load="setLoadStatus('success')"
                        @error="setLoadStatus('error')"
                    >
                        <template v-if="Boolean(state.customLoading)" #loading>
                            <view class="image-lab__slot image-lab__slot--loading">
                                <snake-loading size="20" />
                                <text>{{ isEnglish ? 'Fetching image' : '正在请求图片' }}</text>
                            </view>
                        </template>
                        <template v-if="Boolean(state.customError)" #error>
                            <view class="image-lab__slot image-lab__slot--error">
                                <snake-icon name="warning" size="22" />
                                <text>{{ isEnglish ? 'Image unavailable' : '图片暂时不可用' }}</text>
                            </view>
                        </template>
                    </snake-image>
                </view>

                <view class="image-lab__meta">
                    <view class="image-lab__status" :class="`image-lab__status--${loadStatus}`">
                        <view class="image-lab__status-dot" />
                        <text>{{ statusLabel }}</text>
                    </view>
                    <text class="image-lab__hint">{{ previewHint }}</text>
                    <button class="image-lab__retry" type="button" @tap="reloadImage">
                        {{ isEnglish ? 'Reload image' : '重新加载' }}
                    </button>
                </view>
            </view>
        </DemoSection>

        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>

        <DemoSection :title="isEnglish ? 'Interaction notes' : '交互说明'">
            <view class="image-notes">
                <text>{{
                    text('切换资源地址可观察真实的成功与失败状态；失败后点击重新加载可通过组件实例方法重试。')
                }}</text>
                <text>{{
                    text('开启预览后，仅成功加载的图片可点击预览；自定义状态内容通过 loading 和 error 插槽演示。')
                }}</text>
            </view>
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
import type { ImageExpose } from '../../../uni_modules/snake-ui/components/snake-image/types';

type LoadStatus = 'loading' | 'success' | 'error';

const { localeName, text } = useDemoLocale();
const imageRef = ref<ImageExpose>();
const loadStatus = ref<LoadStatus>('loading');
const isEnglish = computed(() => localeName.value === 'en-US');
const controls: DemoControl[] = [
    {
        key: 'source',
        label: '图片资源',
        type: 'select',
        defaultValue: 'logo',
        options: [
            { label: '品牌图片', value: 'logo' },
            { label: '错误地址', value: 'error' }
        ]
    },
    {
        key: 'mode',
        label: '裁剪模式',
        type: 'select',
        defaultValue: 'aspectFit',
        options: [
            { label: '完整显示', value: 'aspectFit' },
            { label: '填充裁剪', value: 'aspectFill' }
        ]
    },
    {
        key: 'shape',
        label: '图片形状',
        type: 'select',
        defaultValue: 'square',
        options: [
            { label: '方形', value: 'square' },
            { label: '圆形', value: 'circle' }
        ]
    },
    { key: 'width', label: '宽度', type: 'slider', defaultValue: 240, min: 120, max: 320, step: 20, unit: 'rpx' },
    { key: 'height', label: '高度', type: 'slider', defaultValue: 240, min: 120, max: 320, step: 20, unit: 'rpx' },
    { key: 'radius', label: '圆角', type: 'slider', defaultValue: 16, min: 0, max: 48, step: 4, unit: 'rpx' },
    { key: 'fade', label: '淡入动画', type: 'switch', defaultValue: true },
    { key: 'lazyLoad', label: '视口懒加载', type: 'switch', defaultValue: false },
    { key: 'preview', label: '点击预览', type: 'switch', defaultValue: true },
    { key: 'showLoading', label: '显示加载反馈', type: 'switch', defaultValue: true },
    { key: 'showError', label: '显示失败反馈', type: 'switch', defaultValue: true },
    { key: 'customLoading', label: '自定义加载内容', type: 'switch', defaultValue: false },
    { key: 'customError', label: '自定义失败内容', type: 'switch', defaultValue: false }
];
const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
const currentSrc = computed(() => {
    if (state.source === 'error') return '/static/not-found.png';
    return '/static/logo.png';
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
    return demoTitle('image', '图片');
});
const statusLabel = computed(() => {
    const labels: Record<LoadStatus, string> = {
        loading: isEnglish.value ? 'Loading' : '加载中',
        success: isEnglish.value ? 'Loaded successfully' : '加载成功',
        error: isEnglish.value ? 'Load failed' : '加载失败'
    };
    return labels[loadStatus.value];
});
const previewHint = computed(() => {
    if (!state.preview) return isEnglish.value ? 'Preview is disabled' : '图片预览已关闭';
    return loadStatus.value === 'success'
        ? isEnglish.value
            ? 'Tap the image to preview it'
            : '点击图片可预览'
        : isEnglish.value
          ? 'Preview becomes available after loading'
          : '加载成功后可预览';
});

function setLoadStatus(status: Extract<LoadStatus, 'success' | 'error'>) {
    loadStatus.value = status;
}
function reloadImage() {
    loadStatus.value = 'loading';
    imageRef.value?.reload();
}
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
    if (state.shape === 'circle' && (key === 'shape' || key === 'width' || key === 'height')) {
        const size = key === 'height' ? value : state.width;
        state.width = size;
        state.height = size;
    }
    if (key === 'source' || key === 'lazyLoad') loadStatus.value = 'loading';
}
</script>

<style scoped lang="scss">
.image-lab {
    display: flex;
    flex-direction: column;
    gap: 28rpx;
}
.image-lab__stage {
    display: flex;
    min-height: 360rpx;
    align-items: center;
    justify-content: center;
    padding: 32rpx;
    border-radius: 24rpx;
    background: linear-gradient(135deg, var(--snake-color-surface-muted), var(--snake-color-surface));
}
.image-lab__meta {
    display: flex;
    align-items: center;
    gap: 16rpx;
}
.image-lab__status {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    gap: 10rpx;
    color: var(--snake-color-text-muted);
    font-size: 24rpx;
}
.image-lab__status-dot {
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;
    background: currentcolor;
}
.image-lab__status--loading {
    color: var(--snake-color-primary);
}
.image-lab__status--success {
    color: var(--snake-color-success);
}
.image-lab__status--error {
    color: var(--snake-color-error);
}
.image-lab__hint {
    flex: 1;
    color: var(--snake-color-text-muted);
    font-size: 24rpx;
    line-height: 1.4;
}
.image-lab__retry {
    margin: 0;
    padding: 0 20rpx;
    color: var(--snake-color-primary);
    font-size: 24rpx;
    line-height: 52rpx;
    background: transparent;
}
.image-lab__retry::after {
    border: 0;
}
.image-lab__slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;
    font-size: 24rpx;
}
.image-lab__slot--loading {
    color: var(--snake-color-primary);
}
.image-lab__slot--error {
    color: var(--snake-color-error);
}
.image-notes {
    display: flex;
    flex-direction: column;
    gap: 14rpx;
    color: var(--snake-color-text-muted);
    font-size: 26rpx;
    line-height: 1.65;
}
</style>
