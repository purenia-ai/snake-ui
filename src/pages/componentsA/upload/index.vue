<template>
    <DemoPage :title="title" :desc="text('支持图片、视频和普通文件，可接入业务接口或 OSS 等自定义上传服务。')">
        <DemoSection variant="preview" :title="text('实时预览')">
            <view class="demo-upload-showcase">
                <view class="demo-upload-status">
                    <view v-for="stat in queueStats" :key="stat.key" class="demo-upload-status__item">
                        <text class="demo-upload-status__value" :style="{ color: stat.color }">{{ stat.value }}</text>
                        <text class="demo-upload-status__label">{{ text(stat.label) }}</text>
                    </view>
                </view>
                <text class="demo-variant-caption">{{ eventText }}</text>

                <view v-if="Boolean(state.disabled)" class="demo-upload-placeholder">
                    <snake-icon name="info-circle" size="16" color="var(--snake-color-text-muted)" />
                    <text class="demo-upload-placeholder__text">{{ text('禁用时组件不渲染任何内容') }}</text>
                </view>
                <snake-upload
                    v-else
                    ref="previewUploadRef"
                    :key="acceptType"
                    v-model="previewFiles"
                    :accept="acceptType"
                    :mode="String(state.mode)"
                    :image-shape="String(state.imageShape)"
                    :max-count="Number(state.maxCount)"
                    :auto-upload="Boolean(state.autoUpload)"
                    :show-file-size="Boolean(state.showFileSize)"
                    :show-progress="Boolean(state.showProgress)"
                    :deletable="Boolean(state.deletable)"
                    :upload-text="String(state.uploadText)"
                    :upload-request="successUploadRequest"
                    :max-duration="60"
                    width="100"
                    height="100"
                    @on-success="logEvent('success')"
                    @on-error="logEvent('error')"
                    @on-remove="logEvent('remove')"
                    @on-preview="logEvent('preview')"
                    @on-uploaded="logUploaded"
                    @on-oversize="logEvent('oversize')"
                    @on-exceed="logEvent('exceed')"
                />

                <view class="demo-upload-actions">
                    <snake-button
                        class="demo-upload-action"
                        size="small"
                        :disabled="Boolean(state.disabled)"
                        @tap="addPreviewSamples"
                    >
                        {{ text('添加示例文件') }}
                    </snake-button>
                    <snake-button
                        class="demo-upload-action"
                        size="small"
                        :disabled="Boolean(state.disabled) || previewFiles.length === 0"
                        @tap="clearPreview"
                    >
                        {{ text('清空列表') }}
                    </snake-button>
                </view>
                <text class="demo-variant-caption">{{
                    text('点击格子右上角删除会弹出确认框，点击已上传内容可以预览。')
                }}</text>
            </view>
        </DemoSection>

        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>

        <DemoSection
            :title="text('校验与拦截')"
            :description="text('入队时校验类型、大小和数量，不合规的文件会被拒绝并提示。')"
        >
            <view class="demo-upload-block">
                <snake-upload
                    ref="guardUploadRef"
                    v-model="guardFiles"
                    accept="image"
                    :limit-type="guardLimitType"
                    :max-size="guardMaxSize"
                    :max-count="3"
                    :auto-upload="false"
                    :custom-choose="true"
                    :show-file-size="true"
                    :before-choose="beforeChooseGuard"
                    :before-preview="beforePreviewGuard"
                    width="92"
                    height="92"
                    @on-choose="handleCustomChoose"
                    @on-oversize="logEvent('oversize')"
                    @on-exceed="logEvent('exceed')"
                    @on-preview="logEvent('preview')"
                />
                <view class="demo-upload-chips">
                    <view
                        v-for="sample in guardSamples"
                        :key="sample.key"
                        class="demo-upload-chip"
                        hover-class="demo-upload-chip--hover"
                        @click="addGuardSample(sample.key)"
                    >
                        <text>{{ text(sample.label) }}</text>
                    </view>
                </view>
                <text class="demo-variant-caption">{{ guardHint }}</text>

                <view class="demo-upload-switch">
                    <text class="demo-upload-switch__label">{{ text('拦截选择') }}</text>
                    <snake-switch
                        :model-value="guardBlockChoose"
                        :size="24"
                        @update:model-value="guardBlockChoose = Boolean($event)"
                    />
                </view>
                <view class="demo-upload-switch">
                    <text class="demo-upload-switch__label">{{ text('拦截预览') }}</text>
                    <snake-switch
                        :model-value="guardBlockPreview"
                        :size="24"
                        @update:model-value="guardBlockPreview = Boolean($event)"
                    />
                </view>
                <text class="demo-variant-caption">
                    {{ text('选择入口已交给业务接管（custom-choose），点中间的加号不会打开系统选择器。') }}
                </text>
            </view>
        </DemoSection>

        <DemoSection
            :title="text('手动上传与取消')"
            :description="text('关闭自动上传后由业务控制上传时机，失败项可以重试，进行中的上传可以取消。')"
        >
            <view class="demo-upload-block">
                <view class="demo-upload-outcomes">
                    <view
                        v-for="option in outcomeOptions"
                        :key="option.key"
                        class="demo-upload-outcome"
                        :class="{ 'demo-upload-outcome--active': manualOutcome === option.key }"
                        @click="manualOutcome = option.key"
                    >
                        <text>{{ text(option.label) }}</text>
                    </view>
                </view>
                <snake-upload
                    ref="manualUploadRef"
                    v-model="manualFiles"
                    accept="image"
                    :upload-request="manualUploadRequest"
                    :auto-upload="false"
                    :max-count="3"
                    :show-file-size="true"
                    :show-confirm="false"
                    width="92"
                    height="92"
                    @on-success="logEvent('success')"
                    @on-error="logEvent('error')"
                    @on-uploaded="logUploaded"
                />
                <view class="demo-upload-actions">
                    <snake-button class="demo-upload-action" size="small" @tap="addManualSamples">
                        {{ text('添加示例文件') }}
                    </snake-button>
                    <snake-button
                        class="demo-upload-action"
                        size="small"
                        :disabled="manualFiles.length === 0 || manualHasUploading"
                        @tap="startManualUpload"
                    >
                        {{ text('开始上传') }}
                    </snake-button>
                    <snake-button
                        class="demo-upload-action"
                        size="small"
                        :disabled="!manualHasUploading"
                        @tap="cancelManualUpload"
                    >
                        {{ text('取消上传') }}
                    </snake-button>
                    <snake-button
                        class="demo-upload-action"
                        size="small"
                        :disabled="!manualHasFailure"
                        @tap="retryManualUpload"
                    >
                        {{ text('全部重试') }}
                    </snake-button>
                </view>
                <text class="demo-variant-caption">{{ manualHint }}</text>
            </view>
        </DemoSection>

        <DemoSection
            :title="text('自定义按钮与列表')"
            :description="text('选择入口和文件列表都可以换成业务自己的实现。')"
        >
            <view class="demo-upload-block">
                <text class="demo-variant-title">{{ text('自定义上传按钮') }}</text>
                <snake-upload
                    v-model="customButtonFiles"
                    accept="image"
                    :upload-request="successUploadRequest"
                    :custom-btn="true"
                    :max-count="3"
                    :show-file-size="true"
                    width="92"
                    height="92"
                >
                    <template #addBtn>
                        <view class="custom-upload-button" hover-class="custom-upload-button--hover">
                            <snake-icon name="photo" size="22" color="var(--snake-color-primary)" />
                            <text class="custom-upload-button__text">{{ text('选择图片') }}</text>
                        </view>
                    </template>
                </snake-upload>

                <text class="demo-variant-title">{{ text('自定义文件列表') }}</text>
                <snake-upload
                    ref="customListUploadRef"
                    v-model="customListFiles"
                    accept="file"
                    mode="list"
                    :show-upload-list="false"
                    :custom-btn="true"
                    :max-count="5"
                >
                    <template #file="{ file }">
                        <view class="custom-file-list">
                            <view v-for="(item, index) in file" :key="`${item.name}-${index}`" class="custom-file">
                                <view class="custom-file__icon">
                                    <snake-icon name="file-text" size="17" color="var(--snake-color-primary)" />
                                </view>
                                <view class="custom-file__content">
                                    <text class="custom-file__name">{{ item.name || text('未命名文件') }}</text>
                                    <text class="custom-file__meta">{{ formatFileSize(item.size) }}</text>
                                    <view
                                        v-if="item.progress !== undefined && item.progress > 0 && item.progress < 100"
                                        class="custom-file__progress"
                                    >
                                        <snake-line-progress
                                            :percent="item.progress"
                                            :show-percent="false"
                                            height="2"
                                        />
                                    </view>
                                </view>
                                <view class="custom-file__status">
                                    <snake-icon
                                        :name="item.error ? 'close-circle' : 'checkmark-circle'"
                                        size="16"
                                        :color="item.error ? 'var(--snake-color-error)' : 'var(--snake-color-success)'"
                                    />
                                </view>
                                <view class="custom-file__delete" @tap.stop="removeCustomFile(index)">
                                    <snake-icon name="trash" size="15" color="var(--snake-color-text-muted)" />
                                </view>
                            </view>
                        </view>
                    </template>
                    <template #addBtn>
                        <view class="custom-file-add" hover-class="custom-file-add--hover">
                            <snake-icon name="plus" size="15" color="var(--snake-color-primary)" />
                            <text>{{ text('添加文件') }}</text>
                        </view>
                    </template>
                </snake-upload>
            </view>
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
import type { UploadAcceptType, UploadExpose, UploadFileItem, UploadRequest } from '../../../uni_modules/snake-ui';

