<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const formRef = ref<any>();
const model = reactive({ name: '' });
const rules = { name: [{ required: true, message: '请输入姓名', trigger: ['change', 'blur'] }] };
const message = ref('请填写并提交表单');
const controls: DemoControl[] = [{ key: 'formRequired', label: '必填标识', type: 'switch', defaultValue: true }];
const state = reactive<Record<string, DemoValue>>({ formRequired: true });
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('form-item', '表单项');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
async function submitForm() {
    try {
        await formRef.value?.validate();
        message.value = `校验通过：${model.name}`;
    } catch {
        message.value = '请检查表单中的错误提示';
    }
}
function resetForm() {
    formRef.value?.resetFields();
    message.value = '表单已重置';
}
</script>

<template>
    <DemoPage :title="title" :eyebrow="text('表单组件')" :desc="text('连接标签、字段控件和校验错误。')">
        <DemoSection variant="preview" :title="text('演示效果')"
            ><view class="demo-form demo-form-item-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Validation form item' : '表单项校验' }}</text>
                <snake-form ref="formRef" :model="model" :rules="rules"
                    ><snake-form-item
                        :label="isEnglish ? 'Name' : '姓名'"
                        prop="name"
                        :required="Boolean(state.formRequired)"
                        left-icon="info"
                        ><snake-input
                            v-model="model.name"
                            :placeholder="isEnglish ? 'Enter your name' : '请输入姓名'"
                            clearable /></snake-form-item
                ></snake-form>
                <view class="demo-form__actions"
                    ><snake-button size="small" @click="submitForm">{{
                        isEnglish ? 'Validate' : '提交校验'
                    }}</snake-button
                    ><snake-button size="small" plain @click="resetForm">{{
                        isEnglish ? 'Reset' : '重置'
                    }}</snake-button></view
                >
                <text class="demo-form__message">{{ message }}</text>
            </view></DemoSection
        >
        <DemoSection variant="controls" :title="text('参数配置')"
            ><DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue"
        /></DemoSection>
    </DemoPage>
</template>

<style scoped>
.demo-form {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    padding: 24rpx;
}
.demo-variant-title {
    color: var(--snake-color-text);
    font-size: 28rpx;
    font-weight: 600;
}
.demo-form__actions {
    display: flex;
    gap: 20rpx;
    padding-top: 12rpx;
}
.demo-form__message {
    color: var(--snake-color-text-secondary);
    font-size: 26rpx;
}
</style>
