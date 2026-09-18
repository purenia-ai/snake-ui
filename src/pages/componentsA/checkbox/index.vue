<template>
    <DemoPage :title="title" :desc="text('可独立使用的复选框，也可放入 CheckboxGroup。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-control-stack demo-checkbox-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Standalone checkbox' : '独立复选框' }}</text>
                <snake-checkbox v-model="value" :disabled="Boolean(state.choiceDisabled)">
                    {{ isEnglish ? 'Accept the user agreement' : '同意用户协议' }}
                </snake-checkbox>
                <text>{{ isEnglish ? 'Current value: ' : '当前值：' }}{{ value }}</text>
                <text class="demo-variant-title">{{ isEnglish ? 'Limited selection' : '限制选择数量' }}</text>
                <snake-checkbox-group
                    v-model="fruits"
                    :disabled="Boolean(state.choiceDisabled)"
                    :size="String(state.choiceSize)"
                    :wrap="Boolean(state.choiceWrap)"
                    :max="2"
                >
                    <snake-checkbox name="apple">{{ isEnglish ? 'Apple' : '苹果' }}</snake-checkbox>
                    <snake-checkbox name="pear">{{ isEnglish ? 'Pear' : '雪梨' }}</snake-checkbox>
                    <snake-checkbox name="lemon">{{ isEnglish ? 'Lemon' : '柠檬' }}</snake-checkbox>
                </snake-checkbox-group>
                <text>
                    {{ isEnglish ? 'Selected: ' : '已选：' }}{{ selectedFruits || (isEnglish ? 'None' : '无') }}
                </text>
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
const value = ref(true);
const fruits = ref<(string | number)[]>(['apple']);
const selectedFruits = computed(() => {
    const labels: Record<string, string> = isEnglish.value
        ? { apple: 'Apple', pear: 'Pear', lemon: 'Lemon' }
        : { apple: '苹果', pear: '雪梨', lemon: '柠檬' };
    return fruits.value.map(fruit => labels[String(fruit)] ?? String(fruit)).join(isEnglish.value ? ', ' : '、');
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
    { key: 'choiceWrap', label: '每个换行', type: 'switch', defaultValue: false }
];
const state = reactive<Record<string, DemoValue>>({
    choiceDisabled: false,
    choiceSize: 'default',
    choiceWrap: false
});
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('checkbox', '复选框');
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
