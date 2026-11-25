<template>
    <DemoPage :title="title" :desc="text('在少量互斥选项之间快速切换，提供胶囊滑块与描边分段两种模式。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-subsection-showcase">
                <text class="demo-variant-title">{{ text('胶囊滑块') }}</text>
                <snake-subsection
                    :list="sectionList"
                    :current="Number(state.subsectionCurrent)"
                    mode="button"
                    :bold="Boolean(state.subsectionBold)"
                    :animation="Boolean(state.subsectionAnimation)"
                    :vibrate-short="Boolean(state.subVibrate)"
                    :active-color="String(state.subActiveColor)"
                    :inactive-color="String(state.subInactiveColor)"
                    :bg-color="String(state.subBgColor)"
                    :button-color="String(state.subButtonColor)"
                    :font-size="Number(state.subFontSize)"
                    :height="Number(state.subHeight)"
                    @change="state.subsectionCurrent = $event"
                />
                <text class="demo-variant-title">{{ text('描边分段') }}</text>
                <snake-subsection
                    :list="sectionList"
                    :current="Number(state.subsectionCurrent)"
                    mode="subsection"
                    :bold="Boolean(state.subsectionBold)"
                    :animation="Boolean(state.subsectionAnimation)"
                    :vibrate-short="Boolean(state.subVibrate)"
                    :active-color="String(state.subActiveColor)"
                    :inactive-color="String(state.subInactiveColor)"
                    :bg-color="String(state.subBgColor)"
                    :button-color="String(state.subButtonColor)"
                    :font-size="Number(state.subFontSize)"
                    :height="Number(state.subHeight)"
                    @change="state.subsectionCurrent = $event"
                />
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('项数与禁用')">
            <view class="demo-stack">
                <text class="demo-variant-title">{{ text('两项') }}</text>
                <snake-subsection v-model:current="twoCurrent" :list="twoList" />
                <text class="demo-variant-title">{{ text('五项') }}</text>
                <snake-subsection v-model:current="fiveCurrent" :list="fiveList" />
                <text class="demo-variant-title">{{ text('禁用项') }}</text>
                <snake-subsection v-model:current="disabledCurrent" mode="subsection" :list="disabledList" />
                <text class="demo-variant-title">{{ text('整组禁用') }}</text>
                <snake-subsection v-model:current="groupCurrent" :list="sectionList" disabled />
                <text class="demo-variant-sub">{{ text('选中项走 v-model:current 双向绑定，被禁用的分段跳过') }}</text>
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('切换内容')">
            <view class="demo-stack">
                <text class="demo-variant-title">{{ text('订单状态') }}</text>
                <snake-subsection v-model:current="orderCurrent" :list="sectionList" />
                <view class="demo-subsection-panel">
                    <text class="demo-subsection-panel__title">{{ orderContent.title }}</text>
                    <text class="demo-subsection-panel__desc">{{ orderContent.desc }}</text>
                </view>
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
import type { SubsectionOption } from '../../../uni_modules/snake-ui/components/snake-subsection/types';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');

const sectionList = computed(() =>
    isEnglish.value ? ['Pending payment', 'To ship', 'To receive'] : ['待付款', '待发货', '待收货']
);
const twoList = computed(() => (isEnglish.value ? ['Free shipping', 'Paid shipping'] : ['包邮', '不包邮']));
const fiveList = computed(() =>
    isEnglish.value
        ? ['All', 'Pending payment', 'To ship', 'To receive', 'Closed']
        : ['全部', '待付款', '待发货', '待收货', '已关闭']
);
/** 对象选项才能禁用：禁用的分段不可点，键盘方向键也会跳过。 */
const disabledList = computed<SubsectionOption[]>(() =>
    isEnglish.value
        ? [{ name: 'Pending payment' }, { name: 'To ship', disabled: true }, { name: 'To receive' }]
        : [{ name: '待付款' }, { name: '待发货', disabled: true }, { name: '待收货' }]
);

const twoCurrent = ref(0);
const fiveCurrent = ref(2);
const disabledCurrent = ref(0);
const groupCurrent = ref(0);
const orderCurrent = ref(0);
const orderContent = computed(() => {
    const list = isEnglish.value
        ? [
              { title: '3 orders to pay', desc: 'Total ¥286.00' },
              { title: '2 orders to ship', desc: 'Ships within 48 hours' },
              { title: '1 order in transit', desc: 'Arrives tomorrow' }
          ]
        : [
              { title: '3 笔订单待支付', desc: '合计 ¥286.00' },
              { title: '2 笔订单待发货', desc: '48 小时内发出' },
              { title: '1 笔订单运输中', desc: '预计明天送达' }
          ];
    return list[Number(orderCurrent.value)] ?? list[0];
});

const controls: DemoControl[] = [
    {
        key: 'subsectionCurrent',
        label: '当前选项',
        type: 'select',
        defaultValue: 0,
        options: [
            { label: '待付款', value: 0 },
            { label: '待发货', value: 1 },
            { label: '待收货', value: 2 }
        ]
    },
    { key: 'subsectionBold', label: '激活项加粗', type: 'switch', defaultValue: true },
    { key: 'subsectionAnimation', label: '滑块动画', type: 'switch', defaultValue: true },
    { key: 'subVibrate', label: '切换震动', type: 'switch', defaultValue: false },
    { key: 'subFontSize', label: '字号', type: 'slider', defaultValue: 15, min: 12, max: 18, step: 1, unit: 'px' },
    { key: 'subHeight', label: '高度', type: 'slider', defaultValue: 35, min: 30, max: 48, step: 1, unit: 'px' },
    {
        key: 'subActiveColor',
        label: '激活颜色',
        type: 'select',
        defaultValue: '#06D290',
        options: [
            { label: '品牌绿', value: '#06D290' },
            { label: '蓝色', value: '#2563eb' },
            { label: '橙色', value: '#FF6A0C' }
        ]
    },
    {
        key: 'subInactiveColor',
        label: '未激活颜色',
        type: 'select',
        defaultValue: '#606266',
        options: [
            { label: '次要文字', value: '#606266' },
            { label: '中灰', value: '#909399' },
            { label: '蓝色', value: '#2563eb' }
        ]
    },
    {
        key: 'subBgColor',
        label: '背景颜色',
        type: 'select',
        // 默认取组件真实的轨道色（--snake-color-surface-muted）；若给白色，白胶囊压在白轨道上会整个消失
        defaultValue: '#f1f1f1',
        options: [
            { label: '浅灰', value: '#f1f1f1' },
            { label: '白色', value: '#ffffff' },
            { label: '薄荷', value: '#06D2901A' }
        ]
    },
    {
        key: 'subButtonColor',
        label: '按钮颜色',
        type: 'select',
        defaultValue: '#ffffff',
        options: [
            { label: '白色', value: '#ffffff' },
            { label: '浅灰', value: '#f1f1f1' },
            { label: '薄荷', value: '#06D2901A' }
        ]
    }
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
    return demoTitle('subsection', '分段选择器');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
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
.demo-subsection-panel {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 16px;
    background-color: var(--snake-color-surface-muted);
    border-radius: var(--snake-radius-base);
}
.demo-subsection-panel__title {
    font-size: 15px;
    font-weight: 600;
    color: var(--snake-color-text);
}
.demo-subsection-panel__desc {
    font-size: 12px;
    color: var(--snake-color-text-secondary);
}
</style>
