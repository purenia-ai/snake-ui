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
const model = reactive({ name: '', intro: '', fruit: ['apple'], flavor: 'sweet', enabled: true });
const rules = {
    name: [{ required: true, message: '请输入姓名', trigger: ['change', 'blur'] }],
    intro: [{ min: 5, message: '简介至少输入 5 个字', trigger: 'blur' }]
};
const message = ref('请填写并提交表单');
const controls: DemoControl[] = [
    { key: 'formBorder', label: '显示分隔线', type: 'switch', defaultValue: true },
    { key: 'formTopLabel', label: '标签置顶', type: 'switch', defaultValue: false }
];
const state = reactive<Record<string, DemoValue>>({ formBorder: true, formTopLabel: false });
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('form', '表单');
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
    <DemoPage
        :title="title"
        :eyebrow="text('表单组件')"
        :desc="text('组合字段控件，完成规则校验、错误展示、提交和重置。')"
    >
        <DemoSection variant="preview" :title="text('演示效果')"
            ><view class="demo-form demo-form-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Validation form' : '表单校验' }}</text>
                <snake-form
                    ref="formRef"
                    :model="model"
                    :rules="rules"
                    :border-bottom="Boolean(state.formBorder)"
                    :label-position="state.formTopLabel ? 'top' : 'left'"
                >
                    <snake-form-item :label="isEnglish ? 'Name' : '姓名'" prop="name" required left-icon="info"
                        ><snake-input
                            v-model="model.name"
                            :placeholder="isEnglish ? 'Enter your name' : '请输入姓名'"
                            clearable
                    /></snake-form-item>
                    <snake-form-item :label="isEnglish ? 'Bio' : '简介'" prop="intro"
                        ><snake-textarea v-model="model.intro" :maxlength="60" count height="150"
                    /></snake-form-item>
                    <snake-form-item :label="isEnglish ? 'Fruit' : '水果'" prop="fruit"
                        ><snake-checkbox-group v-model="model.fruit"
                            ><snake-checkbox name="apple">{{ isEnglish ? 'Apple' : '苹果' }}</snake-checkbox
                            ><snake-checkbox name="pear">{{
                                isEnglish ? 'Pear' : '雪梨'
                            }}</snake-checkbox></snake-checkbox-group
                        ></snake-form-item
                    >
                    <snake-form-item :label="isEnglish ? 'Flavor' : '味道'" prop="flavor"
                        ><snake-radio-group v-model="model.flavor"
                            ><snake-radio name="sweet">{{ isEnglish ? 'Sweet' : '鲜甜' }}</snake-radio
                            ><snake-radio name="spicy">{{
                                isEnglish ? 'Spicy' : '香辣'
                            }}</snake-radio></snake-radio-group
                        ></snake-form-item
                    >
                    <snake-form-item :label="isEnglish ? 'Enabled' : '启用'" prop="enabled"
                        ><snake-switch v-model="model.enabled"
                    /></snake-form-item>
                </snake-form>
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
