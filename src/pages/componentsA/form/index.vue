<template>
    <DemoPage :title="title" :desc="text('用真实字段演示规则校验、嵌套路径、动态联系人和表单 API。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-form demo-form-showcase">
                <snake-form
                    ref="formRef"
                    :model="model"
                    :rules="rules"
                    :size="formSize"
                    :error-type="formErrorType"
                    :border-bottom="Boolean(state.formBorder)"
                    :label-position="state.formTopLabel ? 'top' : 'left'"
                    :label-width="labelWidth"
                >
                    <view class="demo-form__group">
                        <view class="demo-form__group-head">
                            <text class="demo-form__group-title">{{ text('账户资料') }}</text>
                        </view>
                        <snake-form-item
                            :label="text('姓名')"
                            prop="name"
                            :required="Boolean(state.formRequired)"
                            left-icon="account"
                        >
                            <snake-input
                                v-model="model.name"
                                :placeholder="text('请输入 2–12 个字符的姓名')"
                                clearable
                            />
                        </snake-form-item>
                        <snake-form-item :label="text('手机号')" prop="mobile" :required="Boolean(state.formRequired)">
                            <snake-input
                                v-model="model.mobile"
                                type="number"
                                :maxlength="11"
                                :placeholder="text('请输入手机号')"
                                clearable
                            />
                        </snake-form-item>
                        <snake-form-item :label="text('密码')" prop="password" :required="Boolean(state.formRequired)">
                            <snake-input
                                v-model="model.password"
                                type="password"
                                show-password
                                :placeholder="text('至少 6 位，包含字母和数字')"
                            />
                        </snake-form-item>
                        <snake-form-item
                            :label="text('确认密码')"
                            prop="rePassword"
                            :required="Boolean(state.formRequired)"
                        >
                            <snake-input
                                v-model="model.rePassword"
                                type="password"
                                :placeholder="text('请再次输入密码')"
                            />
                        </snake-form-item>
                        <snake-form-item
                            :label="text('简介')"
                            prop="intro"
                            :required="Boolean(state.formRequired) && strictIntro"
                        >
                            <snake-textarea
                                v-model="model.intro"
                                :maxlength="60"
                                :placeholder="text('请输入内容')"
                                count
                                height="75"
                            />
                        </snake-form-item>
                    </view>

                    <view class="demo-form__group">
                        <view class="demo-form__group-head">
                            <text class="demo-form__group-title">{{ text('偏好设置') }}</text>
                        </view>
                        <snake-form-item :label="text('水果偏好')" prop="fruit" :required="Boolean(state.formRequired)">
                            <snake-checkbox-group v-model="model.fruit">
                                <snake-checkbox name="apple">{{ text('苹果') }}</snake-checkbox>
                                <snake-checkbox name="pear">{{ text('雪梨') }}</snake-checkbox>
                            </snake-checkbox-group>
                        </snake-form-item>
                        <snake-form-item :label="text('口味')" prop="flavor" :required="Boolean(state.formRequired)">
                            <snake-radio-group v-model="model.flavor">
                                <snake-radio name="sweet">{{ text('鲜甜') }}</snake-radio>
                                <snake-radio name="spicy">{{ text('香辣') }}</snake-radio>
                            </snake-radio-group>
                        </snake-form-item>
                        <snake-form-item
                            :label="text('服务协议')"
                            prop="agreement"
                            :required="Boolean(state.formRequired)"
                        >
                            <template #right><snake-switch v-model="model.agreement" /></template>
                        </snake-form-item>
                    </view>

                    <view class="demo-form__group">
                        <view class="demo-form__group-head">
                            <text class="demo-form__group-title">{{ text('收款联系人') }}</text>
                            <text class="demo-form__group-tip">{{ text('嵌套路径校验') }}</text>
                        </view>
                        <snake-form-item
                            v-for="(account, index) in model.accounts"
                            :key="account.id"
                            :label="`${text('联系人')} ${index + 1}`"
                            :prop="`accounts.${index}.name`"
                            :required="Boolean(state.formRequired)"
                        >
                            <snake-input v-model="account.name" :placeholder="text('请输入账户名')" clearable />
                        </snake-form-item>
                        <view class="demo-form__contact-actions">
                            <snake-button size="small" plain @click="addContact">
                                {{ text('添加联系人') }}
                            </snake-button>
                            <snake-button
                                size="small"
                                plain
                                :disabled="model.accounts.length === 1"
                                @click="removeLastContact"
                            >
                                {{ text('删除最后一项') }}
                            </snake-button>
                        </view>
                    </view>
                </snake-form>

                <view class="demo-form__actions">
                    <snake-button type="primary" block @click="submitForm">{{ text('整表校验') }}</snake-button>
                    <view class="demo-form__action-grid">
                        <view class="demo-form__action-cell">
                            <snake-button size="small" plain block @click="validateName">
                                {{ text('校验姓名') }}
                            </snake-button>
                        </view>
                        <view class="demo-form__action-cell">
                            <snake-button size="small" plain block @click="validateCredentials">
                                {{ text('校验姓名和密码') }}
                            </snake-button>
                        </view>
                        <view class="demo-form__action-cell">
                            <snake-button size="small" plain block @click="toggleIntroRule">
                                {{ text(strictIntro ? '简介设为可选' : '简介设为必填') }}
                            </snake-button>
                        </view>
                        <view class="demo-form__action-cell">
                            <snake-button size="small" plain block @click="resetForm">{{ text('重置') }}</snake-button>
                        </view>
                    </view>
                </view>

                <view class="demo-form__status" :class="`demo-form__status--${statusTone}`" aria-live="polite">
                    <snake-icon :name="statusIcon" :size="14" />
                    <text class="demo-form__status-text">{{ statusMessage }}</text>
                </view>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
            <text class="demo-form__control-tip">
                {{ text('Toast 仅在执行整表校验时出现。') }}
            </text>
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
import type { FormError, FormExpose, FormRules } from '../../../uni_modules/snake-ui/components/snake-form/types';