const { localeName, text } = useDemoLocale();

const demoImage = 'https://cdn.puresnake.com/joker/recycle/like.png';
const demoVideo = '/static/demo-flower.mp4';
// 示例文件轮换本地静态图，避免多张格子缩略图重复。
const sampleImages = [
    '/static/demo-cms-p-cup.png',
    '/static/demo-cms-p-watch.png',
    '/static/demo-cms-p-bag.png',
    '/static/demo-cms-p-headphones.png'
];
let imageCursor = 0;
function nextSampleImage(): string {
    const url = sampleImages[imageCursor % sampleImages.length];
    imageCursor += 1;
    return url;
}

type UploadOutcome = 'success' | 'failure' | 'slow';
type DemoEventKey =
    | 'success'
    | 'error'
    | 'remove'
    | 'preview'
    | 'uploaded'
    | 'cancelled'
    | 'oversize'
    | 'exceed'
    | 'choose'
    | 'blocked-choose'
    | 'blocked-preview';

const eventLabels: Record<DemoEventKey, string> = {
    success: '上传成功',
    error: '上传失败',
    remove: '移除文件',
    preview: '预览文件',
    uploaded: '全部上传完成',
    cancelled: '上传已取消',
    oversize: '超出大小限制',
    exceed: '超出数量限制',
    choose: '选择完成',
    'blocked-choose': '选择已拦截',
    'blocked-preview': '预览已拦截'
};

