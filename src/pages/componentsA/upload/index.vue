<script setup lang="ts">
import { ref } from 'vue';
import type { SnakeUploadExpose, SnakeUploadFileItem, SnakeUploadRequest } from '../../../uni_modules/snake-ui';
import DemoPage from '../../../components/demo-page/demo-page.vue';

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

const imageFiles = ref<SnakeUploadFileItem[]>([successfulFile('snake-ui.png', 86 * 1024, 'image', demoImage)]);
const documentFiles = ref<SnakeUploadFileItem[]>([
    successfulFile('组件设计说明.pdf', 2.4 * 1024 * 1024, 'file', 'https://example.com/design.pdf')
]);
const videoFiles = ref<SnakeUploadFileItem[]>([]);
const manualFiles = ref<SnakeUploadFileItem[]>([]);
const customButtonFiles = ref<SnakeUploadFileItem[]>([]);
const customListFiles = ref<SnakeUploadFileItem[]>([
    successfulFile('季度产品报告.pdf', 3.2 * 1024 * 1024, 'file', 'https://example.com/report.pdf'),
    successfulFile('组件接口清单.docx', 468 * 1024, 'file', 'https://example.com/component-spec.docx')
]);

const manualUploadRef = ref<SnakeUploadExpose | null>(null);
const customListUploadRef = ref<SnakeUploadExpose | null>(null);

// 演示上传适配器；真实项目可在此获取 STS 并上传到 OSS、COS 或业务服务器。
const mockUpload: SnakeUploadRequest = async (file, { onProgress }) => {
    onProgress(30);
    await delay(180);
    onProgress(70);
    await delay(180);
    return { url: file.path || file.url || demoImage, response: { provider: 'demo-storage', success: true } };
};

