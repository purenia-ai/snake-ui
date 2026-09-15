<template>
    <DemoPage :title="title" :desc="text('用真实字段演示规则校验、嵌套路径、动态联系人和表单 API。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-form demo-form-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Account registration' : '账户注册表单' }}</text>
                <snake-form
                    ref="formRef"
                    :model="model"
                    :rules="rules"
                    :size="formSize"
                    :error-type="formErrorType"
                    :border-bottom="Boolean(state.formBorder)"
                    :label-position="state.formTopLabel ? 'top' : 'left'"
                    label-width="150"
                >
                    <view class="demo-form__group">
                        <text class="demo-form__group-title">{{ isEnglish ? 'Account details' : '账户资料' }}</text>
                        <snake-form-item
                            :label="isEnglish ? 'Name' : '姓名'"
                            prop="name"
                            :required="Boolean(state.formRequired)"
                            left-icon="account"
                            label-width="120"
                        >
                            <snake-input
                                v-model="model.name"
                                :placeholder="isEnglish ? '2–12 characters' : '请输入 2–12 个字符的姓名'"
                                clearable
                            />
                        </snake-form-item>
                        <snake-form-item
                            :label="isEnglish ? 'Mobile' : '手机号'"
                            prop="mobile"
                            :required="Boolean(state.formRequired)"
                        >
                            <snake-input
                                v-model="model.mobile"
                                :placeholder="isEnglish ? 'Enter mobile number' : '请输入手机号'"
                                clearable
                            />
                        </snake-form-item>
                        <snake-form-item
                            :label="isEnglish ? 'Password' : '密码'"
                            prop="password"
                            :required="Boolean(state.formRequired)"
                        >
                            <snake-input
                                v-model="model.password"
                                type="password"
                                :placeholder="
                                    isEnglish
                                        ? 'Letters and numbers, at least 6 characters'
                                        : '至少 6 位，包含字母和数字'
                                "
                            />
                        </snake-form-item>
                        <snake-form-item
                            :label="isEnglish ? 'Confirm password' : '确认密码'"
                            prop="rePassword"
                            :required="Boolean(state.formRequired)"
                            label-width="150"
                        >
                            <snake-input
                                v-model="model.rePassword"
                                type="password"
                                :placeholder="isEnglish ? 'Enter password again' : '请再次输入密码'"
                            />
                        </snake-form-item>
                        <snake-form-item
                            :label="isEnglish ? 'Bio' : '简介'"
                            prop="intro"
                            :required="Boolean(state.formRequired) && strictIntro"
                        >
                            <snake-textarea v-model="model.intro" :maxlength="60" count height="150" />
                        </snake-form-item>
                    </view>

                    <view class="demo-form__group">
                        <text class="demo-form__group-title">{{ isEnglish ? 'Preferences' : '偏好设置' }}</text>
                        <snake-form-item
                            :label="isEnglish ? 'Fruit' : '水果偏好'"
                            prop="fruit"
                            :required="Boolean(state.formRequired)"
                        >
                            <snake-checkbox-group v-model="model.fruit">
                                <snake-checkbox name="apple">{{ isEnglish ? 'Apple' : '苹果' }}</snake-checkbox>
                                <snake-checkbox name="pear">{{ isEnglish ? 'Pear' : '雪梨' }}</snake-checkbox>
                            </snake-checkbox-group>
                        </snake-form-item>
                        <snake-form-item
                            :label="isEnglish ? 'Flavor' : '口味'"
                            prop="flavor"
                            :required="Boolean(state.formRequired)"
                        >
                            <snake-radio-group v-model="model.flavor">
                                <snake-radio name="sweet">{{ isEnglish ? 'Sweet' : '鲜甜' }}</snake-radio>
                                <snake-radio name="spicy">{{ isEnglish ? 'Spicy' : '香辣' }}</snake-radio>
                            </snake-radio-group>
                        </snake-form-item>
                        <snake-form-item
                            :label="isEnglish ? 'Agreement' : '服务协议'"
                            prop="agreement"
                            :required="Boolean(state.formRequired)"
                        >
                            <template #right><snake-switch v-model="model.agreement" /></template>
                        </snake-form-item>
                    </view>

                    <view class="demo-form__group">
                        <view class="demo-form__group-head">
                            <text class="demo-form__group-title">
                                {{ isEnglish ? 'Payment contacts' : '收款联系人' }}
                            </text>
                            <text class="demo-form__group-tip">
                                {{ isEnglish ? 'Nested path validation' : '嵌套路径校验' }}
                            </text>
                        </view>
                        <snake-form-item
                            v-for="(account, index) in model.accounts"
                            :key="account.id"
                            :label="`${isEnglish ? 'Contact' : '联系人'} ${index + 1}`"
                            :prop="`accounts.${index}.name`"
                            :required="Boolean(state.formRequired)"
                            label-width="150"
                            right-icon="arrow-right"
                            :right-icon-style="{ color: 'var(--snake-color-text-muted)' }"
                        >
                            <template #leftIcon><snake-icon name="account" /></template>
                            <snake-input
                                v-model="account.name"
                                :placeholder="isEnglish ? 'Enter account name' : '请输入账户名'"
                                clearable
                            />
                        </snake-form-item>
                        <view class="demo-form__contact-actions">
                            <snake-button size="small" plain @click="addContact">
                                {{ isEnglish ? 'Add contact' : '添加联系人' }}
                            </snake-button>
                            <snake-button
                                size="small"
                                plain
                                :disabled="model.accounts.length === 1"
                                @click="removeLastContact"
                            >
                                {{ isEnglish ? 'Remove last' : '删除最后一项' }}
                            </snake-button>
                        </view>
                    </view>
                </snake-form>

                <view class="demo-form__actions">
                    <snake-button size="small" @click="submitForm">
                        {{ isEnglish ? 'Validate all' : '整表校验' }}
                    </snake-button>
                    <snake-button size="small" plain @click="validateName">
                        {{ isEnglish ? 'Validate name' : '校验姓名' }}
                    </snake-button>
                    <snake-button size="small" plain @click="validateCredentials">
                        {{ isEnglish ? 'Validate credentials' : '校验姓名和密码' }}
                    </snake-button>
                    <snake-button size="small" plain @click="toggleIntroRule">
                        {{
                            strictIntro
                                ? isEnglish
                                    ? 'Make bio optional'
                                    : '简介设为可选'
                                : isEnglish
                                  ? 'Require bio'
                                  : '简介设为必填'
                        }}
                    </snake-button>
                    <snake-button size="small" plain @click="resetForm">
                        {{ isEnglish ? 'Reset' : '重置' }}
                    </snake-button>
                </view>
                <text class="demo-form__message">{{ message }}</text>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
            <text class="demo-form__control-tip">
                {{ isEnglish ? 'Toast appears only after whole-form validation.' : 'Toast 仅在执行整表校验时出现。' }}
            </text>
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
import type { FormExpose, FormRules } from '../../../uni_modules/snake-ui/components/snake-form/types';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const formRef = ref<FormExpose>();
const strictIntro = ref(false);
let nextAccountId = 2;
const model = reactive({
    name: '',
    mobile: '',
    password: '',
    rePassword: '',
    intro: '',
    fruit: [] as string[],
    flavor: '',
    agreement: false,
    accounts: [{ id: 1, name: '' }]
});