const controls: DemoControl[] = [
    {
        key: 'accept',
        label: '文件类别',
        type: 'select',
        defaultValue: 'image',
        options: [
            { label: '图片', value: 'image' },
            { label: '视频', value: 'video' },
            { label: '文件', value: 'file' }
        ]
    },
    {
        key: 'mode',
        label: '展示模式',
        type: 'select',
        defaultValue: 'grid',
        options: [
            { label: '宫格', value: 'grid' },
            { label: '列表', value: 'list' }
        ]
    },
    {
        key: 'imageShape',
        label: '图片形状',
        type: 'select',
        defaultValue: 'square',
        options: [
            { label: '方形', value: 'square' },
            { label: '圆形', value: 'circle' }
        ]
    },
    { key: 'maxCount', label: '最大数量', type: 'slider', defaultValue: 6, min: 2, max: 8, step: 1, unit: '个' },
    {
        key: 'uploadText',
        label: '上传提示',
        type: 'input',
        defaultValue: '',
        placeholder: '留空则按文件类别自动生成'
    },
    { key: 'showProgress', label: '显示进度', type: 'switch', defaultValue: true },
    { key: 'deletable', label: '可删除', type: 'switch', defaultValue: true },
    { key: 'showFileSize', label: '显示文件大小', type: 'switch', defaultValue: false },
    { key: 'autoUpload', label: '自动上传', type: 'switch', defaultValue: true },
    { key: 'disabled', label: '禁用组件', type: 'switch', defaultValue: false }
];

const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({
        ...control,
        label: text(control.label),
        options: control.options?.map(option => ({ ...option, label: text(option.label) }))
    }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('upload', '文件上传');
});
const acceptType = computed(() => String(state.accept) as UploadAcceptType);

