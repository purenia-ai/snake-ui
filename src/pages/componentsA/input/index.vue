<template>
    <DemoPage :title="title" :desc="text('支持边框与形状、清空、密码、插槽、格式化和 Form 校验联动的单行输入。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-input-showcase">
                <text class="demo-variant-title">{{ text('实时配置') }}</text>
                <snake-input
                    v-model="username"
                    :type="String(state.inputType)"
                    :border="String(state.inputBorder)"
                    :shape="String(state.inputShape)"
                    :size="String(state.inputSize)"
                    :input-align="String(state.inputAlign)"
                    :maxlength="Number(state.inputMaxlength)"
                    :clearable="Boolean(state.inputClearable)"
                    :clear-trigger="clearTriggerValue"
                    :show-word-limit="Boolean(state.inputShowWordLimit)"
                    :disabled="Boolean(state.inputDisabled)"
                    :show-password="String(state.inputType) === 'password'"
                    :placeholder="String(state.inputPlaceholder || text('请输入用户名'))"
                    @input="onEvent('input', $event)"
                    @change="onEvent('change', $event)"
                    @clear="onEvent('clear', '')"
                />
                <text class="demo-input-caption">{{ text('当前值') }}：{{ username || '—' }}</text>
                <text class="demo-input-caption">{{ lastEvent || text('暂无事件') }}</text>
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('尺寸与主题')">
            <view class="demo-input-showcase">
                <text class="demo-variant-title">{{ text('尺寸档位') }}</text>
                <snake-input
                    v-model="sizeValue"
                    size="small"
                    border="surround"
                    :placeholder="text('small / 32px / 13px')"
                />
                <snake-input v-model="sizeValue" border="surround" :placeholder="text('default / 40px / 14px')" />
                <snake-input
                    v-model="sizeValue"
                    size="large"
                    border="surround"
                    :placeholder="text('large / 48px / 16px')"
                />
                <snake-input
                    v-model="sizeValue"
                    :height="56"
                    border="surround"
                    :placeholder="text('height 覆盖高度')"
                />
                <text class="demo-variant-title">{{ text('主题变量覆盖') }}</text>
                <snake-input
                    v-model="themeValue"
                    border="surround"
                    custom-class="demo-input-themed"
                    :placeholder="text('主题变量覆盖')"
                />
            </view>
            <text class="demo-input-hint">{{
                text('size 现在同时决定高度、字号与图标大小；也可以用 CSS 变量单独覆盖')
            }}</text>
        </DemoSection>
        <DemoSection variant="preview" :title="text('清除与字数')">
            <view class="demo-input-showcase">
                <snake-input v-model="clearValue" clearable :placeholder="text('有内容就显示清除按钮')" />
                <snake-input
                    v-model="focusClearValue"
                    clearable
                    clear-trigger="focus"
                    :placeholder="text('仅聚焦时显示清除按钮')"
                />
                <snake-input
                    v-model="limitValue"
                    show-word-limit
                    :maxlength="12"
                    clearable
                    :placeholder="text('字数统计，上限 12')"
                />
            </view>
            <text class="demo-input-hint">{{ text('失焦后依然可以一键清空；字数按字符计数，emoji 算一个') }}</text>
        </DemoSection>
        <DemoSection variant="preview" :title="text('只读、禁用与错误态')">
            <view class="demo-input-showcase">
                <snake-input
                    v-model="readonlyValue"
                    readonly
                    :placeholder="text('只读：点击整块可打开选择器')"
                    @click="onReadonlyClick"
                />
                <snake-input v-model="readonlyValue" disabled :placeholder="text('禁用状态')" />
                <snake-input v-model="errorValue" error border="surround" :placeholder="text('强制错误态')" />
            </view>
            <text class="demo-input-hint">{{
                readonlyTip || text('只读态会把点击交给外层，适合「点输入框打开选择器」')
            }}</text>
        </DemoSection>
        <DemoSection variant="preview" :title="text('密码、格式化与去空格')">
            <view class="demo-input-showcase">
                <snake-input
                    v-model="password"
                    type="password"
                    show-password
                    clearable
                    :placeholder="text('密码输入，可切换明文')"
                />
                <snake-input
                    v-model="code"
                    border="bottom"
                    :maxlength="6"
                    :formatter="digitsOnly"
                    :placeholder="text('仅保留数字，最多 6 位')"
                />
                <text class="demo-input-caption">{{ text('格式化结果') }}：{{ code || '—' }}</text>
                <snake-input v-model="trimValue" border="bottom" trim :placeholder="text('失焦时去掉首尾空格')" />
                <text class="demo-input-caption">{{ text('去空格结果') }}：{{ trimDisplay }}</text>
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('方法调用与插槽')">
            <view class="demo-input-showcase">
                <snake-input
                    ref="inputRef"
                    v-model="methodValue"
                    clearable
                    :placeholder="text('通过 ref 调用 focus() / blur() / clear()')"
                />
                <view class="demo-input-tools">
                    <snake-button size="small" :text="text('聚焦')" @click="callFocus" />
                    <snake-button size="small" :text="text('失焦')" @click="callBlur" />
                    <snake-button size="small" :text="text('清空')" @click="callClear" />
                </view>
                <text class="demo-input-caption">{{ text('当前值') }}：{{ methodValue || '—' }}</text>
                <snake-input v-model="smsValue" :maxlength="6" :placeholder="text('请输入验证码')">
                    <template #suffix>
                        <snake-button size="small" type="primary" plain @click="sendSms">
                            {{ smsCooldown > 0 ? `${smsCooldown}s` : text('获取验证码') }}
                        </snake-button>
                    </template>
                </snake-input>
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('表单联动')">
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
            <view class="demo-input-tools">
                <snake-button size="small" :text="text('提交校验')" @click="submitForm" />
            </view>
            <text class="demo-input-hint">{{ formMessage }}</text>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { InputExpose } from '../../../uni_modules/snake-ui';
