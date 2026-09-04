<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const keyword = ref('');
const lastEvent = ref('');
const controls: DemoControl[] = [
    {
        key: 'sShape',
        label: '搜索形状',
        type: 'select',
        defaultValue: 'round',
        options: [
            { label: '圆形', value: 'round' },
            { label: '方形', value: 'square' }
        ]
    },
    { key: 'sShowAction', label: '显示操作按钮', type: 'switch', defaultValue: true },
    { key: 'sClear', label: '启用清除', type: 'switch', defaultValue: true },
    { key: 'sAnimation', label: '聚焦动画', type: 'switch', defaultValue: false },
    { key: 'sPlaceholder', label: '占位文字', type: 'input', defaultValue: '请输入关键字', placeholder: '请输入占位文字' }
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
    return demoTitle('search', '搜索框');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function onSearch(value: string) {
    lastEvent.value = `${text('点击搜索')}：${value}`;
}
function onClear() {
    lastEvent.value = text('点击清除');
}
</script>

<template>
    <DemoPage
        :title="title"
        :eyebrow="text('表单组件')"
        :desc="text('集成占位、清除与操作按钮的常用搜索输入。')"
    >
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-search-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Live preview' : '实时预览' }}</text>
                <snake-search
                    v-model="keyword"
                    :shape="String(state.sShape)"
                    :show-action="Boolean(state.sShowAction)"
                    :clearabled="Boolean(state.sClear)"
                    :animation="Boolean(state.sAnimation)"
                    :placeholder="String(state.sPlaceholder)"
                    margin="16rpx 0"
                    @search="onSearch"
                    @clear="onClear" />
                <text class="demo-variant-sub">{{ text('搜索内容') }}：{{ keyword || '—' }}</text>
                <text class="demo-variant-sub">{{ lastEvent || (isEnglish ? 'No event yet' : '暂无事件') }}</text>
                <text class="demo-variant-title">{{ isEnglish ? 'Variants' : '变体示例' }}</text>
                <snake-search :show-action="false" placeholder="自定义背景" bg-color="#ffffff" margin="16rpx 0" />
                <snake-search shape="square" height="68" placeholder="方形搜索框" margin="16rpx 0" />
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')"
            ><DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue"
        /></DemoSection>
    </DemoPage>
</template>

<style scoped>
.demo-stack {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
}
.demo-variant-title {
    color: var(--snake-color-text);
    font-size: 28rpx;
    font-weight: 600;
    line-height: 1.4;
}
.demo-variant-sub {
    color: var(--snake-color-text-muted);
    font-size: 24rpx;
}
</style>