function createFormRules(requireIntro: boolean): FormRules {
    return {
        name: [
            { required: true, message: '请输入姓名', trigger: ['change', 'blur'] },
            { min: 2, max: 12, message: '姓名长度为 2–12 个字符', trigger: ['change', 'blur'] }
        ],
        mobile: [
            { required: true, message: '请输入手机号', trigger: ['change', 'blur'] },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: ['change', 'blur'] }
        ],
        password: [
            { required: true, message: '请输入密码', trigger: ['change', 'blur'] },
            {
                pattern: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
                message: '密码至少 6 位且包含字母和数字',
                trigger: ['change', 'blur']
            }
        ],
        rePassword: [
            { required: true, message: '请再次输入密码', trigger: ['change', 'blur'] },
            {
                validator: (_rule, value) => value === model.password,
                message: '两次输入的密码不一致',
                trigger: ['change', 'blur']
            }
        ],
        intro: requireIntro
            ? [
                  { required: true, message: '请输入简介', trigger: ['change', 'blur'] },
                  { min: 5, message: '简介至少输入 5 个字', trigger: ['change', 'blur'] }
              ]
            : [{ min: 5, message: '简介至少输入 5 个字', trigger: ['change', 'blur'] }],
        fruit: [{ required: true, type: 'array', min: 1, message: '请至少选择一种水果', trigger: 'change' }],
        flavor: [{ required: true, message: '请选择口味', trigger: 'change' }],
        agreement: [{ validator: (_rule, value) => value === true, message: '请先同意服务协议', trigger: 'change' }],
        accounts: {
            type: 'array',
            defaultField: {
                type: 'object',
                fields: {
                    name: [
                        { required: true, message: '请输入账户名', trigger: ['change', 'blur'] },
                        { min: 2, message: '账户名至少 2 个字符', trigger: ['change', 'blur'] }
                    ]
                }
            }
        }
    };
}

