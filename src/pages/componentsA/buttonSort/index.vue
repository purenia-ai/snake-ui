<template>
    <DemoPage :title="title" :desc="text('点击后在默认、升序和降序状态之间循环切换。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-button-sort-showcase">
                <snake-button-sort :title="String(state.sortTitle)" @change="sortValue = $event.value" />
                <view class="demo-tab-content">
                    {{ isEnglish ? 'Current state: ' : '当前状态：'
                    }}{{ sortValue || (isEnglish ? 'Default' : '默认') }}
                </view>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
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

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const sortValue = ref('');
const controls: DemoControl[] = [{ key: 'sortTitle', label: '按钮文字', type: 'input', defaultValue: '价格排序' }];
const state = reactive<Record<string, DemoValue>>({ sortTitle: '价格排序' });
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('button-sort', '排序按钮');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<style scoped>
.demo-tab-content {
    padding: 64rpx 24rpx;
    border-radius: 16rpx;
    background: var(--snake-color-surface-muted);
    color: var(--snake-demo-accent-text);
    text-align: center;
}
</style>