const { localeName, text } = useDemoLocale();
const formRef = ref<FormExpose>();
const strictIntro = ref(false);
let nextAccountId = 2;

type StatusTone = 'idle' | 'success' | 'error';
const statusTone = ref<StatusTone>('idle');
const statusKey = ref('请填写表单后执行校验');
const statusDetail = ref('');

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
            { required: true, message: demoText('请输入姓名'), trigger: ['change', 'blur'] },
            { min: 2, max: 12, message: demoText('姓名长度为 2–12 个字符'), trigger: ['change', 'blur'] }
        ],
        mobile: [
            { required: true, message: demoText('请输入手机号'), trigger: ['change', 'blur'] },
            { pattern: /^1[3-9]\d{9}$/, message: demoText('请输入正确的手机号'), trigger: ['change', 'blur'] }
        ],
        password: [
            { required: true, message: demoText('请输入密码'), trigger: ['change', 'blur'] },
            {
                pattern: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
                message: demoText('密码至少 6 位且包含字母和数字'),
                trigger: ['change', 'blur']
            }
        ],
        rePassword: [
            { required: true, message: demoText('请再次输入密码'), trigger: ['change', 'blur'] },
            {
                validator: (_rule, value) => value === model.password,
                message: demoText('两次输入的密码不一致'),
                trigger: ['change', 'blur']
            }
        ],
        intro: requireIntro
            ? [
                  { required: true, message: demoText('请输入简介'), trigger: ['change', 'blur'] },
                  { min: 5, message: demoText('简介至少输入 5 个字'), trigger: ['change', 'blur'] }
              ]
            : [{ min: 5, message: demoText('简介至少输入 5 个字'), trigger: ['change', 'blur'] }],
        fruit: [{ required: true, type: 'array', min: 1, message: demoText('请至少选择一种水果'), trigger: 'change' }],
        flavor: [{ required: true, message: demoText('请选择口味'), trigger: 'change' }],
        agreement: [
            { validator: (_rule, value) => value === true, message: demoText('请先同意服务协议'), trigger: 'change' }
        ],
        accounts: {
            type: 'array',
            defaultField: {
                type: 'object',
                fields: {
                    name: [
                        { required: true, message: demoText('请输入账户名'), trigger: ['change', 'blur'] },
                        { min: 2, message: demoText('账户名至少 2 个字符'), trigger: ['change', 'blur'] }
                    ]
                }
            }
        }
    };
}

const rules = ref<FormRules>(createFormRules(false));

const statusIcon = computed(
    () => ({ idle: 'info-circle', success: 'checkmark-circle', error: 'close-circle' })[statusTone.value]
);
const labelWidth = computed(() => (localeName.value === 'en-US' ? 128 : 75));
const statusMessage = computed(() => {
    const label = text(statusKey.value);
    if (!statusDetail.value) return label;
    return `${label}${localeName.value === 'en-US' ? ': ' : '：'}${statusDetail.value}`;
});

