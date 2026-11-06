<template>
    <DemoPage :title="title" :desc="text('图片容器支持加载与失败占位、状态插槽、懒加载、预览、形状和裁剪模式。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-image-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Live preview' : '实时预览' }}</text>
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
                                    <snake-icon name="warning" size="20" />
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

                <text class="demo-variant-title">{{ isEnglish ? 'Placeholder states' : '占位状态' }}</text>
                <view class="demo-image-grid">
                    <view class="demo-image-cell">
                        <snake-image src="/static/logo.png" width="100%" height="96px" :radius="10" mode="aspectFill" />
                        <text class="demo-image-caption">{{ isEnglish ? 'Loaded' : '加载成功' }}</text>
                    </view>
                    <view class="demo-image-cell">
                        <snake-image src="/static/not-found.png" width="100%" height="96px" :radius="10" />
                        <text class="demo-image-caption">{{ isEnglish ? '404 placeholder' : '404 占位' }}</text>
                    </view>
                    <view class="demo-image-cell">
                        <snake-image width="100%" height="96px" :radius="10" />
                        <text class="demo-image-caption">{{ isEnglish ? 'Empty src' : '空地址占位' }}</text>
                    </view>
                    <view class="demo-image-cell">
                        <snake-image
                            src="/static/not-found.png"
                            error-img="/static/demo-cms-p-watch.png"
                            width="100%"
                            height="96px"
                            :radius="10"
                        />
                        <text class="demo-image-caption">{{ isEnglish ? 'Fallback artwork' : '失败回退图' }}</text>
                    </view>
                </view>

                <text class="demo-variant-title">{{ isEnglish ? 'Custom content' : '自定义内容' }}</text>
                <view class="demo-image-grid">
                    <view class="demo-image-cell">
                        <snake-image src="/static/not-found.png" width="100%" height="96px" :radius="10">
                            <template #error>
                                <view class="demo-image-slot demo-image-slot--error">
                                    <snake-icon name="warning" size="18" />
                                    <text>{{ isEnglish ? 'Unavailable' : '暂时不可用' }}</text>
                                </view>
                            </template>
                        </snake-image>
                        <text class="demo-image-caption">{{ isEnglish ? 'Error slot' : '自定义失败内容' }}</text>
                    </view>
                    <view class="demo-image-cell">
                        <snake-image
                            src="/static/logo.png"
                            width="100%"
                            height="96px"
                            :radius="10"
                            preview
                            :preview-urls="previewGallery"
                        />
                        <text class="demo-image-caption">{{ isEnglish ? 'Tap to preview' : '点击预览大图' }}</text>
                    </view>
                </view>

                <text class="demo-variant-title">{{ isEnglish ? 'Shape and fit' : '形状与裁剪' }}</text>
                <view class="demo-image-shapes">
                    <snake-image src="/static/logo.png" width="72px" height="72px" shape="circle" mode="aspectFill" />
                    <snake-image src="/static/logo.png" width="96px" height="72px" :radius="12" mode="aspectFill" />
                    <snake-image src="/static/logo.png" width="96px" height="72px" mode="aspectFit" />
                </view>
            </view>
        </DemoSection>

        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>

        <DemoSection :title="isEnglish ? 'Interaction notes' : '交互说明'">
            <view class="image-notes">
                <text>{{
                    text(
                        '失败时默认在浅灰占位块中显示 error-circle 图标，不叠加文案；需要文案或图文组合时使用 error 插槽。'
                    )
                }}</text>
                <text>{{ text('error-img 与 loading-img 自身请求失败时会回退到内置图标，不会停留在空白状态。') }}</text>
                <text>{{
                    text('切换资源地址可观察加载、成功、失败与空地址四种状态；失败后点击重新加载会重新发起请求。')
                }}</text>
                <text>{{ text('仅加载成功的图片可点击预览；形状与裁剪只影响容器内的呈现。') }}</text>
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

type LoadStatus = 'loading' | 'success' | 'error' | 'placeholder';

