<template>
    <DemoPage :title="title" :desc="text('全屏图片裁剪：拖拽、双指缩放、90° 旋转，确认后导出临时文件。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-cropper-showcase">
                <view class="demo-cropper-preview" @click="openCropper">
                    <image v-if="resultSrc" class="demo-cropper-preview__img" :src="resultSrc" mode="aspectFill" />
                    <view v-else class="demo-cropper-preview__empty">
                        <snake-icon name="photo" :size="24" color="var(--snake-color-text-muted)" />
                        <text class="demo-cropper-preview__hint">{{ text('点击选择并裁剪') }}</text>
                    </view>
                </view>
                <view class="demo-cropper-meta">
                    <text class="demo-cropper-meta__tag">{{ formatLabel }}</text>
                    <text>{{ sizeLabel }}</text>
                </view>
                <view class="demo-cropper-actions">
                    <snake-button type="primary" size="small" :text="text('选择图片')" @click="chooseImage" />
                    <snake-button size="small" :text="text('用示例图')" @click="useSample" />
                    <snake-button size="small" plain :text="text('重新裁剪')" @click="openCropper" />
                </view>
                <text class="demo-variant-sub">
                    {{ text('确认后回填的地址就是导出结果：H5 为 base64，小程序为临时文件路径') }}
                </text>
            </view>
        </DemoSection>

        <DemoSection variant="preview" :title="text('裁剪比例')">
            <view class="demo-cropper-ratios">
                <snake-button
                    v-for="ratio in ratioOptions"
                    :key="ratio.value"
                    size="small"
                    :plain="state.cRatio !== ratio.value"
                    :text="ratio.label"
                    @click="cropWith(ratio.value)"
                />
            </view>
            <text class="demo-variant-sub">
                {{ text('比例只决定裁剪框形状；图片始终会被拉到铺满裁剪框，超出部分靠拖动和缩放取舍') }}
            </text>
        </DemoSection>

        <DemoSection variant="preview" :title="text('实例方法')">
            <view class="demo-cropper-actions">
                <snake-button size="small" :text="text('旋转 90°')" @click="rotateBy90" />
                <snake-button size="small" :text="text('重置')" @click="resetCropper" />
            </view>
            <text class="demo-variant-sub">
                {{ text('setRotate 与 reset 通过 ref 调用，只在裁剪器打开时看得出效果') }}
            </text>
        </DemoSection>

        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>

        <snake-image-cropper
            ref="cropperRef"
            v-model="cropperVisible"
            :src="cropperSrc"
            :aspect-ratio="state.cRatio"
            :max-scale="maxScaleValue"
            :export-scale="exportScaleValue"
            :file-type="state.cFormat"
            :disabled-rotate="state.cRotateOff"
            @confirm="onConfirm"
        />
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { demoState, setDemoValue } from '../../../common/demo-state';
import { demoTitle, localizeDemoControls, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
import type {
    ImageCropperExpose,
    ImageCropperResult
} from '../../../uni_modules/snake-ui/components/snake-image-cropper/types';

const { text } = useDemoLocale();

/** 比例按钮与控件共用同一组取值，避免两处各写一份。 */
const ratioOptions = [
    { label: '1:1', value: '1:1' },
    { label: '4:3', value: '4:3' },
    { label: '3:2', value: '3:2' },
    { label: '16:9', value: '16:9' }
] as const;

const controls = [
    {
        key: 'cRatio',
        label: '裁剪比例',
        type: 'select',
        defaultValue: '1:1',
        options: ratioOptions
    },
    {
        key: 'cScale',
        label: '最大放大倍数',
        type: 'slider',
        defaultValue: 3,
        min: 2,
        max: 5,
        step: 1,
        unit: 'x'
    },
    {
        key: 'cExport',
        label: '导出倍数',
        type: 'select',
        defaultValue: '2',
        options: [
            { label: '1x', value: '1' },
            { label: '2x', value: '2' },
            { label: '3x', value: '3' }
        ]
    },
    {
        key: 'cFormat',
        label: '导出格式',
        type: 'select',
        defaultValue: 'png',
        options: [
            { label: 'PNG', value: 'png' },
            { label: 'JPG', value: 'jpg' }
        ]
    },
    { key: 'cRotateOff', label: '禁用旋转', type: 'switch', defaultValue: false }
] as const satisfies readonly DemoControl[];
const state = demoState(controls);

const cropperRef = ref<ImageCropperExpose | null>(null);
const cropperVisible = ref(false);
/** 待裁剪的地址：来自相册或示例图。 */
const cropperSrc = ref('');
/** 上一次的裁剪结果。 */
const resultSrc = ref('');
const resultSize = ref('');
/** 旋转累计步数：setRotate 收的是绝对角度，按钮需要自己累加。 */
const rotateStep = ref(0);

const maxScaleValue = computed(() => Number(state.cScale) || 3);
const exportScaleValue = computed(() => Number(state.cExport) || 2);
const formatLabel = computed(() => String(state.cFormat).toUpperCase());
const sizeLabel = computed(() => resultSize.value || text('尚未裁剪'));
const localizedControls = computed(() => localizeDemoControls(controls));
const title = computed(() => demoTitle('image-cropper', '图片裁剪'));

function updateValue(key: string, value: DemoValue) {
    setDemoValue(state, key, value);
}

function openCropper() {
    if (!cropperSrc.value) {
        chooseImage();
        return;
    }
    rotateStep.value = 0;
    cropperVisible.value = true;
}

function chooseImage() {
    uni.chooseImage({
        count: 1,
        success: res => {
            const path = Array.isArray(res.tempFilePaths) ? res.tempFilePaths[0] : '';
            if (!path) return;
            cropperSrc.value = path;
            rotateStep.value = 0;
            cropperVisible.value = true;
        }
    });
}

/** 没有相册权限或只想看效果时用本地示例图。 */
function useSample() {
    cropperSrc.value = '/static/logo.png';
    rotateStep.value = 0;
    cropperVisible.value = true;
}

function cropWith(ratio: string) {
    updateValue('cRatio', ratio);
    openCropper();
}

function onConfirm(result: ImageCropperResult) {
    resultSrc.value = result.tempFilePath;
    resultSize.value = `${result.width} × ${result.height} px · ${formatLabel.value}`;
}

function rotateBy90() {
    rotateStep.value += 1;
    cropperRef.value?.setRotate(rotateStep.value * 90);
}

function resetCropper() {
    rotateStep.value = 0;
    cropperRef.value?.reset();
}
</script>

<style scoped>
.demo-cropper-showcase {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
}
.demo-cropper-preview {
    display: flex;
    width: 120px;
    height: 120px;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 10px;
    background: var(--snake-color-surface-muted);
}
.demo-cropper-preview__img {
    width: 100%;
    height: 100%;
}
.demo-cropper-preview__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}
.demo-cropper-preview__hint {
    color: var(--snake-color-text-muted);
    font-size: 12px;
}
.demo-cropper-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--snake-color-text-muted);
    font-size: 12px;
}
.demo-cropper-meta__tag {
    padding: 2px 8px;
    border-radius: 10px;
    background-color: var(--snake-color-primary-light);
    color: var(--snake-color-primary);
    font-size: 12px;
    line-height: 1.5;
}
.demo-cropper-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
}
.demo-cropper-ratios {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 10px;
}
</style>