function setStatus(tone: StatusTone, key: string, detail = '') {
    statusTone.value = tone;
    statusKey.value = key;
    statusDetail.value = detail;
}

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
    return controls.map(control => ({
        ...control,
        label: demoText(control.label),
        options: control.options?.map(option => ({ ...option, label: demoText(option.label) }))
    }));
});
const formSize = computed(() => String(state.formSize) as 'small' | 'default' | 'large');
const formErrorType = computed(
    () => [String(state.formErrorType)] as Array<'message' | 'toast' | 'border-bottom' | 'border'>
);
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('form', '表单');
});
// 记录最近一次校验的范围：空数组代表整表，null 代表还没校验过。
// 切换语言后按同一范围静默重跑一次，让字段下方的错误文案跟着换语言。
const lastScope = ref<string[] | null>(null);

watch(localeName, async () => {
    rules.value = createFormRules(strictIntro.value);
    formRef.value?.setRules(rules.value);
    await refreshValidation();
});

async function refreshValidation() {
    const scope = lastScope.value;
    if (!scope) {
        setStatus('idle', '请填写表单后执行校验');
        return;
    }
    // Toast 模式下重跑会弹出提示，直接回到初始状态
    if (String(state.formErrorType) === 'toast') {
        setStatus('idle', '请填写表单后执行校验');
        return;
    }
    let firstError = '';
    const onDone = (_valid: boolean, errors: FormError[]) => {
        firstError = errors[0]?.message || '';
    };
    const valid = scope.length
        ? await formRef.value?.validateField(scope, onDone)
        : await formRef.value?.validate(onDone);
    if (!valid) {
        statusTone.value = 'error';
        statusDetail.value = firstError;
    } else if (statusTone.value === 'error') {
        statusTone.value = 'success';
        statusDetail.value = '';
    }
}

function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function addContact() {
    model.accounts.push({ id: nextAccountId++, name: '' });
    setStatus('idle', '已添加联系人，请填写账户名');
}
function removeLastContact() {
    if (model.accounts.length === 1) return;
    model.accounts.pop();
    setStatus('idle', '已删除最后一个联系人');
}
async function submitForm() {
    lastScope.value = [];
    const valid = await formRef.value?.validate((_valid, errors) => {
        if (!_valid) setStatus('error', '校验失败', errors[0]?.message || text('请检查表单'));
    });
    if (valid) setStatus('success', '校验通过', model.name);
}
async function validateName() {
    lastScope.value = ['name'];
    const valid = await formRef.value?.validateField('name');
    setStatus(valid ? 'success' : 'error', valid ? '姓名校验通过' : '姓名校验失败');
}
async function validateCredentials() {
    lastScope.value = ['name', 'password'];
    const valid = await formRef.value?.validateField(['name', 'password']);
    setStatus(valid ? 'success' : 'error', valid ? '姓名和密码校验通过' : '姓名或密码校验失败');
}
function toggleIntroRule() {
    strictIntro.value = !strictIntro.value;
    rules.value = createFormRules(strictIntro.value);
    formRef.value?.setRules(rules.value);
    setStatus('idle', strictIntro.value ? '简介已设为必填项' : '简介已设为可选项');
}
function resetForm() {
    lastScope.value = null;
    formRef.value?.resetFields();
    model.accounts.splice(1);
    setStatus('idle', '表单已重置');
}
</script>

<style scoped>
.demo-form-showcase {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.demo-form__group {
    display: flex;
    flex-direction: column;
}

.demo-form__group + .demo-form__group {
    margin-top: 14px;
}

.demo-form__group-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding-bottom: 4px;
}

.demo-form__group-title {
    color: var(--snake-color-text);
    font-size: 13px;
    font-weight: 600;
}

.demo-form__group-tip,
.demo-form__control-tip {
    color: var(--snake-color-text-muted);
    font-size: 11px;
}

.demo-form__contact-actions {
    display: flex;
    gap: 8px;
    padding-top: 10px;
}

.demo-form__actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.demo-form__action-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
}

/* 组件根节点作为栅格子项不会自动撑满列宽，用普通容器承接栅格 */
.demo-form__action-cell {
    min-width: 0;
}

.demo-form__status {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    padding: 9px 10px;
    border-radius: 8px;
    color: var(--snake-color-text-secondary);
    background: var(--snake-color-surface-muted);
}

.demo-form__status--success {
    color: var(--snake-color-success);
    background: var(--snake-color-success-light);
}

.demo-form__status--error {
    color: var(--snake-color-error);
    background: var(--snake-color-error-light);
}

.demo-form__status-text {
    flex: 1;
    color: inherit;
    font-size: 12px;
    line-height: 1.5;
    word-break: break-word;
}

.demo-form__control-tip {
    display: block;
    padding: 10px 12px 0;
}
</style>
