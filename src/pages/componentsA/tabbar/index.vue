<template>
    <DemoPage :title="title" :desc="text('构建应用一级底部导航，支持选中态、角标、凸起按钮与安全区。')">
        <DemoSection
            variant="preview"
            :title="text('演示效果')"
            :description="text('底部导航固定在页面底部，这里用内嵌方式预览，点击可切换选中态。')"
        >
            <view class="demo-tabbar-showcase">
                <view class="demo-tabbar-status">
                    <view class="demo-tabbar-status__main">
                        <text class="demo-tabbar-status__label">{{ text('当前项') }}</text>
                        <text class="demo-tabbar-status__value">{{ currentLabel }}</text>
                        <text class="demo-tabbar-status__key">{{ currentKey }}</text>
                    </view>
                    <text class="demo-tabbar-status__meta">{{ eventText }}</text>
                </view>

                <view class="demo-tabbar-stage">
                    <view class="demo-tabbar-stage__content">
                        <text class="demo-tabbar-stage__title">{{ text('页面内容区') }}</text>
                        <text class="demo-tabbar-stage__hint">{{
                            text('导航栏贴在页面底部，一级页面之间用它切换')
                        }}</text>
                    </view>
                    <snake-tabbar
                        :items="tabItems"
                        :current="currentKey"
                        :fixed="false"
                        :safe-area-inset-bottom="false"
                        :border-top="Boolean(state.tabbarBorder)"
                        :mid-button="Boolean(state.tabbarMid)"
                        :height="Number(state.tabbarHeight)"
                        :active-color="String(state.tabbarColor)"
                        :hide-tab-bar="false"
                        @change="onChange"
                    />
                </view>

                <view class="demo-tabbar-toolbar">
                    <snake-button size="small" type="default" @click="resetEvents">{{ text('重置计数') }}</snake-button>
                    <text class="demo-variant-caption">{{
                        text('禁用项不触发事件；原生 tabBar 页面会自动隐藏系统导航')
                    }}</text>
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
import type { TabbarItem } from '../../../uni_modules/snake-ui/components/snake-tabbar/types';

const { localeName, text } = useDemoLocale();
const switchCount = ref(0);
const controls: DemoControl[] = [
    {
        key: 'tabbarCurrent',
        label: '当前项',
        type: 'select',
        defaultValue: 'home',
        options: [
            { label: '首页', value: 'home' },
            { label: '分类', value: 'category' },
            { label: '发布', value: 'publish' },
            { label: '购物车', value: 'cart' },
            { label: '我的', value: 'mine' }
        ]
    },
    { key: 'tabbarMid', label: '凸起按钮', type: 'switch', defaultValue: true },
    {
        key: 'tabbarBadge',
        label: '角标',
        type: 'select',
        defaultValue: 'count',
        options: [
            { label: '数字 12', value: 'count' },
            { label: '圆点', value: 'dot' },
            { label: '隐藏', value: 'none' }
        ]
    },
    { key: 'tabbarDisabled', label: '禁用「我的」', type: 'switch', defaultValue: false },
    { key: 'tabbarBorder', label: '顶部分隔线', type: 'switch', defaultValue: true },
    {
        key: 'tabbarColor',
        label: '激活颜色',
        type: 'select',
        defaultValue: '#06D290',
        options: [
            { label: '品牌绿', value: '#06D290' },
            { label: '蓝色', value: '#2563eb' },
            { label: '橙色', value: '#f97316' }
        ]
    },
    { key: 'tabbarHeight', label: '导航高度', type: 'slider', defaultValue: 52, min: 44, max: 64, step: 4, unit: 'px' }
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
    return demoTitle('tabbar', '底部导航栏');
});
const currentKey = computed(() => String(state.tabbarCurrent));
const tabItems = computed<TabbarItem[]>(() => {
    const badgeMode = String(state.tabbarBadge);
    const cart: TabbarItem = {
        key: 'cart',
        text: text('购物车'),
        iconPath: 'shopping-cart',
        selectedIconPath: 'shopping-cart-fill'
    };
    // 数字角标走 badge，圆点角标走 isDot，两者互斥。
    if (badgeMode === 'count') cart.badge = 12;
    else if (badgeMode === 'dot') cart.isDot = true;

    return [
        { key: 'home', text: text('首页'), iconPath: 'home', selectedIconPath: 'home-fill' },
        { key: 'category', text: text('分类'), iconPath: 'list', selectedIconPath: 'list-dot' },
        { key: 'publish', text: text('发布'), iconPath: 'plus', midButton: Boolean(state.tabbarMid) },
        cart,
        {
            key: 'mine',
            text: text('我的'),
            iconPath: 'account',
            selectedIconPath: 'account-fill',
            disabled: Boolean(state.tabbarDisabled)
        }
    ];
});
const currentLabel = computed(() => tabItems.value.find(item => item.key === currentKey.value)?.text ?? '—');
const eventText = computed(() => `${text('切换')} ${switchCount.value} ${text('次')}`);

function onChange(key: string | number) {
    state.tabbarCurrent = String(key);
    switchCount.value += 1;
}
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function resetEvents() {
    switchCount.value = 0;
}
</script>

<style scoped>
.demo-tabbar-showcase {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.demo-tabbar-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    background: var(--snake-color-surface-muted);
}

.demo-tabbar-status__main {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
}

.demo-tabbar-status__label {
    color: var(--snake-color-text-secondary);
    font-size: 12px;
}

.demo-tabbar-status__value {
    color: var(--snake-demo-accent-text);
    font-size: 18px;
    font-weight: 700;
    line-height: 1.2;
}

.demo-tabbar-status__key {
    padding: 1px 5px;
    border-radius: 4px;
    color: var(--snake-color-text-muted);
    background: var(--snake-color-surface);
    font-size: 11px;
    line-height: 1.6;
}

.demo-tabbar-status__meta {
    flex-shrink: 0;
    color: var(--snake-color-text-muted);
    font-size: 11px;
    line-height: 1.4;
}

.demo-tabbar-stage {
    overflow: hidden;
    border: 1px solid var(--snake-color-divider);
    border-radius: 8px;
    background: var(--snake-color-surface);
}

.demo-tabbar-stage__content {
    display: flex;
    height: 104px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 0 24px;
    background: var(--snake-color-surface-muted);
}

.demo-tabbar-stage__title {
    color: var(--snake-color-text-secondary);
    font-size: 13px;
    font-weight: 600;
}

.demo-tabbar-stage__hint {
    color: var(--snake-color-text-muted);
    font-size: 11px;
    line-height: 1.5;
    text-align: center;
}

.demo-tabbar-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
}

.demo-variant-caption {
    flex: 1;
    color: var(--snake-color-text-secondary);
    font-size: 12px;
    line-height: 1.5;
}
</style>
