<script setup lang="ts">
import { ref } from 'vue';
import DemoPage from '../../../demo/components/DemoPage.vue';
import { route } from '../../../uni_modules/snake-ui';

const log = ref('尚未导航');
async function openButton() {
    try {
        await route('/pages/componentsA/button/index', { source: 'route-demo', id: 7 });
        log.value = 'navigateTo 调用成功';
    } catch (error) {
        log.value = error instanceof Error ? error.message : String(error);
    }
}
</script>

<template>
    <DemoPage title="路由跳转" desc="Promise 化的 uni-app 导航">
        <view class="path">/pages/componentsA/button/index?id=7</view>
        <snake-button type="primary" @click="openButton">打开 Button 示例</snake-button>
        <text class="log">{{ log }}</text>
    </DemoPage>
</template>

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
.log {
    display: block;
    margin: 16px 4px;
    color: var(--snake-color-text-muted);
    font-size: 13px;
}
</style>