const rules = ref<FormRules>(createFormRules(false));
const message = ref('请填写表单后执行校验');
const controls: DemoControl[] = [
    { key: 'formBorder', label: '显示分隔线', type: 'switch', defaultValue: true },
    { key: 'formTopLabel', label: '标签置顶', type: 'switch', defaultValue: false },
    { key: 'formRequired', label: '必填标识', type: 'switch', defaultValue: true },
    {
        key: 'formSize',
        label: '表单尺寸',
        type: 'select',
        defaultValue: 'default',
        options: [
            { label: '小', value: 'small' },
            { label: '默认', value: 'default' },
            { label: '大', value: 'large' }
        ]
    },
    {
        key: 'formErrorType',
        label: '错误提示',
        type: 'select',
        defaultValue: 'message',
        options: [
            { label: '文字', value: 'message' },
            { label: 'Toast', value: 'toast' },
            { label: '底边', value: 'border-bottom' },
            { label: '输入框边框', value: 'border' }
        ]
    }
];
const state = reactive<Record<string, DemoValue>>({
    formBorder: true,
    formTopLabel: false,
    formRequired: true,
    formSize: 'default',
    formErrorType: 'message'
});
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const formSize = computed(() => String(state.formSize) as 'small' | 'default' | 'large');
const formErrorType = computed(
    () => [String(state.formErrorType)] as Array<'message' | 'toast' | 'border-bottom' | 'border'>
);
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('form', '表单');
});

function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function addContact() {
    model.accounts.push({ id: nextAccountId++, name: '' });
    message.value = '已添加联系人，请填写账户名';
}
function removeLastContact() {
    if (model.accounts.length === 1) return;
    model.accounts.pop();
    message.value = '已删除最后一个联系人';
}
async function submitForm() {
    const valid = await formRef.value?.validate((_valid, errors) => {
        if (!_valid) message.value = `校验失败：${errors[0]?.message || '请检查表单'}`;
    });
    if (valid) message.value = `校验通过：${model.name}`;
}
async function validateName() {
    const valid = await formRef.value?.validateField('name');
    message.value = valid ? '姓名校验通过' : '姓名校验失败';
}
async function validateCredentials() {
    const valid = await formRef.value?.validateField(['name', 'password']);
    message.value = valid ? '姓名和密码校验通过' : '姓名或密码校验失败';
}
function toggleIntroRule() {
    strictIntro.value = !strictIntro.value;
    rules.value = createFormRules(strictIntro.value);
    formRef.value?.setRules(rules.value);
    message.value = strictIntro.value ? '简介已设为必填项' : '简介已设为可选项';
}
function resetForm() {
    formRef.value?.resetFields();
    message.value = '表单已重置';
}
</script>

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
.demo-form__group + .demo-form__group {
    margin-top: 20rpx;
}
.demo-form__group-title {
    color: var(--snake-color-text);
    font-size: 26rpx;
    font-weight: 600;
}
.demo-form__group-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.demo-form__group-tip,
.demo-form__control-tip {
    color: var(--snake-color-text-muted);
    font-size: 22rpx;
}
.demo-form__contact-actions,
.demo-form__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
}
.demo-form__contact-actions,
.demo-form__actions {
    padding-top: 12rpx;
}
.demo-form__message {
    color: var(--snake-color-text-secondary);
    font-size: 26rpx;
}
.demo-form__control-tip {
    display: block;
    padding: 20rpx 24rpx 0;
}
</style>
