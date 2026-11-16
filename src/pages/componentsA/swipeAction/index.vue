<template>
    <DemoPage :title="title" :desc="text('列表项左滑露出操作按钮，用于删除、收藏与取消订单。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-swipe-list">
                <snake-swipe-action
                    v-for="order in orders"
                    :key="order.id"
                    :actions="actions"
                    :left-actions="order.hasLeft ? leftActions : []"
                    :disabled="Boolean(state.disabled)"
                    :auto-close="Boolean(state.autoClose)"
                    :threshold="Number(state.threshold)"
                    @click="onAction"
                >
                    <snake-cell-item :title="order.id" :value="order.status" arrow :border-bottom="true" />
                </snake-swipe-action>
            </view>
            <text class="demo-swipe-hint">{{ text('左滑露出右侧按钮，第一行右滑还能露出左侧按钮') }}</text>
        </DemoSection>
        <DemoSection variant="preview" :title="text('自定义按钮区')">
            <view class="demo-swipe-list">
                <snake-swipe-action>
                    <snake-cell-item :title="text('插槽按钮区')" :value="text('宽度由内容决定')" />
                    <template #left>
                        <view class="demo-swipe-slot demo-swipe-slot--left" @click="onSlot('置顶')">
                            {{ text('置顶') }}
                        </view>
                    </template>
                    <template #actions>
                        <view class="demo-swipe-slot" @click="onSlot('标为已读')">{{ text('标为已读') }}</view>
                        <view class="demo-swipe-slot demo-swipe-slot--error" @click="onSlot('删除')">
                            {{ text('删除') }}
                        </view>
                    </template>
                </snake-swipe-action>
            </view>
            <text class="demo-swipe-hint">{{ text('插槽按钮宽度由内容决定，点击任意位置收起') }}</text>
        </DemoSection>
        <DemoSection variant="preview" :title="text('受控与拦截')">
            <view class="demo-swipe-list">
                <snake-swipe-action
                    v-model="openSide"
                    :actions="actions"
                    :left-actions="leftActions"
                    :auto-close="false"
                >
                    <snake-cell-item :title="text('v-model 控制停留状态')" :value="openSide" />
                </snake-swipe-action>
                <snake-swipe-action :actions="actions" :before-close="confirmClose">
                    <snake-cell-item :title="text('关闭前确认')" :value="text('取消则保持展开')" />
                </snake-swipe-action>
            </view>
            <view class="demo-swipe-tools">
                <snake-button size="small" :text="text('展开左侧')" @click="setOpenSide('left')" />
                <snake-button size="small" :text="text('收起按钮区')" @click="setOpenSide('close')" />
                <snake-button size="small" :text="text('展开右侧')" @click="setOpenSide('right')" />
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type {
    SwipeActionItem,
    SwipeActionReason,
    SwipeActionSide,
    SwipeActionStatus
} from '../../../uni_modules/snake-ui';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const controls: DemoControl[] = [
    { key: 'disabled', label: '禁用滑动', type: 'switch', defaultValue: false },
    { key: 'autoClose', label: '同组互斥', type: 'switch', defaultValue: true },
    { key: 'threshold', label: '停留阈值', type: 'slider', defaultValue: 0, min: 0, max: 120, step: 10, unit: 'px' }
];
const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
const openSide = ref<SwipeActionStatus>('close');
const orders = computed(() => {
    const _locale = localeName.value;
    return [
        { id: '202611110001', status: demoText('待付款'), hasLeft: true },
        { id: '202611110002', status: demoText('待发货'), hasLeft: false },
        { id: '202611110003', status: demoText('待收货'), hasLeft: false }
    ];
});
const actions = computed<SwipeActionItem[]>(() => {
    const _locale = localeName.value;
    return [
        { text: demoText('收藏'), type: 'primary', icon: 'star' },
        { text: demoText('取消订单'), type: 'error' }
    ];
});
const leftActions = computed<SwipeActionItem[]>(() => {
    const _locale = localeName.value;
    return [{ text: demoText('标为已读'), type: 'warning' }];
});
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
    return demoTitle('swipe-action', '滑动操作');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function setOpenSide(side: SwipeActionStatus) {
    openSide.value = side;
}
function onAction(action: SwipeActionItem, side: SwipeActionSide, index: number) {
    uni.showToast({ title: `${action.text} · ${side} #${index}`, icon: 'none' });
}
function onSlot(label: string) {
    uni.showToast({ title: label, icon: 'none' });
}
function confirmClose(reason: SwipeActionReason, position: SwipeActionSide): Promise<boolean> {
    return new Promise(resolve => {
        uni.showModal({
            title: demoText('确认收起？'),
            content: `${reason} / ${position}`,
            cancelText: demoText('取消'),
            confirmText: demoText('确定'),
            success: result => resolve(Boolean(result.confirm)),
            fail: () => resolve(false)
        });
    });
}
</script>

<style scoped>
.demo-swipe-list {
    border-radius: 8px;
    overflow: hidden;
}

.demo-swipe-hint {
    display: block;
    margin-top: 10px;
    color: var(--snake-color-text-muted);
    font-size: 12px;
}

.demo-swipe-tools {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.demo-swipe-slot {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 88px;
    padding: 0 6px;
    background-color: var(--snake-color-warning, #ff9900);
    color: #fff;
    font-size: 13px;
    line-height: 1.3;
    text-align: center;
}

.demo-swipe-slot--left {
    width: 64px;
    background-color: var(--snake-color-primary, #06d290);
}

.demo-swipe-slot--error {
    background-color: var(--snake-color-error, #fa3534);
}
</style>
