<template>
    <DemoPage :title="title" :desc="text('弹出层支持从页面不同方向出现，并可组合圆角、关闭按钮、遮罩与嵌入模式。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-popup-showcase">
                <text class="demo-variant-title">{{ text('方向') }}</text>
                <view class="demo-mode-row">
                    <view
                        v-for="mode in modeOptions"
                        :key="mode.value"
                        class="demo-mode"
                        :class="{ 'demo-mode--active': popupMode === mode.value }"
                        @click="openWithMode(mode.value)"
                    >
                        <text>{{ text(mode.label) }}</text>
                    </view>
                </view>
                <view class="demo-caption-stack">
                    <text class="demo-variant-caption">{{ text('点击方向按当前参数打开') }}</text>
                    <text class="demo-variant-caption">{{ eventText }}</text>
                </view>

                <snake-popup
                    v-model="visible"
                    :mode="popupMode"
                    :closeable="Boolean(state.popupCloseable)"
                    :close-icon-pos="closeIconPos"
                    :close-icon-size="Number(state.popupCloseIconSize)"
                    :round="Boolean(state.popupRound)"
                    :zoom="Boolean(state.popupZoom)"
                    :duration="Number(state.popupDuration)"
                    :overlay-opacity="Number(state.popupOverlayOpacity)"
                    :close-on-click-overlay="Boolean(state.popupCloseOverlay)"
                    :safe-area-inset-bottom="Boolean(state.popupSafeArea)"
                    :custom-style="configuredPanelStyle"
                    @open="lastEvent = 'open'"
                    @opened="lastEvent = 'opened'"
                    @close="lastEvent = 'close'"
                    @closed="lastEvent = 'closed'"
                    @click-overlay="lastEvent = 'click-overlay'"
                >
                    <view class="demo-panel" :class="{ 'demo-panel--side': isSideMode }">
                        <text class="demo-panel__title">Snake Popup</text>
                        <text class="demo-panel__desc">{{ text('这是一个可交互的弹出层。') }}</text>
                        <snake-button type="primary" block @click="visible = false">
                            {{ text('关闭弹窗') }}
                        </snake-button>
                    </view>
                </snake-popup>

                <text class="demo-variant-title">{{ text('预置场景') }}</text>
                <view class="demo-preset-row">
                    <view
                        v-for="preset in presets"
                        :key="preset.key"
                        class="demo-preset"
                        hover-class="demo-preset--hover"
                        @click="openPreset(preset.key)"
                    >
                        <snake-icon :name="preset.icon" :size="20" />
                        <text class="demo-preset__label">{{ text(preset.label) }}</text>
                    </view>
                </view>

                <snake-popup
                    v-model="shareVisible"
                    mode="bottom"
                    :round="true"
                    closeable
                    safe-area-inset-bottom
                    :overlay-opacity="0.45"
                >
                    <view class="demo-sheet">
                        <text class="demo-sheet__title">{{ text('分享到') }}</text>
                        <view class="demo-sheet__grid">
                            <view
                                v-for="target in shareTargets"
                                :key="target.key"
                                class="demo-sheet__item"
                                @click="shareTo(target.label)"
                            >
                                <view class="demo-sheet__icon">
                                    <snake-icon :name="target.icon" :size="20" />
                                </view>
                                <text class="demo-sheet__label">{{ text(target.label) }}</text>
                            </view>
                        </view>
                        <snake-button block plain @click="shareVisible = false">{{ text('取消') }}</snake-button>
                    </view>
                </snake-popup>

                <snake-popup
                    v-model="dialogVisible"
                    mode="center"
                    :round="true"
                    closeable
                    :custom-style="{ width: '78%' }"
                >
                    <view class="demo-dialog">
                        <text class="demo-dialog__title">{{ text('删除这条记录？') }}</text>
                        <text class="demo-dialog__desc">{{ text('删除后无法恢复，请确认后继续。') }}</text>
                        <view class="demo-dialog__actions">
                            <view class="demo-dialog__btn">
                                <snake-button block plain @click="dialogVisible = false">
                                    {{ text('取消') }}
                                </snake-button>
                            </view>
                            <view class="demo-dialog__btn">
                                <snake-button block type="primary" @click="confirmDelete">
                                    {{ text('确认删除') }}
                                </snake-button>
                            </view>
                        </view>
                    </view>
                </snake-popup>

                <snake-popup v-model="drawerVisible" mode="right" :custom-style="{ width: '70%' }">
                    <view class="demo-drawer">
                        <view class="demo-drawer__head">
                            <text class="demo-drawer__title">{{ text('筛选') }}</text>
                            <view class="demo-drawer__close" @click="drawerVisible = false">
                                <snake-icon name="close" :size="16" />
                            </view>
                        </view>
                        <view v-for="item in 6" :key="item" class="demo-drawer__row">
                            {{ text('筛选条件') }} {{ item }}
                        </view>
                        <view class="demo-drawer__foot">
                            <snake-button block type="primary" @click="drawerVisible = false">
                                {{ text('确定') }}
                            </snake-button>
                        </view>
                    </view>
                </snake-popup>

                <text class="demo-variant-title">{{ text('嵌入模式') }}</text>
                <!-- 包一层普通容器：embedded 实例仍在 DOM 里带行内层级，作为 flex 子项会被参与排序 -->
                <view class="demo-embedded-stage">
                    <snake-popup
                        v-model="embeddedVisible"
                        embedded
                        mode="bottom"
                        :overlay="false"
                        custom-style="border: 1px solid var(--snake-color-divider); border-radius: 10px"
                    >
                        <view class="demo-embedded">
                            <text class="demo-embedded__title">embedded</text>
                            <text class="demo-embedded__desc">
                                {{ text('嵌入模式让弹层回到文档流并随内容撑高，不遮挡页面。') }}
                            </text>
                        </view>
                    </snake-popup>
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
import type { PopupCloseIconPosition, PopupMode } from '../../../uni_modules/snake-ui/components/snake-popup/types';

