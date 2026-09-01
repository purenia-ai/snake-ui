<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const value = ref<unknown[]>(['apple']);
const controls: DemoControl[] = [{ key: 'choiceColumn', label: '纵向排列', type: 'switch', defaultValue: false }];
const state = reactive<Record<string, DemoValue>>({ choiceColumn: false });
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('checkbox-group', '复选框组');
});
function updateValue(key: string, nextValue: DemoValue) {
    state[key] = nextValue;
}
</script>
<template>
    <DemoPage :title="title" :eyebrow="text('表单组件')" :desc="text('管理多个复选框值和最大选择数。')"
        ><DemoSection variant="preview" :title="text('演示效果')"
            ><view class="demo-control-stack demo-checkbox-group-showcase"
                ><text class="demo-variant-title">{{ isEnglish ? 'Limited selection' : '限制选择数量' }}</text
                ><snake-checkbox-group v-model="value" :placement="state.choiceColumn ? 'column' : 'row'" :max="2"
                    ><snake-checkbox name="apple">{{ isEnglish ? 'Apple' : '苹果' }}</snake-checkbox
                    ><snake-checkbox name="pear">{{ isEnglish ? 'Pear' : '雪梨' }}</snake-checkbox
                    ><snake-checkbox name="lemon">{{
                        isEnglish ? 'Lemon' : '柠檬'
                    }}</snake-checkbox></snake-checkbox-group
                ><text
                    >{{ isEnglish ? 'Selected: ' : '已选：'
                    }}{{ value.join(isEnglish ? ', ' : '、') || (isEnglish ? 'None' : '无') }}</text
                ></view
            ></DemoSection
        ><DemoSection variant="controls" :title="text('参数配置')"
            ><DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" /></DemoSection
    ></DemoPage>
</template>
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