function delay(duration: number) {
    return new Promise<void>(resolve => setTimeout(resolve, duration));
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

<template>
    <DemoPage
        class="upload-demo-page"
        title="Upload 文件上传"
        eyebrow="数据录入"
        desc="支持图片、视频和普通文件，可接入业务接口或 OSS 等自定义上传服务。"
    >
        <view class="upload-demo">
            <view class="u-demo-wrap">
                <view class="u-demo-title">基础用法 - 图片上传</view>
                <view class="u-demo-area">
                    <snake-upload
                        v-model="imageFiles"
                        accept="image"
                        :upload-request="mockUpload"
                        :max-count="6"
                        width="100"
                        height="100"
                    />
                </view>
            </view>

            <view class="u-demo-wrap">
                <view class="u-demo-title">文件上传 - 列表模式</view>
                <view class="u-demo-area">
                    <snake-upload
                        v-model="documentFiles"
                        accept="file"
                        mode="list"
                        :upload-request="mockUpload"
                        :max-count="5"
                        show-file-name
                        show-file-size
                        upload-text="添加文件"
                    />
                </view>
            </view>

            <view class="u-demo-wrap">
                <view class="u-demo-title">视频上传</view>
                <view class="u-demo-area">
                    <snake-upload
                        v-model="videoFiles"
                        accept="video"
                        :upload-request="mockUpload"
                        :max-count="2"
                        :max-duration="60"
                        width="100"
                        height="100"
                        upload-text="添加视频"
                    />
                </view>
            </view>

            <view class="u-demo-wrap">
                <view class="u-demo-title">手动上传（点击按钮开始上传）</view>
                <view class="u-demo-area">
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
                        <snake-button type="primary" :disabled="manualFiles.length === 0" @tap="startManualUpload"
                            >开始上传</snake-button
                        >
                        <snake-button :disabled="manualFiles.length === 0" @tap="clearManualFiles"
                            >清空列表</snake-button
                        >
                    </view>
                </view>
            </view>

            <view class="u-demo-wrap">
                <view class="u-demo-title">自定义上传按钮</view>
                <view class="u-demo-area">
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
                                <snake-icon name="photo" size="44" color="var(--snake-color-primary)" />
                                <text class="custom-upload-button__text">选择图片</text>
                            </view>
                        </template>
                    </snake-upload>
                </view>
            </view>

            <view class="u-demo-wrap">
                <view class="u-demo-title">自定义文件列表</view>
                <view class="u-demo-area">
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
                                        <snake-icon name="file-text" size="34" color="var(--snake-color-primary)" />
                                    </view>
                                    <view class="custom-file__content">
                                        <text class="custom-file__name">{{ item.name || '未命名文件' }}</text>
                                        <text class="custom-file__meta">{{ formatFileSize(item.size) }}</text>
                                        <view
                                            v-if="
                                                item.progress !== undefined && item.progress > 0 && item.progress < 100
                                            "
                                            class="custom-file__progress"
                                        >
                                            <snake-line-progress
                                                :percent="item.progress"
                                                :show-percent="false"
                                                height="4"
                                            />
                                        </view>
                                    </view>
                                    <view class="custom-file__status">
                                        <snake-icon
                                            :name="item.error ? 'close-circle' : 'checkmark-circle'"
                                            size="32"
                                            :color="
                                                item.error ? 'var(--snake-color-error)' : 'var(--snake-color-success)'
                                            "
                                        />
                                    </view>
                                    <view class="custom-file__delete" @tap.stop="removeCustomFile(index)">
                                        <snake-icon name="trash" size="30" color="var(--snake-color-text-muted)" />
                                    </view>
                                </view>
                            </view>
                        </template>
                        <template #addBtn>
                            <view class="custom-file-add" hover-class="custom-file-add--hover">
                                <snake-icon name="plus" size="30" color="var(--snake-color-primary)" />
                                <text>添加文件</text>
                            </view>
                        </template>
                    </snake-upload>
                </view>
            </view>
        </view>
    </DemoPage>
</template>

<style scoped>
.upload-demo-page {
    background: var(--snake-color-background, #f3f4f6);
}
.upload-demo {
    margin: 0 -24rpx;
}
.u-demo-wrap {
    margin-bottom: 20rpx;
    padding: 34rpx 32rpx 38rpx;
    background: var(--snake-color-surface, #fff);
}
.u-demo-wrap:last-child {
    margin-bottom: 0;
}
.u-demo-title {
    margin-bottom: 28rpx;
    color: var(--snake-color-text, #303133);
    font-size: 28rpx;
    font-weight: 600;
    line-height: 1.4;
}
.u-demo-area {
    min-height: 80rpx;
}
.upload-actions {
    display: flex;
    gap: 16rpx;
    margin-top: 20rpx;
}
.upload-actions > :deep(*) {
    flex: 1;
}
.custom-upload-button {
    display: flex;
    width: 100rpx;
    height: 100rpx;
    box-sizing: border-box;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1rpx solid var(--snake-color-border);
    border-radius: 10rpx;
    background: var(--snake-color-disabled-bg, #f4f5f6);
}
.custom-upload-button--hover,
.custom-file-add--hover {
    opacity: 0.72;
}
.custom-upload-button__text {
    margin-top: 14rpx;
    color: var(--snake-color-text-secondary);
    font-size: 24rpx;
}
.custom-file-list {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 16rpx;
    margin-bottom: 20rpx;
}
.custom-file {
    display: flex;
    min-width: 0;
    align-items: center;
    padding: 22rpx;
    border: 1rpx solid var(--snake-color-border);
    border-radius: 8rpx;
    background: var(--snake-color-surface);
}
.custom-file__icon {
    display: flex;
    width: 64rpx;
    height: 64rpx;
    flex: 0 0 64rpx;
    align-items: center;
    justify-content: center;
    border-radius: 10rpx;
    background: var(--snake-color-disabled-bg, #f4f5f6);
}
.custom-file__content {
    min-width: 0;
    flex: 1;
    margin-left: 18rpx;
}
.custom-file__name,
.custom-file__meta {
    display: block;
}
.custom-file__name {
    overflow: hidden;
    color: var(--snake-color-text);
    font-size: 26rpx;
    line-height: 1.5;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.custom-file__meta {
    margin-top: 4rpx;
    color: var(--snake-color-text-muted);
    font-size: 22rpx;
}
.custom-file__progress {
    margin-top: 10rpx;
}
.custom-file__status,
.custom-file__delete {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    margin-left: 18rpx;
}
.custom-file__delete {
    padding: 8rpx;
}
.custom-file-add {
    display: inline-flex;
    min-height: 72rpx;
    align-items: center;
    justify-content: center;
    padding: 0 26rpx;
    border: 1rpx solid var(--snake-color-border);
    border-radius: 10rpx;
    color: var(--snake-color-primary);
    background: var(--snake-color-surface);
    font-size: 25rpx;
    gap: 10rpx;
}
</style>
