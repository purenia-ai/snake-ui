<template>
    <DemoPage :title="title" :desc="text('在首次加载时预显示接近真实内容的页面结构。')">
        <DemoSection
            variant="preview"
            :title="text('快速模式')"
            :description="text('avatar / title / rows 直接拼出常见列表占位')"
        >
            <view class="demo-skeleton-showcase">
                <snake-skeleton
                    :loading="Boolean(state.loading)"
                    :animation="animationValue"
                    :title="Boolean(state.skTitle)"
                    :rows="Number(state.skRows)"
                    :avatar="Boolean(state.skAvatar)"
                    :avatar-shape="avatarShapeValue"
                    :label="text('加载中')"
                >
                    <view class="demo-skeleton-content">{{ text('数据加载完成，展示真实内容。') }}</view>
                </snake-skeleton>
            </view>
        </DemoSection>
        <DemoSection
            variant="preview"
            :title="text('动画对比')"
            :description="text('流光逐帧重绘背景，呼吸只动透明度，小程序上更省')"
        >
            <view class="demo-skeleton-anim">
                <view
                    v-for="(item, index) in animationOptions"
                    :key="item.value"
                    :class="['demo-skeleton-anim__row', { 'demo-skeleton-anim__row--divided': index > 0 }]"
                >
                    <text class="demo-skeleton-anim__label">{{ text(item.label) }}</text>
                    <view class="demo-skeleton-anim__body">
                        <snake-skeleton :animation="item.value" :rows="2" avatar title-width="52%" />
                    </view>
                </view>
            </view>
        </DemoSection>
        <DemoSection
            variant="preview"
            :title="text('自定义模板')"
            :description="text('template 插槽里用 snake-skeleton-item 拼任意结构')"
        >
            <view class="demo-skeleton-grid">
                <snake-skeleton :loading="Boolean(state.loading)" :animation="animationValue">
                    <template #template>
                        <view class="demo-skeleton-card">
                            <snake-skeleton-item variant="image" height="88px" radius="8px" />
                            <view class="demo-skeleton-line">
                                <snake-skeleton-item width="82%" height="12px" />
                            </view>
                            <view class="demo-skeleton-line">
                                <snake-skeleton-item width="46%" height="12px" />
                            </view>
                        </view>
                    </template>
                    <view class="demo-skeleton-card demo-skeleton-card--loaded">{{ text('商品卡片') }}</view>
                </snake-skeleton>
                <snake-skeleton :loading="Boolean(state.loading)" :animation="animationValue">
                    <template #template>
                        <view class="demo-skeleton-card">
                            <view class="demo-skeleton-row">
                                <snake-skeleton-item variant="circle" size="32px" />
                                <view class="demo-skeleton-row__body">
                                    <snake-skeleton-item width="60%" height="12px" />
                                    <view class="demo-skeleton-line">
                                        <snake-skeleton-item width="90%" height="10px" />
                                    </view>
                                </view>
                            </view>
                            <view class="demo-skeleton-line">
                                <snake-skeleton-item width="100%" height="10px" />
                            </view>
                        </view>
                    </template>
                    <view class="demo-skeleton-card demo-skeleton-card--loaded">{{ text('图文列表') }}</view>
                </snake-skeleton>
            </view>
        </DemoSection>
        <DemoSection
            variant="preview"
            :title="text('跟随主题')"
            :description="text('覆盖 --snake-skeleton-* 变量即可统一改占位色与圆角')"
        >
            <view class="demo-skeleton-grid">
                <view class="demo-skeleton-cell">
                    <text class="demo-variant-sub">{{ text('默认占位') }}</text>
                    <snake-skeleton :rows="2" :animation="animationValue" avatar-shape="square" />
                </view>
                <view class="demo-skeleton-cell demo-skeleton-cell--themed">
                    <text class="demo-variant-sub">{{ text('品牌色占位') }}</text>
                    <snake-skeleton :rows="2" :animation="animationValue" avatar-shape="square" />
                </view>
            </view>
        </DemoSection>
        <DemoSection
            variant="preview"
            :title="text('占位形态')"
            :description="text('单个占位块可覆盖容器动画，animation 传 none 即为静态')"
        >
            <view class="demo-skeleton-item-showcase">
                <snake-skeleton-item variant="text" width="70%" />
                <snake-skeleton-item variant="rect" height="56px" />
                <view class="demo-skeleton-row">
                    <snake-skeleton-item variant="circle" size="40px" />
                    <view class="demo-skeleton-row__body">
                        <snake-skeleton-item variant="text" width="60%" />
                        <view class="demo-skeleton-line">
                            <snake-skeleton-item variant="text" width="90%" />
                        </view>
                    </view>
                </view>
                <snake-skeleton-item variant="image" height="96px" radius="10px" />
                <snake-skeleton-item variant="text" width="55%" animation="pulse" />
            </view>
        </DemoSection>
        <DemoSection
            variant="preview"
            :title="text('与请求状态配合')"
            :description="text('只在首次加载用骨架屏，请求完成后切换为真实内容')"
        >
            <view class="demo-stack">
                <snake-skeleton :loading="requesting" :rows="2" :animation="animationValue" :label="text('加载中')">
                    <view class="demo-skeleton-content">{{ text('数据加载完成，展示真实内容。') }}</view>
                </snake-skeleton>
                <snake-button :custom-style="{ width: '120px' }" :disabled="requesting" @click="simulateRequest">
                    {{ text('模拟加载') }}
                </snake-button>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, onUnmounted, reactive, ref } from 'vue';
import { demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
import type { SkeletonAnimation } from '../../../uni_modules/snake-ui/components/snake-skeleton/types';

const { localeName, text } = useDemoLocale();
const animationOptions: Array<{ label: string; value: SkeletonAnimation }> = [
    { label: '流光', value: 'shimmer' },
    { label: '呼吸', value: 'pulse' },
    { label: '静态', value: 'none' }
];
const controls: DemoControl[] = [
    { key: 'loading', label: '显示骨架', type: 'switch', defaultValue: true },
    {
        key: 'animation',
        label: '动画效果',
        type: 'select',
        defaultValue: 'shimmer',
        options: animationOptions.map(item => ({ label: item.label, value: item.value }))
    },
    { key: 'skTitle', label: '标题占位', type: 'switch', defaultValue: true },
    { key: 'skRows', label: '段落行数', type: 'slider', defaultValue: 3, min: 1, max: 6, step: 1, unit: '行' },
    { key: 'skAvatar', label: '头像占位', type: 'switch', defaultValue: true },
    {
        key: 'skAvatarShape',
        label: '头像形状',
        type: 'select',
        defaultValue: 'circle',
        options: [
            { label: '圆形', value: 'circle' },
            { label: '方形', value: 'square' }
        ]
    }
];
const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
const requesting = ref(false);
let requestTimer: ReturnType<typeof setTimeout> | null = null;

const animationValue = computed<SkeletonAnimation>(() => {
    const _locale = localeName.value;
    const value = state.animation;
    return value === 'pulse' || value === 'none' ? value : 'shimmer';
});
const avatarShapeValue = computed<'circle' | 'square'>(() => (state.skAvatarShape === 'square' ? 'square' : 'circle'));
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({
        ...control,
        label: text(control.label),
        unit: control.unit ? text(control.unit) : undefined,
        options: control.options?.map(option => ({ ...option, label: text(option.label) }))
    }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('skeleton', '骨架屏');
});

onUnmounted(() => {
    if (requestTimer) clearTimeout(requestTimer);
});

function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}

function simulateRequest() {
    if (requesting.value) return;
    requesting.value = true;
    if (requestTimer) clearTimeout(requestTimer);
    requestTimer = setTimeout(() => {
        requesting.value = false;
        requestTimer = null;
    }, 900);
}
</script>

<style scoped>
.demo-stack {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.demo-skeleton-showcase,
.demo-skeleton-item-showcase,
.demo-skeleton-cell,
.demo-skeleton-card {
    box-sizing: border-box;
    padding: 12px;
    border: 1px solid var(--snake-color-divider);
    border-radius: 8px;
    background: var(--snake-color-surface);
}

.demo-skeleton-item-showcase {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.demo-skeleton-grid {
    display: flex;
    gap: 10px;
}

/* 三种动画各占一行：三列并排时 320~420 宽下头像会吃掉几乎整格，正文只剩几像素 */
.demo-skeleton-anim {
    box-sizing: border-box;
    padding: 2px 12px;
    border: 1px solid var(--snake-color-divider);
    border-radius: 8px;
    background: var(--snake-color-surface);
}

.demo-skeleton-anim__row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
}

.demo-skeleton-anim__row--divided {
    border-top: 1px dashed var(--snake-color-divider);
}

.demo-skeleton-anim__label {
    flex: none;
    width: 44px;
    color: var(--snake-color-text-muted);
    font-size: 12px;
}

.demo-skeleton-anim__body {
    min-width: 0;
    flex: 1;
}

.demo-skeleton-cell,
.demo-skeleton-card {
    flex: 1;
    min-width: 0;
}

.demo-skeleton-cell {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.demo-skeleton-card--loaded {
    display: flex;
    min-height: 140px;
    align-items: center;
    justify-content: center;
    color: var(--snake-color-text-secondary);
    font-size: 14px;
}

/* 品牌色占位：占位色与高亮色都取主题变量，切主题时一起变 */
.demo-skeleton-cell--themed {
    --snake-skeleton-color: var(--snake-color-primary-light);
    --snake-skeleton-highlight: rgba(var(--snake-color-primary-rgb), 0.24);
    --snake-skeleton-text-radius: 6px;
}

.demo-skeleton-content {
    color: var(--snake-color-text-secondary);
    font-size: 14px;
}

.demo-variant-sub {
    color: var(--snake-color-text-muted);
    font-size: 12px;
}

.demo-skeleton-line {
    margin-top: 8px;
}

.demo-skeleton-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.demo-skeleton-row__body {
    min-width: 0;
    flex: 1;
}
</style>
