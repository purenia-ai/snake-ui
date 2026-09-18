<template>
    <DemoPage :title="text('HTTP 请求')" :desc="text('配置、传输层与错误模型')">
        <view class="actions">
            <snake-button type="primary" size="small" :disabled="pending" @click="request('/profile')">{{
                text('成功请求')
            }}</snake-button>
            <snake-button type="error" size="small" plain :disabled="pending" @click="request('/failure')">{{
                text('模拟失败')
            }}</snake-button>
        </view>
        <text class="output">{{ output || text('点击按钮发起本地 Mock 请求') }}</text>
    </DemoPage>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import { useDemoLocale } from '../../../common/demo-i18n';
import { Request, RequestError } from '../../../uni_modules/snake-ui';

const client = new Request();
client.setConfig({ meta: { originalData: false } });
const { text } = useDemoLocale();
const output = ref('');
const pending = ref(false);
client.setTransport(async options => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return options.url.includes('failure')
        ? { statusCode: 503, data: { message: '服务暂不可用' }, header: {} }
        : { statusCode: 200, data: { id: 1, name: 'Snake UI', method: options.method }, header: {} };
});

async function request(path: string) {
    if (pending.value) return;
    pending.value = true;
    output.value = text('请求中…');
    try {
        output.value = JSON.stringify(await client.get(path), null, 2);
    } catch (error) {
        if (error instanceof RequestError) {
            const response = error.response as { data?: { message?: string } } | undefined;
            output.value = `${text('请求失败')} · ${error.kind.toUpperCase()} ${error.statusCode || ''}\n${text(response?.data?.message || error.message)}`;
        } else {
            output.value = String(error);
        }
    } finally {
        pending.value = false;
    }
}
</script>

<style scoped>
.actions {
    display: flex;
    gap: 10px;
    padding: 8px 4px;
}
.output {
    display: block;
    margin: 14px 4px;
    padding: 16px;
    border: 1px solid var(--snake-color-divider);
    border-left: 3px solid var(--snake-color-primary);
    border-radius: 8px;
    color: var(--snake-color-text);
    background: var(--snake-color-surface);
    font-family: monospace;
    font-size: 13px;
    line-height: 1.7;
    white-space: pre-wrap;
}
</style>
