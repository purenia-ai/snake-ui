<script setup lang="ts">
import { computed, reactive } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const letters = ['A', 'B', 'C', 'D'];
const controls: DemoControl[] = [{ key: 'anchorPrefix', label: '分组前缀', type: 'input', defaultValue: '分组' }];
const state = reactive<Record<string, DemoValue>>({ anchorPrefix: '分组' });
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('index-anchor', '索引锚点');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<template>
    <DemoPage :title="title" :desc="text('索引锚点定义分组位置，需要放在 IndexList 内使用。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-index demo-index-anchor-showcase">
                <snake-index-list-panel :index-list="letters" active-color="#06D290">
                    <view v-for="letter in letters" :key="letter">
                        <snake-index-anchor
                            :index="letter"
                            :text="`${String(state.anchorPrefix)} ${letter}`"
                            custom-style="height: 64rpx; padding: 0 20rpx"
                        />
                        <view v-for="item in 3" :key="item" class="demo-index-row">
                            {{ letter }} {{ isEnglish ? 'item' : '类内容' }} {{ item }}
                        </view>
                    </view>
                </snake-index-list-panel>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<style scoped>
.demo-index {
    height: 620rpx;
}
.demo-index-row {
    padding: 28rpx 20rpx;
    border-bottom: 1rpx solid var(--snake-color-divider);
    color: var(--snake-color-text-secondary);
    background: var(--snake-color-surface);
}
</style>