const { localeName, text } = useDemoLocale();

const visible = ref(false);
const shareVisible = ref(false);
const dialogVisible = ref(false);
const drawerVisible = ref(false);
const embeddedVisible = ref(true);
const lastEvent = ref('');

const modeOptions: Array<{ label: string; value: PopupMode }> = [
    { label: '顶部', value: 'top' },
    { label: '居中', value: 'center' },
    { label: '底部', value: 'bottom' },
    { label: '左侧', value: 'left' },
    { label: '右侧', value: 'right' }
];

const shareTargets = [
    { key: 'wechat', label: '微信', icon: 'chat' },
    { key: 'moments', label: '朋友圈', icon: 'share' },
    { key: 'favorite', label: '收藏', icon: 'star' },
    { key: 'more', label: '更多', icon: 'more-dot-fill' }
];

type PresetKey = 'share' | 'dialog' | 'drawer';
const presets: Array<{ key: PresetKey; label: string; icon: string }> = [
    { key: 'share', label: '分享面板', icon: 'share' },
    { key: 'dialog', label: '确认对话框', icon: 'question-circle' },
    { key: 'drawer', label: '筛选抽屉', icon: 'list' }
];

const controls: DemoControl[] = [
    {
        key: 'popupMode',
        label: '弹出方向',
        type: 'select',
        defaultValue: 'bottom',
        options: modeOptions.map(mode => ({ label: mode.label, value: mode.value }))
    },
    { key: 'popupCloseable', label: '关闭按钮', type: 'switch', defaultValue: true },
    {
        key: 'popupCloseIconPos',
        label: '关闭按钮位置',
        type: 'select',
        defaultValue: 'top-right',
        options: [
            { label: '左上', value: 'top-left' },
            { label: '右上', value: 'top-right' },
            { label: '左下', value: 'bottom-left' },
            { label: '右下', value: 'bottom-right' }
        ]
    },
    {
        key: 'popupCloseIconSize',
        label: '关闭按钮大小',
        type: 'slider',
        defaultValue: 16,
        min: 12,
        max: 28,
        step: 2,
        unit: 'px'
    },
    { key: 'popupRound', label: '圆角', type: 'switch', defaultValue: true },
    { key: 'popupZoom', label: '缩放动画', type: 'switch', defaultValue: true },
    {
        key: 'popupOverlayOpacity',
        label: '遮罩透明度',
        type: 'slider',
        defaultValue: 0.5,
        min: 0.2,
        max: 0.8,
        step: 0.1
    },
    {
        key: 'popupDuration',
        label: '动画时长',
        type: 'slider',
        defaultValue: 300,
        min: 100,
        max: 600,
        step: 50,
        unit: 'ms'
    },
    { key: 'popupCloseOverlay', label: '点击遮罩关闭', type: 'switch', defaultValue: true },
    { key: 'popupSafeArea', label: '底部安全区', type: 'switch', defaultValue: true }
];

const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);

const popupMode = computed(() => String(state.popupMode) as PopupMode);
const closeIconPos = computed(() => String(state.popupCloseIconPos) as PopupCloseIconPosition);
const isSideMode = computed(() => popupMode.value === 'left' || popupMode.value === 'right');
const eventText = computed(() => {
    const label = text('最近事件');
    const value = lastEvent.value || '-';
    return localeName.value === 'en-US' ? `${label}: ${value}` : `${label}：${value}`;
});
const configuredPanelStyle = computed(() => {
    if (isSideMode.value) return 'width: 70%;';
    if (popupMode.value === 'center') return 'width: 78%;';
    return '';
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
    return demoTitle('popup', '弹出层');
});

