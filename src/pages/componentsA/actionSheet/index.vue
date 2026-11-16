<template>
    <DemoPage :title="title" :desc="text('从底部弹出动作列表，承载客服、分享与更多操作。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-action-sheet-showcase">
                <snake-button type="primary" :text="text('打开动作面板')" @click="visible = true" />
                <text class="demo-action-sheet-hint">{{ text('面板从底部弹出，选中后默认自动关闭') }}</text>
                <snake-button :text="text('自定义单行')" @click="customVisible = true" />
                <text class="demo-action-sheet-hint">
                    {{ text('第二行用 action-item 插槽替换内容，点击与自动关闭仍由组件接管') }}
                </text>
                <snake-action-sheet
                    v-model="visible"
                    :title="text('更多操作')"
                    :description="text('选择后立即生效')"
                    :actions="sheetActions"
                    :show-cancel="Boolean(state.showCancel)"
                    :close-on-click-action="Boolean(state.closeOnClickAction)"
                    :round="Boolean(state.round)"
                    @select="onSelect"
                    @cancel="onCancel"
                />
                <snake-action-sheet
                    v-model="customVisible"
                    :title="text('自定义单行')"
                    :actions="customActions"
                    @select="onSelect"
                >
                    <template #action-item="{ action, index }">
                        <view v-if="index === 1" class="demo-action-sheet-coupon">
                            <text>{{ action.name }}</text>
                            <snake-tag type="error" size="mini" :text="text('限时')" />
                        </view>
                        <view v-else class="demo-action-sheet-row">{{ action.name }}</view>
                    </template>
                </snake-action-sheet>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { ActionSheetAction } from '../../../uni_modules/snake-ui';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const visible = ref(false);
const customVisible = ref(false);
const controls: DemoControl[] = [
    { key: 'showCancel', label: '显示取消', type: 'switch', defaultValue: true },
    { key: 'closeOnClickAction', label: '点击动作后关闭', type: 'switch', defaultValue: true },
    { key: 'round', label: '圆角', type: 'switch', defaultValue: true }
];
const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
const sheetActions = computed<ActionSheetAction[]>(() => {
    const _locale = localeName.value;
    return [
        { name: demoText('联系客服'), icon: 'phone' },
        { name: demoText('分享给好友'), icon: 'share' },
        { name: demoText('举报'), color: 'var(--snake-color-error)' },
        { name: demoText('加载中示例'), loading: true },
        { name: demoText('暂不开放'), disabled: true }
    ];
});
const customActions = computed<ActionSheetAction[]>(() => {
    const _locale = localeName.value;
    return [
        { name: demoText('联系客服'), icon: 'phone' },
        { name: demoText('领取优惠券'), icon: 'coupon' },
        { name: demoText('举报') }
    ];
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
    return demoTitle('action-sheet', '动作面板');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function onSelect(action: ActionSheetAction) {
    uni.showToast({ title: action.name, icon: 'none' });
}
function onCancel() {
    uni.showToast({ title: text('已取消'), icon: 'none' });
}
</script>

<style scoped>
.demo-action-sheet-showcase {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
}

.demo-action-sheet-hint {
    color: var(--snake-color-text-muted);
    font-size: 12px;
}

/* 插槽内的行内容不走组件自身样式，这里复刻默认行的居中与字号 */
.demo-action-sheet-row {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--snake-color-text, #303133);
    font-size: 16px;
}

.demo-action-sheet-coupon {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    color: var(--snake-color-text, #303133);
    font-size: 16px;
}
</style>
