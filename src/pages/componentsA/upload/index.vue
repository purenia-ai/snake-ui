<script setup lang="ts">
import { ref } from 'vue';
import type { SnakeUploadFileItem, SnakeUploadRequest } from '../../../uni_modules/snake-ui';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const files = ref<SnakeUploadFileItem[]>([]);
const controls: DemoControl[] = [
    { key: 'maxCount', label: '最大数量', type: 'slider', defaultValue: 3, min: 1, max: 9, step: 1 }
];
const values = ref<Record<string, DemoValue>>({ maxCount: 3 });

// 演示上传适配器；实际项目可在此获取 STS 并调用 uni.uploadFile。
const mockOssUpload: SnakeUploadRequest = async (file, { onProgress }) => {
    onProgress(35);
    await new Promise(resolve => setTimeout(resolve, 300));
    onProgress(75);
    await new Promise(resolve => setTimeout(resolve, 300));
    return { url: file.path || file.url || '', response: { provider: 'demo-oss' } };
};

function updateValue(key: string, value: DemoValue) {
    values.value[key] = value;
}
</script>

<template>
    <DemoPage title="Upload 文件上传" eyebrow="数据录入" desc="支持普通接口上传与 OSS 自定义上传适配器。">
        <DemoSection variant="preview" title="OSS 适配器">
            <snake-upload v-model="files" :upload-request="mockOssUpload" :max-count="Number(values.maxCount)" />
        </DemoSection>
        <DemoSection variant="controls" title="参数配置">
            <DemoControlPanel :controls="controls" :values="values" @change="updateValue" />
        </DemoSection>
        <DemoSection title="列表模式">
            <snake-upload mode="list" :auto-upload="false" upload-text="选择文件" />
        </DemoSection>
    </DemoPage>
</template>