const eventKey = ref<DemoEventKey | ''>('');
const eventText = computed(() => {
    const label = text('最近事件');
    const value = eventKey.value ? text(eventLabels[eventKey.value]) : '-';
    return localeName.value === 'en-US' ? `${label}: ${value}` : `${label}：${value}`;
});

function logEvent(key: DemoEventKey) {
    eventKey.value = key;
}

/** 一轮上传结束时区分三种结果：有失败、被取消、全部成功。 */
function logUploaded(files: UploadFileItem[]) {
    if (files.some(file => file.error)) eventKey.value = 'error';
    else if (files.some(file => file.status !== 'success')) eventKey.value = 'cancelled';
    else eventKey.value = 'uploaded';
}

function delay(duration: number) {
    return new Promise<void>(resolve => setTimeout(resolve, duration));
}

/** 演示上传适配器；真实项目可在此获取 STS 并上传到 OSS、COS 或业务服务器。 */
function createUploadRequest(outcome: () => UploadOutcome = () => 'success'): UploadRequest {
    return async (file, { onProgress, registerAbort }) => {
        let aborted = false;
        registerAbort(() => {
            aborted = true;
        });
        const slow = outcome() === 'slow';
        const steps = slow ? [12, 26, 40, 54, 68, 82] : [30, 70];
        await delay(slow ? 200 : 120);
        for (const step of steps) {
            if (aborted) break;
            await delay(slow ? 420 : 180);
            if (aborted) break;
            onProgress(step);
        }
        if (outcome() === 'failure') throw new Error('demo upload failure');
        return { url: file.path || file.url || demoImage, response: { provider: 'demo-storage', success: true } };
    };
}

const successUploadRequest = createUploadRequest();

const successfulFile = (name: string, size: number, fileType: 'image' | 'video' | 'file', url: string) => ({
    url,
    name,
    size,
    fileType,
    status: 'success' as const,
    progress: 100,
    error: false
});

const defaultFiles = (accept: DemoValue): UploadFileItem[] => {
    if (accept === 'file') {
        return [successfulFile('组件设计说明.pdf', 2.4 * 1024 * 1024, 'file', 'https://example.com/design.pdf')];
    }
    if (accept === 'video') return [];
    return [successfulFile('snake-ui.png', 86 * 1024, 'image', demoImage)];
};

let sampleSeed = 0;
function sampleFile(accept: UploadAcceptType): UploadFileItem {
    sampleSeed += 1;
    if (accept === 'video') {
        return { path: demoVideo, name: `snake-ui-${sampleSeed}.mp4`, size: 8.4 * 1024 * 1024 };
    }
    if (accept === 'file') {
        return { path: 'https://example.com/design.pdf', name: `snake-ui-${sampleSeed}.pdf`, size: 2.4 * 1024 * 1024 };
    }
    return { path: nextSampleImage(), name: `snake-ui-${sampleSeed}.png`, size: (120 + sampleSeed * 37) * 1024 };
}

/* 实时预览 */
const previewUploadRef = ref<UploadExpose | null>(null);
const previewFiles = ref<UploadFileItem[]>(defaultFiles('image'));

const queueStats = computed(() => {
    const files = previewFiles.value;
    const failed = files.filter(file => file.error).length;
    const success = files.filter(file => !file.error && (file.status === 'success' || file.progress === 100)).length;
    const uploading = files.filter(file => !file.error && file.status === 'uploading').length;
    return [
        { key: 'total', label: '总数', value: files.length, color: 'var(--snake-color-text)' },
        { key: 'uploading', label: '上传中', value: uploading, color: 'var(--snake-color-primary)' },
        { key: 'success', label: '成功', value: success, color: 'var(--snake-color-success)' },
        { key: 'failed', label: '失败', value: failed, color: 'var(--snake-color-error)' }
    ];
});

function addPreviewSamples() {
    previewUploadRef.value?.addFiles([sampleFile(acceptType.value), sampleFile(acceptType.value)]);
}

function clearPreview() {
    previewUploadRef.value?.clear();
    previewFiles.value = [];
    eventKey.value = '';
}

function updateValue(key: string, value: DemoValue) {
    state[key] = value;
    // 切换文件类别后，原列表里的示例文件不再匹配，重置为对应的默认内容。
    if (key === 'accept') {
        previewFiles.value = defaultFiles(value);
        eventKey.value = '';
    }
}

