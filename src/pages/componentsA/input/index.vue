<template>
    <DemoPage :title="title" :desc="text('支持边框与形状、清空、密码、插槽、格式化和 Form 校验联动的单行输入。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-control-stack demo-input-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Live configuration' : '实时配置' }}</text>
                <snake-input
                    v-model="username"
                    :type="String(state.inputType)"
                    :border="String(state.inputBorder)"
                    :shape="String(state.inputShape)"
                    :size="String(state.inputSize)"
                    :input-align="String(state.inputAlign)"
                    :maxlength="Number(state.inputMaxlength)"
                    :clearable="Boolean(state.inputClearable)"
                    :disabled="Boolean(state.inputDisabled)"
                    :show-password="String(state.inputType) === 'password'"
                    :placeholder="String(state.inputPlaceholder || text('请输入用户名'))"
                />
                <text class="demo-variant-caption">
                    {{ isEnglish ? 'Current value' : '当前值' }}：{{ username || '—' }}
                </text>

                <text class="demo-variant-title">{{ isEnglish ? 'Password' : '密码框' }}</text>
                <snake-input
                    v-model="password"
                    type="password"
                    show-password
                    clearable
                    :placeholder="isEnglish ? 'Password with visibility toggle' : '密码输入，可切换明文'"
                />

                <text class="demo-variant-title">{{ isEnglish ? 'Border modes' : '边框模式' }}</text>
                <snake-input v-model="borderValue" border="surround" :placeholder="text('surround 全边框')" />
                <snake-input v-model="borderValue" border="bottom" :placeholder="text('bottom 底部线')" />
                <snake-input v-model="borderValue" border="none" :placeholder="text('none 无边框')" />

                <text class="demo-variant-title">{{ isEnglish ? 'Shape and size' : '形状与尺寸' }}</text>
                <snake-input v-model="sizeValue" shape="circle" size="small" :placeholder="text('circle / small')" />
                <snake-input v-model="sizeValue" shape="circle" :placeholder="text('circle / default')" />
                <snake-input v-model="sizeValue" shape="circle" size="large" :placeholder="text('circle / large')" />

                <text class="demo-variant-title">{{ isEnglish ? 'Disabled and readonly' : '禁用与只读' }}</text>
                <snake-input v-model="stateValue" disabled :placeholder="text('禁用状态')" />
                <snake-input v-model="stateValue" readonly :placeholder="text('只读状态')" />

                <text class="demo-variant-title">{{ isEnglish ? 'Prefix, suffix and slots' : '前后图标与插槽' }}</text>
                <snake-input
                    v-model="iconValue"
                    prefix-icon="search"
                    suffix-icon="close"
                    clearable
                    :placeholder="text('前后图标')"
                />
                <snake-input v-model="smsValue" :maxlength="6" :placeholder="text('请输入验证码')">
                    <template #suffix>
                        <snake-button size="small" type="primary" plain @click="sendSms">
                            {{ smsCooldown > 0 ? `${smsCooldown}s` : text('获取验证码') }}
                        </snake-button>
                    </template>
                </snake-input>

                <text class="demo-variant-title">{{ isEnglish ? 'Content alignment' : '内容对齐' }}</text>
                <snake-input v-model="alignValue" input-align="left" :placeholder="text('left 左对齐')" />
                <snake-input v-model="alignValue" input-align="center" :placeholder="text('center 居中')" />
                <snake-input v-model="alignValue" input-align="right" :placeholder="text('right 右对齐')" />

                <text class="demo-variant-title">{{ isEnglish ? 'Formatted input' : '格式化输入' }}</text>
                <snake-input
                    v-model="code"
                    border="bottom"
                    :maxlength="6"
                    :formatter="digitsOnly"
                    :placeholder="isEnglish ? 'Six digits only' : '仅保留 6 位数字'"
                />
                <text class="demo-variant-caption">
                    {{ isEnglish ? 'Formatted value' : '格式化结果' }}：{{ code || '—' }}
                </text>

                <text class="demo-variant-title">{{ isEnglish ? 'Form validation' : '表单联动' }}</text>
                <snake-form ref="formRef" :model="form" :rules="rules" label-width="65">
                    <snake-form-item :label="text('姓名')" prop="name">
                        <snake-input v-model="form.name" :placeholder="text('2–12 个字符')" clearable />
                    </snake-form-item>
                    <snake-form-item :label="text('手机号')" prop="mobile">
                        <snake-input
                            v-model="form.mobile"
                            type="number"
                            :maxlength="11"
                            :placeholder="text('11 位手机号')"
                        />
                    </snake-form-item>
                </snake-form>
                <snake-button size="small" @click="submitForm">{{ text('提交校验') }}</snake-button>
                <text class="demo-variant-caption">{{ formMessage }}</text>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
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
import type { FormExpose, FormRules } from '../../../uni_modules/snake-ui/components/snake-form/types';
const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const username = ref('');
const password = ref('');
const borderValue = ref('');
const sizeValue = ref('');
const stateValue = ref(text('预置内容'));
const iconValue = ref('');
const smsValue = ref('');
const alignValue = ref('78.50');
const code = ref('');
const smsCooldown = ref(0);
const controls: DemoControl[] = [
    {
        key: 'inputType',
        label: '输入类型',
        type: 'select',
        defaultValue: 'text',
        options: [
            { label: '文本', value: 'text' },
            { label: '数字', value: 'number' },
            { label: '小数键盘', value: 'digit' },
            { label: '身份证', value: 'idcard' },
            { label: '密码', value: 'password' }
        ]
    },
    {
        key: 'inputBorder',
        label: '边框模式',
        type: 'select',
        defaultValue: 'surround',
        options: [
            { label: '全边框', value: 'surround' },
            { label: '底部线', value: 'bottom' },
            { label: '无边框', value: 'none' }
        ]
    },
    {
        key: 'inputShape',
        label: '圆角风格',
        type: 'select',
        defaultValue: 'square',
        options: [
            { label: '方角', value: 'square' },
            { label: '胶囊', value: 'circle' }
        ]
    },
    {
        key: 'inputSize',
        label: '组件尺寸',
        type: 'select',
        defaultValue: 'default',
        options: [
            { label: 'small', value: 'small' },
            { label: 'default', value: 'default' },
            { label: 'large', value: 'large' }
        ]
    },
    {
        key: 'inputAlign',
        label: '内容对齐',
        type: 'select',
        defaultValue: 'left',
        options: [
            { label: '左对齐', value: 'left' },
            { label: '居中', value: 'center' },
            { label: '右对齐', value: 'right' }
        ]
    },
    {
        key: 'inputMaxlength',
        label: '最大字数',
        type: 'slider',
        defaultValue: 20,
        min: 6,
        max: 40,
        step: 2,
        unit: '字'
    },
    { key: 'inputClearable', label: '允许清空', type: 'switch', defaultValue: true },
    { key: 'inputDisabled', label: '禁用状态', type: 'switch', defaultValue: false },
    { key: 'inputPlaceholder', label: '占位文字', type: 'input', defaultValue: '' }
];
const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({
        ...control,
        label: demoText(control.label),
        options: control.options?.map(option => ({ ...option, label: demoText(option.label) }))
    }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('input', '输入框');
});
const formRef = ref<FormExpose>();
const form = reactive({ name: '', mobile: '' });
const formMessage = ref(demoText('提交后执行规则校验'));
function createRules(): FormRules {
    return {
        name: [
            { required: true, message: demoText('请输入姓名'), trigger: ['change', 'blur'] },
            { min: 2, max: 12, message: demoText('姓名为 2–12 个字符'), trigger: ['change', 'blur'] }
        ],
        mobile: [
            { required: true, message: demoText('请输入手机号'), trigger: ['change', 'blur'] },
            {
                validator: (_rule, value) => /^1\d{10}$/.test(String(value || '')),
                message: demoText('手机号格式不正确'),
                trigger: ['change', 'blur']
            }
        ]
    };
}
const rules = ref<FormRules>(createRules());
watch(localeName, () => {
    rules.value = createRules();
    formRef.value?.setRules(rules.value);
    formMessage.value = demoText('提交后执行规则校验');
    stateValue.value = demoText('预置内容');
});
function updateValue(key: string, nextValue: DemoValue) {
    state[key] = nextValue;
}
function digitsOnly(value: string) {
    return value.replace(/\D/g, '');
}
async function submitForm() {
    const valid = await formRef.value?.validate((_valid, errors) => {
        if (!_valid) formMessage.value = `${demoText('校验失败')}: ${errors[0]?.message || demoText('请检查表单')}`;
    });
    if (valid) formMessage.value = `${demoText('校验通过')}: ${form.name}`;
}
let smsTimer: ReturnType<typeof setInterval> | undefined;
function sendSms() {
    if (smsCooldown.value > 0) return;
    smsCooldown.value = 60;
    smsTimer = setInterval(() => {
        smsCooldown.value -= 1;
        if (smsCooldown.value <= 0 && smsTimer) clearInterval(smsTimer);
    }, 1000);
}
</script>
<style scoped>
.demo-control-stack {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 12px;
}
.demo-variant-title {
    color: var(--snake-color-text);
    font-size: 14px;
    font-weight: 600;
}
.demo-variant-title:not(:first-child) {
    margin-top: 6px;
}
.demo-variant-caption {
    color: var(--snake-color-text-secondary);
    font-size: 13px;
}
</style>
