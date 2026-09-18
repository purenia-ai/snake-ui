<template>
    <DemoPage :title="text('节流与防抖')" :desc="text('连续点击，观察触发次数')">
        <view class="card">
            <text class="title">{{ text('防抖 600ms') }}</text>
            <text class="count">{{ debounceRuns }}</text>
            <text class="meta">{{ text('点击') }} {{ debounceClicks }} {{ text('次') }}</text>
            <text class="hint">{{ text('停止点击 600ms 后执行最后一次') }}</text>
            <snake-button type="primary" size="small" @click="clickDebounce">{{ text('连续点击') }}</snake-button>
        </view>
        <view class="card">
            <text class="title">{{ text('节流 600ms') }}</text>
            <text class="count">{{ throttleRuns }}</text>
            <text class="meta">{{ text('点击') }} {{ throttleClicks }} {{ text('次') }}</text>
            <text class="hint">{{ text('首次立即执行，持续点击时每 600ms 最多执行一次') }}</text>
            <snake-button type="success" size="small" @click="clickThrottle">{{ text('连续点击') }}</snake-button>
        </view>
        <snake-button plain size="small" class="reset-button" @click="resetCounters">{{
            text('重置计数')
        }}</snake-button>
    </DemoPage>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import { useDemoLocale } from '../../../common/demo-i18n';
import { debounce, throttle } from '../../../uni_modules/snake-ui';

const debounceClicks = ref(0);
const { text } = useDemoLocale();
const debounceRuns = ref(0);
const throttleClicks = ref(0);
const throttleRuns = ref(0);
const runDebounce = debounce(() => (debounceRuns.value += 1), 600);
const runThrottle = throttle(() => (throttleRuns.value += 1), 600);
function clickDebounce() {
    debounceClicks.value += 1;
    runDebounce();
}
function clickThrottle() {
    throttleClicks.value += 1;
    runThrottle();
}
function resetCounters() {
    runDebounce.cancel();
    runThrottle.cancel();
    debounceClicks.value = 0;
    debounceRuns.value = 0;
    throttleClicks.value = 0;
    throttleRuns.value = 0;
}
onBeforeUnmount(() => {
    runDebounce.cancel();
    runThrottle.cancel();
});
</script>

<style scoped>
.card {
    margin: 8px 4px 14px;
    padding: 18px;
    border: 1px solid var(--snake-color-divider);
    border-radius: 9px;
    background: var(--snake-color-surface);
}
.title,
.count,
.meta {
    display: block;
}
.title {
    color: var(--snake-color-text);
    font-weight: 650;
}
.count {
    margin: 14px 0 4px;
    color: var(--snake-color-primary);
    font-size: 34px;
    font-weight: 700;
}
.meta {
    color: var(--snake-color-text-muted);
    font-size: 13px;
}
.hint {
    display: block;
    margin: 6px 0 14px;
    color: var(--snake-color-text-secondary);
    font-size: 12px;
    line-height: 1.5;
}
.reset-button {
    margin: 0 4px;
}
</style>
