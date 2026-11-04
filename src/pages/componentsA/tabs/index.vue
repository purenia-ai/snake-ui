<template>
    <DemoPage :title="title" :desc="text('标签页用于在同层级内容之间快速切换，支持徽标、禁用项与异步数据重测量。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-tabs-showcase">
                <text class="demo-variant-title">{{ text('滚动模式 · 徽标与禁用项') }}</text>
                <snake-tabs
                    ref="tabsRef"
                    :list="demoList"
                    :current="current"
                    :is-scroll="Boolean(state.tabsScrollable)"
                    :active-color="String(state.tabsColor)"
                    :font-size="Number(state.tabsSize)"
                    :bar-width="Number(state.tabsBarWidth)"
                    :bar-height="Number(state.tabsBarHeight)"
                    :gutter="Number(state.tabsGutter)"
                    :bg-color="String(state.tabsBgColor)"
                    :show-bar="Boolean(state.tabsShowBar)"
                    :is-dot="Boolean(state.tabsDot)"
                    @change="onChange"
                    @click="onClick"
                    @disabled="onDisabled"
                />
                <view class="demo-tabs-feedback">
                    <text>{{ text('当前选中') }}：{{ currentLabel }}</text>
                    <text class="demo-tabs-feedback__event">{{ text('最近事件') }}：{{ lastEvent }}</text>
                </view>
                <text class="demo-variant-title">{{ text('均分模式') }}</text>
                <snake-tabs
                    :list="evenList"
                    :current="evenCurrent"
                    :is-scroll="false"
                    :active-color="String(state.tabsColor)"
                    :font-size="Number(state.tabsSize)"
                    :bar-width="Number(state.tabsBarWidth)"
                    :bar-height="Number(state.tabsBarHeight)"
                    :bg-color="String(state.tabsBgColor)"
                    :show-bar="Boolean(state.tabsShowBar)"
                    @change="evenCurrent = $event"
                />
                <view class="demo-tabs-actions">
                    <snake-button size="mini" plain :loading="refreshing" @click="refreshList">
                        {{ text('模拟异步刷新列表') }}
                    </snake-button>
                </view>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const current = ref(0);
const evenCurrent = ref(0);
const lastEvent = ref('—');
const refreshing = ref(false);
const tabsRef = ref();

interface DemoTab {
    name: string;
    count?: number;
    disabled?: boolean;
}

const baseTabs = computed<DemoTab[]>(() =>
    isEnglish.value
        ? [
              { name: 'Recommend', count: 12 },
              { name: 'New', count: 3 },
              { name: 'Hot' },
              { name: 'Flash Deals', count: 8 },
              { name: 'Brands' },
              { name: 'Live (soon)', disabled: true }
          ]
        : [
              { name: '推荐', count: 12 },
              { name: '新品', count: 3 },
              { name: '热门' },
              { name: '限时活动', count: 8 },
              { name: '品牌馆' },
              { name: '直播预告', disabled: true }
          ]
);
const demoList = ref<DemoTab[]>([...baseTabs.value]);
watch(baseTabs, next => {
    demoList.value = [...next];
    current.value = Math.min(current.value, Math.max(next.length - 1, 0));
    void nextTick(() => tabsRef.value?.init());
});
const evenList = computed(() =>
    isEnglish.value ? ['Paid', 'To ship', 'To receive', 'Service'] : ['已付款', '待发货', '待收货', '售后']
);
const currentLabel = computed(() => String(demoList.value[current.value]?.name ?? ''));

const controls: DemoControl[] = [
    { key: 'tabsScrollable', label: '允许横向滚动', type: 'switch', defaultValue: true },
    {
        key: 'tabsColor',
        label: '活动颜色',
        type: 'select',
        defaultValue: '#06D290',
        options: [
            { label: '品牌绿', value: '#06D290' },
            { label: '蓝色', value: '#2563eb' },
            { label: '橙色', value: '#FF6A0C' }
        ]
    },
    { key: 'tabsSize', label: '文字尺寸', type: 'slider', defaultValue: 15, min: 12, max: 18, step: 1, unit: 'px' },
    {
        key: 'tabsBarWidth',
        label: '滑块宽度',
        type: 'slider',
        defaultValue: 20,
        min: 10,
        max: 40,
        step: 2,
        unit: 'px'
    },
    {
        key: 'tabsBarHeight',
        label: '滑块厚度',
        type: 'slider',
        defaultValue: 3,
        min: 2,
        max: 10,
        step: 1,
        unit: 'px'
    },
    { key: 'tabsGutter', label: '标签间距', type: 'slider', defaultValue: 20, min: 10, max: 40, step: 2, unit: 'px' },
    {
        key: 'tabsBgColor',
        label: '背景颜色',
        type: 'select',
        defaultValue: '#ffffff',
        options: [
            { label: '白色', value: '#ffffff' },
            { label: '浅灰', value: '#f1f1f1' },
            { label: '薄荷', value: '#06D2901A' }
        ]
    },
    { key: 'tabsShowBar', label: '显示滑块', type: 'switch', defaultValue: true },
    { key: 'tabsDot', label: '使用圆点徽标', type: 'switch', defaultValue: false }
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
    return demoTitle('tabs', '标签页');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}

function onChange(index: number) {
    current.value = index;
    lastEvent.value = `change(${index})`;
}
function onClick(index: number) {
    lastEvent.value = `click(${index})`;
}
function onDisabled(index: number) {
    lastEvent.value = `disabled(${index})`;
}

/** 模拟异步拉取：随机徽标数（含 99+ 场景），等待视图更新后重新测量滑块 */
async function refreshList() {
    refreshing.value = true;
    await new Promise(resolve => setTimeout(resolve, 400));
    demoList.value = baseTabs.value.map(tab => ({
        ...tab,
        count: tab.disabled || Math.random() < 0.3 ? tab.count : Math.floor(Math.random() * 130)
    }));
    current.value = Math.min(current.value, Math.max(demoList.value.length - 1, 0));
    lastEvent.value = text('列表已刷新，重新测量');
    refreshing.value = false;
    await nextTick();
    await tabsRef.value?.init();
}
</script>

<style scoped>
.demo-stack {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.demo-variant-title {
    color: var(--snake-color-text);
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
}
.demo-tabs-feedback {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 10px 12px;
    border-radius: 8px;
    background: var(--snake-color-surface-muted);
    color: var(--snake-color-text);
    font-size: 13px;
    line-height: 1.5;
}
.demo-tabs-feedback__event {
    color: var(--snake-demo-accent-text);
}
.demo-tabs-actions {
    display: flex;
    justify-content: center;
}
</style>
