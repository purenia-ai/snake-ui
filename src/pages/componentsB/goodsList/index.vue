<template>
    <DemoPage :title="title" :desc="text('展示商品网格或列表，并承载价格和状态信息。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <snake-goods-list
                class="demo-goods-list-showcase"
                :goods-list="displayGoods"
                :list-type="String(state.goodsMode)"
                :commodity-type="0"
                :page-margin="Number(state.goodsMargin)"
                :image-margin="10"
                @item-click="selectGoods"
            />
            <text v-if="selectedGoods" class="goods-feedback" aria-live="polite">
                {{ isEnglish ? 'Selected: ' : '已选择：' }}{{ selectedGoods }}
            </text>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { goods } from '../../../common/fixtures';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const selectedId = ref<string | null>(null);
const controls: DemoControl[] = [
    {
        key: 'goodsMode',
        label: '列表类型',
        type: 'select',
        defaultValue: 'sale',
        options: [
            { label: '在售', value: 'sale' },
            { label: '新品', value: 'new' }
        ]
    },
    { key: 'goodsMargin', label: '页面边距', type: 'slider', defaultValue: 10, min: 0, max: 30, step: 5, unit: 'rpx' }
];
const state = reactive<Record<string, DemoValue>>({ goodsMode: 'sale', goodsMargin: 10 });
const displayGoods = computed(() =>
    (state.goodsMode === 'new' ? [...goods].reverse() : goods).map(item => ({
        ...item,
        name: isEnglish.value
            ? item.id === 'sku-1'
                ? 'Snake UI sample product'
                : 'Offline preview product'
            : item.name
    }))
);
const selectedGoods = computed(() => displayGoods.value.find(item => item.id === selectedId.value)?.name || '');
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
    return demoTitle('goods-list', '商品列表');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function selectGoods(item: { id?: string | number }) {
    selectedId.value = String(item.id || '');
}
</script>
<style scoped>
.goods-feedback {
    display: block;
    margin: 16rpx 24rpx 0;
    color: var(--snake-color-text-secondary);
    font-size: 24rpx;
}
</style>
