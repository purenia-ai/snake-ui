<template>
    <DemoPage :title="title" :desc="text('管理一组互斥的单选值。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-control-stack demo-radio-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Exclusive selection' : '互斥选择' }}</text>
                <snake-radio-group
                    v-model="value"
                    :disabled="Boolean(state.choiceDisabled)"
                    :size="String(state.choiceSize)"
                    :wrap="Boolean(state.choiceWrap)"
                    :width="state.choiceWidth === 'auto' ? 'auto' : Number(state.choiceWidth)"
                >
                    <snake-radio name="sweet">{{ isEnglish ? 'Sweet' : '鲜甜' }}</snake-radio>
                    <snake-radio name="spicy">{{ isEnglish ? 'Spicy' : '香辣' }}</snake-radio>
                    <snake-radio name="mild">{{ isEnglish ? 'Mild' : '清淡' }}</snake-radio>
                </snake-radio-group>
                <text>{{ isEnglish ? 'Selected: ' : '已选：' }}{{ selectedLabel }}</text>
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
const value = ref('sweet');
const selectedLabel = computed(() => {
    const labels: Record<string, string> = isEnglish.value
        ? { sweet: 'Sweet', spicy: 'Spicy', mild: 'Mild' }
        : { sweet: '鲜甜', spicy: '香辣', mild: '清淡' };
    return labels[value.value] ?? value.value;
});
const controls: DemoControl[] = [
    { key: 'choiceDisabled', label: '禁用状态', type: 'switch', defaultValue: false },
    {
        key: 'choiceSize',
        label: '组件尺寸',
        type: 'select',
        defaultValue: 'default',
        options: [
            { label: 'small', value: 'small' },
            { label: 'default', value: 'default' },
            { label: 'large', value: 'large' }
        ]
    },
    { key: 'choiceWrap', label: '每个换行', type: 'switch', defaultValue: false },
    {
        key: 'choiceWidth',
        label: '单项宽度',
        type: 'select',
        defaultValue: 'auto',
        options: [
            { label: 'auto', value: 'auto' },
            { label: '240rpx', value: 240 }
        ]
    }
];
const state = reactive<Record<string, DemoValue>>({
    choiceDisabled: false,
    choiceSize: 'default',
    choiceWrap: false,
    choiceWidth: 'auto'
});
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('radio', '单选框');
});
function updateValue(key: string, nextValue: DemoValue) {
    state[key] = nextValue;
}
</script>
<style scoped>
.demo-control-stack {
    display: flex;
    flex-direction: column;
    gap: 28rpx;
    padding: 24rpx;
}
.demo-variant-title {
    color: var(--snake-color-text);
    font-size: 28rpx;
    font-weight: 600;
}
.demo-control-stack > text {
    color: var(--snake-color-text-secondary);
    font-size: 26rpx;
}
</style>
