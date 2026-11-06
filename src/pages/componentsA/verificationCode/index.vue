<template>
    <DemoPage :title="title" :desc="text('无 UI 的验证码倒计时状态机，文案与按钮由宿主自由组合。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-control-stack">
                <text class="demo-variant-title">{{ isEnglish ? 'Basic usage' : '基础用法' }}</text>
                <view class="demo-vc-row">
                    <snake-input
                        v-model="phone"
                        type="number"
                        :maxlength="11"
                        border="surround"
                        :placeholder="text('请输入手机号')"
                        custom-class="demo-vc-input"
                    />
                    <snake-button size="small" type="primary" plain :disabled="!canGet" @click="startCode">
                        {{ codeText }}
                    </snake-button>
                </view>
                <snake-verification-code
                    ref="codeRef"
                    :seconds="Number(state.vcSeconds)"
                    :keep-running="Boolean(state.vcKeepRunning)"
                    :start-text="String(state.vcStartText)"
                    :change-text="String(state.vcChangeText)"
                    :end-text="String(state.vcEndText)"
                    @change="onCodeChange"
                    @start="onEvent('start')"
                    @end="onEvent('end')"
                />
                <text class="demo-variant-caption">{{ eventLog }}</text>
                <snake-button size="small" @click="resetCode">{{ text('重置倒计时') }}</snake-button>

                <text class="demo-variant-title">{{ isEnglish ? 'Keep running' : '跨页面续跑' }}</text>
                <text class="demo-variant-caption">
                    {{
                        isEnglish
                            ? 'With keepRunning on, the remaining seconds survive page exits and H5 refreshes.'
                            : '开启 keepRunning 后，倒计时剩余秒数在页面返回再进入或 H5 刷新后自动恢复。'
                    }}
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
import type { VerificationCodeExpose } from '../../../uni_modules/snake-ui/components/snake-verification-code/types';
const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const phone = ref('');
const codeText = ref('');
const eventLog = ref(demoText('等待开始倒计时'));
const codeRef = ref<VerificationCodeExpose>();
const canGet = computed(() => Boolean(codeRef.value?.canGetCode));
const controls: DemoControl[] = [
    {
        key: 'vcSeconds',
        label: '倒计时秒数',
        type: 'slider',
        defaultValue: 60,
        min: 10,
        max: 120,
        step: 5,
        unit: 's'
    },
    { key: 'vcKeepRunning', label: '跨页面续跑', type: 'switch', defaultValue: false },
    { key: 'vcStartText', label: '开始文案', type: 'input', defaultValue: '' },
    { key: 'vcChangeText', label: '倒计时文案', type: 'input', defaultValue: '' },
    { key: 'vcEndText', label: '结束文案', type: 'input', defaultValue: '' }
];
const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('verification-code', '验证码倒计时');
});
function updateValue(key: string, nextValue: DemoValue) {
    state[key] = nextValue;
}
function onCodeChange(text: string) {
    codeText.value = text;
}
function onEvent(name: string) {
    eventLog.value = `${demoText('最近事件')}: ${name}`;
}
async function startCode() {
    // 演示场景：直接开始倒计时，真实业务先发送验证码请求
    codeRef.value?.start();
    eventLog.value = `${demoText('最近事件')}: start`;
}
function resetCode() {
    codeRef.value?.reset();
    eventLog.value = `${demoText('最近事件')}: reset`;
}
</script>
<style scoped>
.demo-control-stack {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 12px;
}
.demo-variant-caption {
    color: var(--snake-color-text-secondary);
    font-size: 13px;
}
.demo-vc-row {
    display: flex;
    align-items: center;
    gap: 8px;
}
.demo-vc-row :deep(.demo-vc-input) {
    flex: 1;
}
</style>