function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}

function openWithMode(mode: PopupMode) {
    state.popupMode = mode;
    visible.value = true;
}

function openPreset(key: PresetKey) {
    if (key === 'share') shareVisible.value = true;
    else if (key === 'dialog') dialogVisible.value = true;
    else drawerVisible.value = true;
}

function shareTo(label: string) {
    shareVisible.value = false;
    uni.showToast({ title: `${text('分享到')} ${text(label)}`, icon: 'none' });
}

function confirmDelete() {
    dialogVisible.value = false;
    uni.showToast({ title: text('已删除'), icon: 'none' });
}
</script>

<style scoped>
.demo-popup-showcase {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.demo-variant-title:not(:first-child) {
    margin-top: 6px;
}

.demo-variant-caption {
    color: var(--snake-color-text-secondary);
    font-size: 12px;
}

.demo-caption-stack {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.demo-preset-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
}

.demo-preset {
    display: flex;
    min-height: 72px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid var(--snake-color-divider);
    border-radius: 8px;
    color: var(--snake-color-primary);
    background: var(--snake-color-surface);
}

.demo-preset--hover {
    background: var(--snake-color-surface-muted);
}

.demo-preset__label {
    color: var(--snake-color-text-secondary);
    font-size: 12px;
}

.demo-mode-row {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 6px;
}

.demo-mode {
    display: flex;
    height: 34px;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--snake-color-divider);
    border-radius: 7px;
    color: var(--snake-color-text-secondary);
    font-size: 12px;
    line-height: 1;
    background: var(--snake-color-surface);
}

.demo-mode--active {
    border-color: var(--snake-color-primary);
    color: var(--snake-color-primary-ink);
    font-weight: 600;
    background: var(--snake-color-primary);
}

.demo-panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px 16px;
}

.demo-panel--side {
    box-sizing: border-box;
    height: 100%;
    justify-content: center;
}

.demo-panel__title {
    color: var(--snake-color-text);
    font-size: 17px;
    font-weight: 700;
}

.demo-panel__desc {
    color: var(--snake-color-text-secondary);
    font-size: 13px;
    line-height: 1.6;
}

.demo-sheet {
    padding: 18px 16px 16px;
}

.demo-sheet__title {
    display: block;
    margin-bottom: 16px;
    color: var(--snake-color-text);
    font-size: 14px;
    font-weight: 600;
    text-align: center;
}

.demo-sheet__grid {
    display: grid;
    margin-bottom: 16px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
}

.demo-sheet__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.demo-sheet__icon {
    display: flex;
    width: 44px;
    height: 44px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: var(--snake-color-primary);
    background: var(--snake-color-surface-muted);
}

.demo-sheet__label {
    color: var(--snake-color-text-secondary);
    font-size: 12px;
}

.demo-dialog {
    padding: 22px 18px 18px;
}

.demo-dialog__title {
    display: block;
    color: var(--snake-color-text);
    font-size: 16px;
    font-weight: 700;
    text-align: center;
}

.demo-dialog__desc {
    display: block;
    margin: 8px 0 18px;
    color: var(--snake-color-text-secondary);
    font-size: 13px;
    line-height: 1.7;
    text-align: center;
}

.demo-dialog__actions {
    display: flex;
    gap: 10px;
}

.demo-dialog__btn {
    flex: 1;
    min-width: 0;
}

.demo-drawer {
    box-sizing: border-box;
    display: flex;
    min-height: 100%;
    flex-direction: column;
    gap: 10px;
    padding: 16px 14px calc(16px + env(safe-area-inset-bottom));
}

.demo-drawer__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2px;
}

.demo-drawer__title {
    color: var(--snake-color-text);
    font-size: 16px;
    font-weight: 700;
}

.demo-drawer__close {
    display: flex;
    width: 28px;
    height: 28px;
    align-items: center;
    justify-content: center;
    color: var(--snake-color-text-muted);
}

.demo-drawer__row {
    padding: 12px 14px;
    border-radius: 8px;
    color: var(--snake-color-text-secondary);
    font-size: 13px;
    background: var(--snake-color-surface-muted);
}

.demo-drawer__foot {
    margin-top: auto;
}

.demo-embedded {
    padding: 16px;
}

.demo-embedded__title {
    display: block;
    margin-bottom: 6px;
    color: var(--snake-color-text);
    font-size: 14px;
    font-weight: 600;
}

.demo-embedded__desc {
    color: var(--snake-color-text-secondary);
    font-size: 12px;
    line-height: 1.6;
}
</style>