import type { FormExpose, FormRules } from '../../../uni_modules/snake-ui/components/snake-form/types';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const username = ref('');
const clearValue = ref('');
const sizeValue = ref('');
const themeValue = ref('');
const focusClearValue = ref('');
const limitValue = ref('');
const readonlyValue = ref('静安寺街道 128 号');
const errorValue = ref('');
const password = ref('');
const code = ref('');
const trimValue = ref('');
const methodValue = ref('');
const smsValue = ref('');
const smsCooldown = ref(0);
const readonlyTip = ref('');
const lastEvent = ref('');
const inputRef = ref<InputExpose | null>(null);
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
    {
        key: 'inputClearTrigger',
        label: '清空按钮时机',
        type: 'select',
        defaultValue: 'always',
        options: [
            { label: '有内容即显示', value: 'always' },
            { label: '仅聚焦时', value: 'focus' }
        ]
    },
    { key: 'inputShowWordLimit', label: '显示字数', type: 'switch', defaultValue: false },
    { key: 'inputDisabled', label: '禁用状态', type: 'switch', defaultValue: false },
    { key: 'inputPlaceholder', label: '占位文字', type: 'input', defaultValue: '' }
];
const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
/** 控制面板的值是 string，这里收窄成组件要求的枚举。 */
const clearTriggerValue = computed(() => (state.inputClearTrigger === 'focus' ? 'focus' : 'always'));
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
const trimDisplay = computed(() => {
    const _locale = localeName.value;
    const _value = trimValue.value;
    return _value ? JSON.stringify(_value) : '—';
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
    readonlyValue.value = demoText('静安寺街道 128 号');
    readonlyTip.value = '';
});
function updateValue(key: string, nextValue: DemoValue) {
    state[key] = nextValue;
}
function digitsOnly(value: string) {
    return value.replace(/\D/g, '');
}
function onReadonlyClick() {
    readonlyTip.value = text('收到 click：可以在这里打开地址选择器');
}
/** 把 input / change / clear 事件打到页面上，便于确认什么时候派发。 */
function onEvent(name: string, value: unknown) {
    lastEvent.value = `${name}${value === undefined || value === '' ? '' : `：${String(value)}`}`;
}
function callFocus() {
    inputRef.value?.focus();
}
function callBlur() {
    inputRef.value?.blur();
}
function callClear() {
    inputRef.value?.clear();
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
.demo-input-showcase {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.demo-input-caption,
.demo-input-hint {
    color: var(--snake-color-text-secondary);
    font-size: 13px;
}
.demo-input-hint {
    display: block;
    margin-top: 10px;
    color: var(--snake-color-text-muted);
    font-size: 12px;
}
.demo-input-tools {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
/* 主题变量覆盖：只在本页作用域内生效 */
.demo-input-themed {
    --snake-input-height: 56px;
    --snake-input-font-size: 18px;
    --snake-input-border-color: var(--snake-color-primary, #06d290);
    --snake-input-radius: 14px;
    --snake-input-icon-color: var(--snake-color-primary, #06d290);
}
</style>
