<template>
    <DemoPage :title="title" :desc="text('用底部虚拟键盘输入数字、金额与身份证号。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-keyboard-showcase">
                <text class="demo-variant-title">{{ text('验证码') }}</text>
                <view class="demo-keyboard-cells" @click="openPad('code')">
                    <view
                        v-for="(cell, index) in codeCells"
                        :key="index"
                        class="demo-keyboard-cell"
                        :class="{ 'demo-keyboard-cell--filled': cell }"
                    >
                        <text>{{ cell }}</text>
                    </view>
                </view>
                <snake-button type="primary" :custom-style="{ width: '120px' }" @click="openPad('code')">
                    {{ text('打开键盘') }}
                </snake-button>
                <text class="demo-variant-sub">{{ text('最近事件') }}：{{ lastEvent }}</text>
                <snake-keyboard
                    v-model="code"
                    v-model:visible="padVisible.code"
                    :mode="state.kbMode"
                    :maxlength="Number(state.kbMaxlength)"
                    :extra-key="String(state.kbExtra)"
                    :random-key-order="Boolean(state.kbRandom)"
                    :show-delete-key="Boolean(state.kbDelete)"
                    :show-confirm="Boolean(state.kbConfirm)"
                    :title="String(state.kbTitle)"
                    :confirm-text="String(state.kbConfirmText) || undefined"
                    :round="Boolean(state.kbRound)"
                    :safe-area-inset-bottom="Boolean(state.kbSafeArea)"
                    :close-on-click-overlay="Boolean(state.kbMaskClose)"
                    :root-portal="Boolean(state.kbRootPortal)"
                    :disabled="Boolean(state.kbDisabled)"
                    @input="onInput"
                    @delete="onDelete"
                    @confirm="onConfirm"
                    @close="onClose"
                />
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('金额与身份证')">
            <view class="demo-stack">
                <text class="demo-variant-title">{{ text('金额') }}</text>
                <view class="demo-keyboard-amount" @click="openPad('amount')">
                    <text class="demo-keyboard-amount__value">{{ amount || '0.00' }}</text>
                </view>
                <snake-button :custom-style="{ width: '120px' }" @click="openPad('amount')">
                    {{ text('输入金额') }}
                </snake-button>
                <snake-keyboard
                    v-model="amount"
                    v-model:visible="padVisible.amount"
                    mode="custom"
                    extra-key="."
                    :title="text('输入金额')"
                />
                <text class="demo-variant-title">{{ text('身份证') }}</text>
                <text class="demo-variant-sub">{{ idCard || text('尚未输入') }}</text>
                <snake-button :custom-style="{ width: '120px' }" @click="openPad('idCard')">
                    {{ text('输入身份证') }}
                </snake-button>
                <snake-keyboard
                    v-model="idCard"
                    v-model:visible="padVisible.idCard"
                    extra-key="X"
                    :maxlength="18"
                    :title="text('输入身份证')"
                />
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('车牌')">
            <view class="demo-stack">
                <text class="demo-variant-title">{{ text('车牌号') }}</text>
                <view class="demo-keyboard-plate" @click="openPad('plate')">
                    {{ plate || text('请输入车牌号') }}
                </view>
                <snake-button :custom-style="{ width: '120px' }" @click="openPad('plate')">
                    {{ text('输入车牌') }}
                </snake-button>
                <snake-keyboard
                    v-model="plate"
                    v-model:visible="padVisible.plate"
                    mode="car"
                    :maxlength="8"
                    auto-switch-lang
                    :title="text('请输入车牌号')"
                />
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { demoTitle, localizeDemoControls, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import { demoState, setDemoValue } from '../../../common/demo-state';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const code = ref('');
const amount = ref('');
const idCard = ref('');
const plate = ref('');
const lastEvent = ref('—');

type PadName = 'code' | 'amount' | 'idCard' | 'plate';
/** 四个示例的弹层开关统一命名，「禁用键盘」开关对它们一致生效。 */
const padVisible = reactive<Record<PadName, boolean>>({
    code: false,
    amount: false,
    idCard: false,
    plate: false
});

const controls = [
    {
        key: 'kbMode',
        label: '键盘形态',
        type: 'select',
        defaultValue: 'default',
        options: [
            { label: '标准数字键盘', value: 'default' },
            { label: '右侧大键', value: 'custom' }
        ]
    },
    {
        key: 'kbExtra',
        label: '额外按键',
        type: 'select',
        defaultValue: '',
        options: [
            { label: '收起键盘键', value: '' },
            { label: '小数点 .', value: '.' },
            { label: '身份证 X', value: 'X' }
        ]
    },
    { key: 'kbMaxlength', label: '最大长度', type: 'slider', defaultValue: 6, min: 4, max: 12, step: 1 },
    { key: 'kbRandom', label: '随机按键顺序', type: 'switch', defaultValue: false },
    { key: 'kbDelete', label: '显示删除键', type: 'switch', defaultValue: true },
    { key: 'kbConfirm', label: '显示确认键', type: 'switch', defaultValue: true },
    { key: 'kbTitle', label: '键盘标题', type: 'input', defaultValue: '请输入验证码', placeholder: '留空则不显示标题' },
    { key: 'kbConfirmText', label: '确认文案', type: 'input', defaultValue: '', placeholder: '完成' },
    { key: 'kbRound', label: '面板圆角', type: 'switch', defaultValue: false },
    { key: 'kbSafeArea', label: '底部安全区适配', type: 'switch', defaultValue: true },
    { key: 'kbMaskClose', label: '点击遮罩关闭', type: 'switch', defaultValue: true },
    { key: 'kbRootPortal', label: '传入根节点', type: 'switch', defaultValue: false },
    { key: 'kbDisabled', label: '禁用键盘', type: 'switch', defaultValue: false }
] as const satisfies readonly DemoControl[];
const state = demoState(controls);
/** 验证码展示格与 maxlength 同步，面板把长度调大后输入不会被格子裁掉。 */
const codeCells = computed(() => {
    const length = Number(state.kbMaxlength) || 6;
    return Array.from({ length }, (_item, index) => code.value[index] ?? '');
});
/** extraKey 留空时，标准形态渲染「收起键盘」键，右侧大键形态没有这个键。 */
const extraEmptyLabel = computed(() => (state.kbMode === 'custom' ? '无额外按键' : '收起键盘键'));
const localizedControls = computed(() => {
    const list = localizeDemoControls(controls);
    return list.map(control =>
        control.key === 'kbExtra' && control.options
            ? {
                  ...control,
                  options: control.options.map((option, index) =>
                      index === 0 ? { ...option, label: text(extraEmptyLabel.value) } : option
                  )
              }
            : control
    );
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('keyboard', '虚拟键盘');
});

function updateValue(key: string, value: DemoValue) {
    setDemoValue(state, key, value);
}

/** 「禁用键盘」开关对四个示例入口一致生效，不能只挡一个。 */
function openPad(name: PadName) {
    if (state.kbDisabled) return;
    padVisible[name] = true;
}

function onInput(key: string) {
    lastEvent.value = `${text('输入')} ${key}`;
}

function onDelete() {
    lastEvent.value = text('删除');
}

function onConfirm(value: string) {
    lastEvent.value = `${text('确认')}：${value || text('（空）')}`;
}

function onClose() {
    lastEvent.value = text('已关闭');
}
</script>

<style scoped>
.demo-stack {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.demo-variant-sub {
    color: var(--snake-color-text-muted);
    font-size: 12px;
}
.demo-keyboard-cells {
    display: flex;
    gap: 8px;
}
.demo-keyboard-cell {
    display: flex;
    flex: 1;
    min-width: 0;
    align-items: center;
    justify-content: center;
    height: 44px;
    font-size: 18px;
    font-weight: 600;
    color: var(--snake-color-text);
    background-color: var(--snake-color-surface-muted);
    border-radius: var(--snake-radius-base);
}
.demo-keyboard-cell--filled {
    color: var(--snake-color-primary-ink);
    background-color: var(--snake-color-primary);
}
.demo-keyboard-amount {
    display: flex;
    align-items: center;
    height: 56px;
    padding: 0 16px;
    background-color: var(--snake-color-surface-muted);
    border-radius: var(--snake-radius-base);
}
.demo-keyboard-amount__value {
    font-size: 26px;
    font-weight: 600;
    color: var(--snake-color-text);
}
.demo-keyboard-plate {
    display: flex;
    align-items: center;
    height: 56px;
    padding: 0 16px;
    font-size: 20px;
    font-weight: 600;
    color: var(--snake-color-text);
    letter-spacing: 2px;
    background-color: var(--snake-color-surface-muted);
    border-radius: var(--snake-radius-base);
}
</style>
