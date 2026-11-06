<template>
    <DemoPage :title="title" :desc="text('支持图片、视频和普通文件，可接入业务接口或 OSS 等自定义上传服务。')">
        <DemoSection variant="preview" :title="text('实时预览')">
            <view class="upload-live">
                <snake-upload
                    v-model="previewFiles"
                    :accept="String(state.accept)"
                    :mode="String(state.mode)"
                    :max-count="Number(state.maxCount)"
                    :auto-upload="Boolean(state.autoUpload)"
                    :show-file-size="Boolean(state.showFileSize)"
                    :upload-text="String(state.uploadText)"
                    :upload-request="mockUpload"
                    :max-duration="60"
                    width="100"
                    height="100"
                />
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
        <DemoSection :title="text('手动上传')">
            <snake-upload
                ref="manualUploadRef"
                v-model="manualFiles"
                accept="image"
                :upload-request="mockUpload"
                :auto-upload="false"
                :max-count="3"
                width="100"
                height="100"
            />
            <view class="upload-actions">
                <snake-button type="primary" :disabled="manualFiles.length === 0" @tap="startManualUpload">
                    {{ text('开始上传') }}
                </snake-button>
                <snake-button :disabled="manualFiles.length === 0" @tap="clearManualFiles">
                    {{ text('清空列表') }}
                </snake-button>
            </view>
        </DemoSection>
        <DemoSection :title="text('自定义上传按钮')">
            <snake-upload
                v-model="customButtonFiles"
                accept="image"
                :upload-request="mockUpload"
                :custom-btn="true"
                :max-count="3"
                width="100"
                height="100"
            >
                <template #addBtn>
                    <view class="custom-upload-button" hover-class="custom-upload-button--hover">
                        <snake-icon name="photo" size="22" color="var(--snake-color-primary)" />
                        <text class="custom-upload-button__text">{{ text('选择图片') }}</text>
                    </view>
                </template>
            </snake-upload>
        </DemoSection>
        <DemoSection :title="text('自定义文件列表')">
            <snake-upload
                ref="customListUploadRef"
                v-model="customListFiles"
                accept="file"
                mode="list"
                :upload-request="mockUpload"
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
                                    <snake-line-progress :percent="item.progress" :show-percent="false" height="2" />
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
import type { UploadExpose, UploadFileItem, UploadRequest } from '../../../uni_modules/snake-ui';

const { localeName, text } = useDemoLocale();
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
    { key: 'maxCount', label: '最大数量', type: 'slider', defaultValue: 6, min: 2, max: 8, step: 1, unit: '个' },
    { key: 'uploadText', label: '上传提示', type: 'input', defaultValue: '添加图片' },
    { key: 'autoUpload', label: '自动上传', type: 'switch', defaultValue: true },
    { key: 'showFileSize', label: '显示文件大小', type: 'switch', defaultValue: false }
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

const demoImage = 'https://cdn.puresnake.com/joker/recycle/like.png';
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

const previewFiles = ref<UploadFileItem[]>(defaultFiles('image'));
const manualFiles = ref<UploadFileItem[]>([]);
const customButtonFiles = ref<UploadFileItem[]>([]);
const customListFiles = ref<UploadFileItem[]>([
    successfulFile('季度产品报告.pdf', 3.2 * 1024 * 1024, 'file', 'https://example.com/report.pdf'),
    successfulFile('组件接口清单.docx', 468 * 1024, 'file', 'https://example.com/component-spec.docx')
]);

const manualUploadRef = ref<UploadExpose | null>(null);
const customListUploadRef = ref<UploadExpose | null>(null);

// 演示上传适配器；真实项目可在此获取 STS 并上传到 OSS、COS 或业务服务器。
const mockUpload: UploadRequest = async (file, { onProgress }) => {
    onProgress(30);
    await delay(180);
    onProgress(70);
    await delay(180);
    return { url: file.path || file.url || demoImage, response: { provider: 'demo-storage', success: true } };
};

function delay(duration: number) {
    return new Promise<void>(resolve => setTimeout(resolve, duration));
}

function updateValue(key: string, value: DemoValue) {
    state[key] = value;
    // 切换文件类别后，原列表里的示例文件不再匹配，重置为对应的默认内容。
    if (key === 'accept') previewFiles.value = defaultFiles(value);
}

function startManualUpload() {
    manualUploadRef.value?.upload();
}

function clearManualFiles() {
    manualUploadRef.value?.clear();
}

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
.upload-live {
    min-height: 110px;
}
.upload-actions {
    display: flex;
    gap: 8px;
    margin-top: 10px;
}
.upload-actions > :deep(*) {
    flex: 1;
}
.custom-upload-button {
    display: flex;
    width: 50px;
    height: 50px;
    box-sizing: border-box;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--snake-color-border);
    border-radius: 5px;
    background: var(--snake-color-disabled-bg, #f4f5f6);
}
.custom-upload-button--hover,
.custom-file-add--hover {
    opacity: 0.72;
}
.custom-upload-button__text {
    margin-top: 7px;
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