/* 校验与拦截 */
const guardUploadRef = ref<UploadExpose | null>(null);
const guardFiles = ref<UploadFileItem[]>([]);
const guardBlockChoose = ref(false);
const guardBlockPreview = ref(false);
const guardMaxSize = 2 * 1024 * 1024;
const guardLimitType = ['png', 'jpg', 'jpeg'];
const guardHint = ref('');

type GuardSampleKey = 'ok' | 'oversize' | 'wrongType' | 'batch';

const guardSamples: Array<{ key: GuardSampleKey; label: string }> = [
    { key: 'ok', label: '合规图片' },
    { key: 'oversize', label: '8 MB 图片' },
    { key: 'wrongType', label: 'PDF 文件' },
    { key: 'batch', label: '一次 4 张' }
];

const guardHints: Record<GuardSampleKey, string> = {
    ok: '合规图片已入队，等待手动上传',
    oversize: '超过 2 MB 的文件不会入队，并触发 on-oversize',
    wrongType: '不在 limit-type 里的后缀会被跳过，并 toast 提示',
    batch: '超出 max-count 的部分触发 on-exceed'
};

function guardFile(key: GuardSampleKey): UploadFileItem {
    sampleSeed += 1;
    if (key === 'oversize') {
        return { path: nextSampleImage(), name: `oversize-${sampleSeed}.png`, size: 8 * 1024 * 1024 };
    }
    if (key === 'wrongType') {
        return { path: 'https://example.com/design.pdf', name: `contract-${sampleSeed}.pdf`, size: 512 * 1024 };
    }
    return { path: nextSampleImage(), name: `guard-${sampleSeed}.png`, size: 320 * 1024 };
}

function addGuardSample(key: GuardSampleKey) {
    const files = key === 'batch' ? Array.from({ length: 4 }, () => guardFile('ok')) : [guardFile(key)];
    guardUploadRef.value?.addFiles(files);
    guardHint.value = text(guardHints[key]);
}

function handleCustomChoose() {
    // 开启 custom-choose 后由业务接管选择：这里用示例文件模拟业务选到的内容。
    guardUploadRef.value?.addFiles([guardFile('ok')]);
    guardHint.value = text('已通过 on-choose 加入 1 张示例图片');
    logEvent('choose');
}

function beforeChooseGuard(): boolean {
    if (!guardBlockChoose.value) return true;
    logEvent('blocked-choose');
    uni.showToast({ title: text('已拦截本次选择'), icon: 'none' });
    return false;
}

function beforePreviewGuard(): boolean {
    if (!guardBlockPreview.value) return true;
    logEvent('blocked-preview');
    uni.showToast({ title: text('已拦截本次预览'), icon: 'none' });
    return false;
}

/* 手动上传与取消 */
const manualUploadRef = ref<UploadExpose | null>(null);
const manualFiles = ref<UploadFileItem[]>([]);
const manualOutcome = ref<UploadOutcome>('success');
const manualUploadRequest = createUploadRequest(() => manualOutcome.value);
const outcomeOptions: Array<{ key: UploadOutcome; label: string }> = [
    { key: 'success', label: '正常' },
    { key: 'failure', label: '失败' },
    { key: 'slow', label: '慢速' }
];
const manualHints: Record<UploadOutcome, string> = {
    success: '添加示例文件后点「开始上传」，成功后进度条消失',
    failure: '失败的文件会停在格子上，切回「正常」后点格子里的重试即可成功',
    slow: '慢速模式便于观察进度条，点「取消上传」可让进度归零并回到待上传'
};
const manualHint = computed(() => text(manualHints[manualOutcome.value]));
const manualHasUploading = computed(() => manualFiles.value.some(file => file.status === 'uploading'));
const manualHasFailure = computed(() => manualFiles.value.some(file => file.error));

function addManualSamples() {
    manualUploadRef.value?.addFiles([sampleFile('image')]);
}

function startManualUpload() {
    manualUploadRef.value?.upload();
}

function cancelManualUpload() {
    manualUploadRef.value?.abort();
}

function retryManualUpload() {
    manualUploadRef.value?.reUpload();
}

