<template>
    <DemoPage :title="text('路由跳转')" :desc="text('Promise 化的 uni-app 导航')">
        <view class="path">/pages/library/route/index?source=route-demo&amp;id=7</view>
        <view class="actions">
            <snake-button type="primary" @click="openWithParams">{{ text('携参打开本页') }}</snake-button>
            <snake-button plain @click="openButton">{{ text('打开 Button 示例') }}</snake-button>
        </view>
        <text class="log" aria-live="polite">{{ log || text('尚未导航') }}</text>
        <text v-if="receivedParams" class="received" aria-live="polite"
            >{{ text('收到的参数') }}: {{ receivedParams }}</text
        >
    </DemoPage>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import { useDemoLocale } from '../../../common/demo-i18n';
import { route } from '../../../uni_modules/snake-ui';

const { text } = useDemoLocale();
const log = ref('');
const receivedParams = ref('');
onLoad(query => {
    receivedParams.value = query?.id ? `source=${String(query.source || '')}, id=${String(query.id)}` : '';
});
async function openWithParams() {
    try {
        await route('/pages/library/route/index', { source: 'route-demo', id: 7 });
        log.value = text('navigateTo 调用成功');
    } catch (error) {
        log.value = error instanceof Error ? error.message : String(error);
    }
}
async function openButton() {
    try {
        await route('/pages/componentsA/button/index');
        log.value = text('navigateTo 调用成功');
    } catch (error) {
        log.value = error instanceof Error ? error.message : String(error);
    }
}
</script>

<style scoped>
.path {
    margin: 8px 4px 16px;
    padding: 13px;
    border: 1px dashed var(--snake-color-border);
    border-radius: 7px;
    color: var(--snake-color-text-secondary);
    background: var(--snake-color-surface-muted);
    font-family: monospace;
    font-size: 12px;
}
.actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 0 4px;
}
.log {
    display: block;
    margin: 16px 4px;
    color: var(--snake-color-text-muted);
    font-size: 13px;
}
.received {
    display: block;
    margin: 0 4px 16px;
    color: var(--snake-color-primary-deep);
    font-size: 13px;
}
</style>
