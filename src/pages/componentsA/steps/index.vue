<template>
    <DemoPage :title="title" :desc="text('按流程顺序展示进度，用于订单状态与物流轨迹。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-steps-showcase">
                <view class="demo-steps-item">
                    <text class="demo-steps-hint">{{ text('拖动下方「当前步骤」查看状态推导') }}</text>
                    <snake-steps
                        :current="Number(state.current)"
                        :direction="String(state.direction)"
                        :align-center="Boolean(state.alignCenter)"
                        :dot="Boolean(state.dot)"
                    >
                        <snake-step :title="text('提交订单')" :description="text('支付成功')" />
                        <snake-step :title="text('商家发货')" :description="text('预计 24 小时内')" />
                        <snake-step :title="text('运输中')" :description="text('已到达转运中心')" />
                        <snake-step :title="text('确认收货')" />
                    </snake-steps>
                </view>
                <view class="demo-steps-item">
                    <text class="demo-steps-hint">{{ text('点状模式适合物流轨迹') }}</text>
                    <snake-steps :current="2" dot>
                        <snake-step :title="text('已下单')" description="10:20" />
                        <snake-step :title="text('已发货')" description="10:45" />
                        <snake-step :title="text('运输中')" description="14:08" />
                        <snake-step :title="text('已签收')" />
                    </snake-steps>
                </view>
                <view class="demo-steps-item">
                    <text class="demo-steps-hint">{{ text('异常步骤标红圆点、叉号与标题') }}</text>
                    <snake-steps :current="1">
                        <snake-step :title="text('提交申请')" />
                        <snake-step :title="text('审核未通过')" :description="text('已超出售后时限')" status="error" />
                        <snake-step :title="text('退款到账')" />
                    </snake-steps>
                </view>
                <view class="demo-steps-item">
                    <text class="demo-steps-hint">{{ text('icon 优先于序号与对勾') }}</text>
                    <snake-steps :current="1">
                        <snake-step :title="text('待付款')" icon="rmb" />
                        <snake-step :title="text('待发货')" icon="bag" />
                        <snake-step :title="text('待收货')" icon="car" />
                    </snake-steps>
                </view>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const controls: DemoControl[] = [
    { key: 'current', label: '当前步骤', type: 'slider', defaultValue: 1, min: 0, max: 3, step: 1, unit: '' },
    {
        key: 'direction',
        label: '排列方向',
        type: 'select',
        defaultValue: 'horizontal',
        options: [
            { label: '横向', value: 'horizontal' },
            { label: '纵向', value: 'vertical' }
        ]
    },
    { key: 'alignCenter', label: '居中对齐', type: 'switch', defaultValue: true },
    { key: 'dot', label: '点状模式', type: 'switch', defaultValue: false }
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
    return demoTitle('steps', '步骤条');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<style scoped>
.demo-steps-showcase {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 12px 4px;
}

.demo-steps-item {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.demo-steps-hint {
    color: var(--snake-color-text-muted);
    font-size: 12px;
}
</style>