const { localeName, text } = useDemoLocale();
const imageRef = ref<ImageExpose>();
const loadStatus = ref<LoadStatus>('loading');
const previewGallery = ['/static/logo.png', '/static/demo-cms-p-watch.png', '/static/demo-cms-p-cup.png'];
const isEnglish = computed(() => localeName.value === 'en-US');
const controls: DemoControl[] = [
    {
        key: 'source',
        label: '图片资源',
        type: 'select',
        defaultValue: 'logo',
        options: [
            { label: '品牌图片', value: 'logo' },
            { label: '错误地址', value: 'error' },
            { label: '空地址', value: 'empty' }
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
    { key: 'width', label: '宽度', type: 'slider', defaultValue: 120, min: 60, max: 160, step: 5, unit: 'px' },
    { key: 'height', label: '高度', type: 'slider', defaultValue: 120, min: 60, max: 160, step: 5, unit: 'px' },
    { key: 'radius', label: '圆角尺寸', type: 'slider', defaultValue: 8, min: 0, max: 24, step: 2, unit: 'px' },
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
    if (state.source === 'empty') return '';
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
        success: isEnglish.value ? 'Loaded' : '加载成功',
        error: isEnglish.value ? 'Load failed' : '加载失败',
        placeholder: isEnglish.value ? 'Placeholder' : '占位显示'
    };
    return labels[loadStatus.value];
});
const previewHint = computed(() => {
    if (!state.preview) return isEnglish.value ? 'Preview is disabled' : '图片预览已关闭';
    if (loadStatus.value === 'success') return isEnglish.value ? 'Tap the image to preview it' : '点击图片可预览';
    if (loadStatus.value === 'placeholder')
        return isEnglish.value ? 'No preview for an empty source' : '空地址没有可预览的图片';
    return isEnglish.value ? 'Preview becomes available after loading' : '加载成功后可预览';
});

function setLoadStatus(status: Extract<LoadStatus, 'success' | 'error'>) {
    loadStatus.value = status;
}
function reloadImage() {
    loadStatus.value = state.source === 'empty' ? 'placeholder' : 'loading';
    imageRef.value?.reload();
}
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
    if (state.shape === 'circle' && (key === 'shape' || key === 'width' || key === 'height')) {
        const size = key === 'height' ? value : state.width;
        state.width = size;
        state.height = size;
    }
    if (key === 'source' || key === 'lazyLoad') {
        loadStatus.value = state.source === 'empty' ? 'placeholder' : 'loading';
    }
}
</script>

<style scoped lang="scss">
.demo-stack {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.demo-variant-title {
    color: var(--snake-color-text);
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
}
.image-lab {
    display: flex;
    flex-direction: column;
    gap: 14px;
}
.image-lab__stage {
    display: flex;
    min-height: 180px;
    align-items: center;
    justify-content: center;
    padding: 16px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--snake-color-surface-muted), var(--snake-color-surface));
}
.image-lab__meta {
    display: flex;
    align-items: center;
    gap: 8px;
}
.image-lab__status {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    gap: 5px;
    color: var(--snake-color-text-muted);
    font-size: 12px;
}
.image-lab__status-dot {
    width: 6px;
    height: 6px;
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
.image-lab__status--placeholder {
    color: var(--snake-color-text-muted);
}
.image-lab__hint {
    flex: 1;
    color: var(--snake-color-text-muted);
    font-size: 12px;
    line-height: 1.4;
}
.image-lab__retry {
    margin: 0;
    padding: 0 10px;
    color: var(--snake-color-primary);
    font-size: 12px;
    line-height: 26px;
    background: transparent;
}
.image-lab__retry::after {
    border: 0;
}
.image-lab__slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    font-size: 12px;
}
.image-lab__slot--loading {
    color: var(--snake-color-primary);
}
.image-lab__slot--error {
    color: var(--snake-color-error);
}
.demo-image-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
}
.demo-image-cell {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.demo-image-caption {
    color: var(--snake-color-text-muted);
    font-size: 11px;
    line-height: 1.4;
}
.demo-image-slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    font-size: 12px;
}
.demo-image-slot--error {
    color: var(--snake-color-error);
}
.demo-image-shapes {
    display: flex;
    align-items: center;
    gap: 14px;
}
.image-notes {
    display: flex;
    flex-direction: column;
    gap: 7px;
    color: var(--snake-color-text-muted);
    font-size: 13px;
    line-height: 1.65;
}
</style>
