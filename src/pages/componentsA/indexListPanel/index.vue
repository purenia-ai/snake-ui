<template>
    <DemoPage :title="title" :desc="text('用于弹窗或定高区域，自身管理内部滚动。')">
        <DemoSection variant="preview" :title="text('定高容器')">
            <view class="demo-index-panel">
                <snake-index-list-panel :index-list="letters" :sticky="Boolean(state.sticky)">
                    <view v-for="letter in letters" :key="letter">
                        <snake-index-anchor :index="letter" />
                        <view v-for="item in 4" :key="item" class="demo-index-row">{{ letter }} 类内容 {{ item }}</view>
                    </view>
                </snake-index-list-panel>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="controls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const letters = ['A', 'B', 'C', 'D'];
const controls: DemoControl[] = [{ key: 'sticky', label: '锚点吸顶', type: 'switch', defaultValue: true }];
const state = reactive<Record<string, DemoValue>>({ sticky: true });
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('index-list-panel', '容器索引列表');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<style scoped>
.demo-index-panel {
    height: 620rpx;
}
.demo-index-row {
    padding: 28rpx 20rpx;
    border-bottom: 1rpx solid var(--snake-color-divider);
    color: var(--snake-color-text-secondary);
    background: var(--snake-color-surface);
}
</style>