/* 自定义按钮与列表 */
const customButtonFiles = ref<UploadFileItem[]>([]);
const customListUploadRef = ref<UploadExpose | null>(null);
const customListFiles = ref<UploadFileItem[]>([
    successfulFile('季度产品报告.pdf', 3.2 * 1024 * 1024, 'file', 'https://example.com/report.pdf'),
    successfulFile('组件接口清单.docx', 468 * 1024, 'file', 'https://example.com/component-spec.docx')
]);

function removeCustomFile(index: number) {
    customListUploadRef.value?.remove(index);
}

function formatFileSize(bytes?: number) {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
</script>

<style scoped>
.demo-upload-showcase,
.demo-upload-block {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.demo-variant-caption {
    color: var(--snake-color-text-secondary);
    font-size: 12px;
    line-height: 1.6;
}

.demo-upload-status {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 6px;
    padding: 10px 6px;
    border-radius: 8px;
    background: var(--snake-color-surface-muted);
}

.demo-upload-status__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
}

.demo-upload-status__value {
    font-size: 16px;
    font-weight: 700;
    line-height: 1.2;
}

.demo-upload-status__label {
    color: var(--snake-color-text-muted);
    font-size: 11px;
}

.demo-upload-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 22px 10px;
    border: 1px dashed var(--snake-color-divider);
    border-radius: 8px;
}

.demo-upload-placeholder__text {
    color: var(--snake-color-text-muted);
    font-size: 12.5px;
}

.demo-upload-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
}

.demo-upload-action {
    width: 100%;
}

.demo-upload-chips {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
}

.demo-upload-chip {
    display: flex;
    min-height: 32px;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    border: 1px solid var(--snake-color-divider);
    border-radius: 7px;
    color: var(--snake-color-text-secondary);
    font-size: 12px;
    line-height: 1.3;
    background: var(--snake-color-surface);
}

.demo-upload-chip--hover {
    background: var(--snake-color-surface-muted);
}

.demo-upload-outcomes {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
}

.demo-upload-outcome {
    display: flex;
    height: 32px;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--snake-color-divider);
    border-radius: 7px;
    color: var(--snake-color-text-secondary);
    font-size: 12px;
    line-height: 1;
    background: var(--snake-color-surface);
}

.demo-upload-outcome--active {
    border-color: var(--snake-color-primary);
    color: var(--snake-color-primary-ink);
    font-weight: 600;
    background: var(--snake-color-primary);
}

.demo-upload-switch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 6px 0;
}

.demo-upload-switch__label {
    color: var(--snake-color-text-secondary);
    font-size: 12.5px;
}

.custom-upload-button {
    display: flex;
    width: 92px;
    height: 92px;
    box-sizing: border-box;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 7px;
    margin: 5px;
    border: 1px dashed var(--snake-color-border);
    border-radius: 8px;
    background: var(--snake-color-surface-muted);
}

.custom-upload-button--hover,
.custom-file-add--hover {
    opacity: 0.72;
}

.custom-upload-button__text {
    color: var(--snake-color-text-secondary);
    font-size: 12px;
}

.custom-file-list {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 10px;
}

.custom-file {
    display: flex;
    min-width: 0;
    align-items: center;
    padding: 11px;
    border: 1px solid var(--snake-color-border);
    border-radius: 4px;
    background: var(--snake-color-surface);
}

.custom-file__icon {
    display: flex;
    width: 32px;
    height: 32px;
    flex: 0 0 32px;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    background: var(--snake-color-disabled-bg, #f4f5f6);
}

.custom-file__content {
    min-width: 0;
    flex: 1;
    margin-left: 9px;
}

.custom-file__name,
.custom-file__meta {
    display: block;
}

.custom-file__name {
    overflow: hidden;
    color: var(--snake-color-text);
    font-size: 13px;
    line-height: 1.5;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.custom-file__meta {
    margin-top: 2px;
    color: var(--snake-color-text-muted);
    font-size: 11px;
}

.custom-file__progress {
    margin-top: 5px;
}

.custom-file__status,
.custom-file__delete {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    margin-left: 9px;
}

.custom-file__delete {
    padding: 4px;
}

.custom-file-add {
    display: inline-flex;
    min-height: 36px;
    align-items: center;
    justify-content: center;
    padding: 0 13px;
    border: 1px solid var(--snake-color-border);
    border-radius: 5px;
    color: var(--snake-color-primary);
    background: var(--snake-color-surface);
    font-size: 12.5px;
    gap: 5px;
}
</style>
