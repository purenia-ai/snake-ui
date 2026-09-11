<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const clickedIndex = ref<string | number>('');
const controls: DemoControl[] = [
    { key: 'cgTitle', label: '分组标题', type: 'input', defaultValue: '', placeholder: '请输入分组标题' },
    { key: 'cgBorder', label: '外边框', type: 'switch', defaultValue: true },
    {
        key: 'ciIcon',
        label: '左侧图标',
        type: 'select',
        defaultValue: 'phone',
        options: [
            { label: '无图标', value: '' },
            { label: '手机', value: 'phone' },
            { label: '页面', value: 'page' }
        ]
    },
    { key: 'ciTitle', label: '标题', type: 'input', defaultValue: '单元格标题', placeholder: '请输入标题' },
    { key: 'ciLabel', label: '描述文字', type: 'input', defaultValue: '', placeholder: '请输入描述文字' },
    { key: 'ciArrow', label: '显示箭头', type: 'switch', defaultValue: true },
    {
        key: 'ciArrowDirection',
        label: '箭头方向',
        type: 'select',
        defaultValue: 'right',
        options: [
            { label: '向右', value: 'right' },
            { label: '向上', value: 'up' },
            { label: '向下', value: 'down' }
        ]
    },
    { key: 'ciRequired', label: '必填星号', type: 'switch', defaultValue: false },
    { key: 'ciCenter', label: '内容垂直居中', type: 'switch', defaultValue: false }
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
    return demoTitle('cell', '单元格');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function cellClicked(index: string | number) {
    clickedIndex.value = index;
}
</script>

<template>
    <DemoPage :title="title" :desc="text('组合单元格条目与分组容器，用于设置和个人中心等列表场景。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-cell-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Live preview' : '实时预览' }}</text>
                <snake-cell-group :title="String(state.cgTitle)" :border="Boolean(state.cgBorder)">
                    <snake-cell-item
                        :icon="String(state.ciIcon)"
                        :title="String(state.ciTitle)"
                        :label="String(state.ciLabel)"
                        :arrow="Boolean(state.ciArrow)"
                        :arrow-direction="String(state.ciArrowDirection)"
                        :required="Boolean(state.ciRequired)"
                        :center="Boolean(state.ciCenter)"
                        value="内容"
                        index="live"
                        @click="cellClicked"
                    />
                </snake-cell-group>
                <text class="demo-variant-title">{{ isEnglish ? 'Grouped cells' : '分组示例' }}</text>
                <snake-cell-group :title="isEnglish ? 'Personal center' : '个人中心'">
                    <snake-cell-item icon="phone" title="手机号码" value="138****8000" />
                    <snake-cell-item title="地址管理" value="收货地址" index="1" @click="cellClicked" />
                    <snake-cell-item title="必填示例" required :arrow="false" index="2" @click="cellClicked">
                        <template #right-icon>
                            <view class="demo-cell-tag">{{ isEnglish ? 'Custom' : '自定义' }}</view>
                        </template>
                    </snake-cell-item>
                </snake-cell-group>
                <text class="demo-variant-sub">{{ text('点击条目') }}：{{ clickedIndex || '—' }}</text>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
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
.demo-cell-tag {
    padding: 4rpx 16rpx;
    border: 1rpx solid var(--snake-color-primary, #06d290);
    border-radius: 100rpx;
    color: var(--snake-color-primary, #06d290);
    font-size: 22rpx;
}
</style>
