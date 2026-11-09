<template>
    <DemoPage :title="title" :desc="text('把内容传送到页面根节点，解决复杂布局下 fixed 弹层失效的问题。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-portal-showcase">
                <view
                    class="demo-portal-status"
                    :class="state.usePortal ? 'demo-portal-status--on' : 'demo-portal-status--off'"
                >
                    <snake-icon :name="state.usePortal ? 'checkmark-circle' : 'close-circle'" :size="14" />
                    <text class="demo-portal-status__label">
                        {{ state.usePortal ? text('已开启传送') : text('未开启传送') }}
                    </text>
                </view>

                <text class="demo-variant-title">{{ text('带 transform 的容器') }}</text>
                <view class="demo-portal-cage" :style="{ transform: cageTransform }">
                    <text class="demo-portal-tip">{{ text('这里的 fixed 弹层会被困住：跟随缩放、被裁剪') }}</text>
                    <snake-button type="primary" size="small" @click="show = true">
                        {{ text('显示弹层') }}
                    </snake-button>

                    <snake-root-portal v-if="state.usePortal">
                        <snake-popup :show="show" mode="bottom" :round="true" @close="show = false">
                            <view class="demo-portal-content">
                                <text class="demo-portal-title">{{ text('传送后的弹层') }}</text>
                                <text class="demo-portal-text">
                                    {{ text('渲染在页面根节点，主题变量依然生效。') }}
                                </text>
                                <snake-button size="small" @click="show = false">{{ text('关闭') }}</snake-button>
                            </view>
                        </snake-popup>
                    </snake-root-portal>

                    <snake-popup v-if="!state.usePortal" :show="show" mode="bottom" :round="true" @close="show = false">
                        <view class="demo-portal-content">
                            <text class="demo-portal-title">{{ text('被困住的弹层') }}</text>
                            <text class="demo-portal-text">{{ text('被 transform 容器困住，无法铺满视口。') }}</text>
                            <snake-button size="small" @click="show = false">{{ text('关闭') }}</snake-button>
                        </view>
                    </snake-popup>
                </view>

                <text class="demo-variant-caption">{{ cageText }}</text>
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

const { localeName, text } = useDemoLocale();
const show = ref(false);
const controls: DemoControl[] = [
    {
        key: 'usePortal',
        label: '使用根节点传送',
        type: 'switch',
        defaultValue: true
    },
    {
        key: 'cageScale',
        label: '容器缩放',
        type: 'slider',
        defaultValue: 100,
        min: 50,
        max: 100,
        step: 5,
        unit: '%'
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
    return demoTitle('root-portal', '根节点传送');
});
const cageTransform = computed(() => `scale(${Number(state.cageScale) / 100})`);
const cageText = computed(() => {
    const colon = localeName.value === 'en-US' ? ': ' : '：';
    return `${text('当前模式')}${colon}${state.usePortal ? text('已开启传送') : text('未开启传送')} · ${Number(state.cageScale)}%`;
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<style scoped>
.demo-portal-showcase {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.demo-portal-status {
    display: inline-flex;
    align-self: flex-start;
    align-items: center;
    gap: 5px;
    padding: 5px 9px;
    border-radius: 6px;
    font-size: 12px;
    line-height: 1;
}

.demo-portal-status--on {
    color: var(--snake-color-success);
    background: var(--snake-color-success-light);
}

.demo-portal-status--off {
    color: var(--snake-color-error);
    background: var(--snake-color-error-light);
}

.demo-portal-status__label {
    color: inherit;
    font-size: 12px;
}

.demo-portal-cage {
    display: flex;
    min-height: 180px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 16px;
    overflow: hidden;
    border: 1px dashed var(--snake-color-border);
    border-radius: 8px;
    background: var(--snake-color-surface-muted);
}

.demo-variant-caption {
    color: var(--snake-color-text-secondary);
    font-size: 12px;
}

.demo-portal-tip {
    color: var(--snake-color-text);
    font-size: 13px;
    line-height: 1.5;
    text-align: center;
}

.demo-portal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 20px 16px;
}

.demo-portal-title {
    color: var(--snake-color-text);
    font-size: 15px;
    font-weight: 600;
}

.demo-portal-text {
    color: var(--snake-color-text);
    font-size: 13px;
    line-height: 1.5;
    text-align: center;
}
</style>
