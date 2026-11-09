<template>
    <DemoPage :title="title" :desc="text('为浮层和内容切换提供一致的跨端进出场动画。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-transition-showcase">
                <text class="demo-variant-title">{{ text('交互动画') }}</text>
                <view class="demo-transition-stage">
                    <snake-transition
                        :show="visible"
                        :name="transitionName"
                        :duration="Number(state.transitionDuration)"
                        @after-enter="enterCount += 1"
                        @after-leave="leaveCount += 1"
                    >
                        <view class="demo-transition-card">Snake Transition</view>
                    </snake-transition>
                </view>
                <view class="demo-transition-toolbar">
                    <snake-button size="small" @click="visible = !visible">
                        {{ visible ? text('隐藏') : text('显示') }}
                    </snake-button>
                    <text class="demo-variant-caption">{{ eventText }}</text>
                </view>

                <text class="demo-variant-title">{{ text('预设一览') }}</text>
                <view class="demo-transition-grid">
                    <view
                        v-for="preset in presets"
                        :key="preset"
                        class="demo-transition-preset"
                        hover-class="demo-transition-preset--hover"
                        @click="replay(preset)"
                    >
                        <snake-transition
                            :key="`${preset}-${replayKeys[preset] || 0}`"
                            show
                            appear
                            :name="preset"
                            :duration="400"
                        >
                            <view class="demo-transition-chip">{{ preset }}</view>
                        </snake-transition>
                    </view>
                </view>
                <text class="demo-variant-caption">{{ text('点击任意预设可重播该动画') }}</text>
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
import type { TransitionPreset } from '../../../uni_modules/snake-ui/components/snake-transition/types';

const { localeName, text } = useDemoLocale();
const visible = ref(true);
const enterCount = ref(0);
const leaveCount = ref(0);
const replayKeys = reactive<Record<string, number>>({});
const presets: TransitionPreset[] = ['fade', 'fade-up', 'fade-down', 'slide-left', 'slide-right', 'zoom-in'];
const controls: DemoControl[] = [
    {
        key: 'transitionName',
        label: '动画类型',
        type: 'select',
        defaultValue: 'fade-up',
        options: [
            { label: '淡入上移', value: 'fade-up' },
            { label: '放大', value: 'zoom-in' },
            { label: '左侧滑入', value: 'slide-left' }
        ]
    },
    {
        key: 'transitionDuration',
        label: '动画时长',
        type: 'slider',
        defaultValue: 300,
        min: 100,
        max: 800,
        step: 50,
        unit: 'ms'
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
    return demoTitle('transition', '过渡动画');
});
const transitionName = computed(() => String(state.transitionName) as TransitionPreset);
const eventText = computed(() => {
    const colon = localeName.value === 'en-US' ? ': ' : '：';
    const parts = [
        `${text('当前预设')}${colon}${transitionName.value} · ${Number(state.transitionDuration)}ms`,
        `${text('进入动画完成')} ${enterCount.value}`,
        `${text('离开动画完成')} ${leaveCount.value}`
    ];
    return parts.join(' · ');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function replay(preset: TransitionPreset) {
    replayKeys[preset] = (replayKeys[preset] || 0) + 1;
}
</script>

<style scoped>
.demo-transition-showcase {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.demo-transition-stage {
    min-height: 120px;
    padding: 12px;
    border-radius: 8px;
    background: var(--snake-color-surface-muted);
}

.demo-transition-card {
    display: flex;
    width: 100%;
    min-height: 96px;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    color: #fff;
    background: linear-gradient(135deg, var(--snake-color-primary-deep), var(--snake-color-primary-deeper));
}

.demo-transition-toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
}

.demo-variant-caption {
    flex: 1;
    color: var(--snake-color-text-secondary);
    font-size: 12px;
    line-height: 1.5;
}

.demo-transition-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
}

.demo-transition-preset {
    display: flex;
    height: 64px;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--snake-color-divider);
    border-radius: 8px;
    background: var(--snake-color-surface);
}

.demo-transition-preset--hover {
    background: var(--snake-color-surface-muted);
}

.demo-transition-chip {
    padding: 6px 8px;
    border-radius: 6px;
    color: var(--snake-demo-accent-text);
    font-size: 11px;
    line-height: 1;
    background: var(--snake-color-primary-light);
}
</style>
