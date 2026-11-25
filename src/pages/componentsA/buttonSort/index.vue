<template>
    <DemoPage :title="title" :desc="text('点击后在默认、升序和降序状态之间循环切换。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-button-sort-showcase">
                <view class="demo-sort-bar" role="toolbar" :aria-label="text('商品排序')">
                    <view
                        class="demo-sort-bar__item"
                        :class="{ 'is-active': currentSort === 'recommend' }"
                        role="button"
                        tabindex="0"
                        :aria-pressed="currentSort === 'recommend'"
                        @click="selectQuick('recommend')"
                        @keydown.enter.prevent="selectQuick('recommend')"
                        @keydown.space.prevent="selectQuick('recommend')"
                    >
                        <text class="demo-sort-bar__label">{{ text('综合') }}</text>
                    </view>
                    <snake-button-sort
                        v-model="priceSort"
                        :title="String(state.sortTitle)"
                        :font-size="Number(state.sortFontSize)"
                        :title-color="String(state.sortTitleColor)"
                        :active-color="String(state.sortActiveColor)"
                        :allow-reset="Boolean(state.sortAllowReset)"
                        :desc-first="Boolean(state.sortDescFirst)"
                        @change="handlePriceChange"
                    />
                    <view
                        class="demo-sort-bar__item"
                        :class="{ 'is-active': currentSort === 'sales' }"
                        role="button"
                        tabindex="0"
                        :aria-pressed="currentSort === 'sales'"
                        @click="selectQuick('sales')"
                        @keydown.enter.prevent="selectQuick('sales')"
                        @keydown.space.prevent="selectQuick('sales')"
                    >
                        <text class="demo-sort-bar__label">{{ text('销量') }}</text>
                    </view>
                </view>
                <text class="demo-sort-summary">{{ text('当前排序') }}：{{ currentSummary }}</text>
                <text class="demo-sort-hint">{{ text('切到其他列会把价格排序清空，箭头随之复位') }}</text>
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('循环方式')">
            <view class="demo-sort-cycle">
                <view class="demo-sort-cycle__cell">
                    <text class="demo-sort-cycle__title">{{ text('三态循环') }}</text>
                    <snake-button-sort v-model="triValue" :title="text('价格')" />
                    <text class="demo-sort-cycle__value">{{ describeValue(triValue) }}</text>
                </view>
                <view class="demo-sort-cycle__cell">
                    <text class="demo-sort-cycle__title">{{ text('两态切换') }}</text>
                    <snake-button-sort v-model="toggleValue" :title="text('价格')" :allow-reset="false" />
                    <text class="demo-sort-cycle__value">{{ describeValue(toggleValue) }}</text>
                </view>
                <view class="demo-sort-cycle__cell">
                    <text class="demo-sort-cycle__title">{{ text('降序优先') }}</text>
                    <snake-button-sort v-model="descValue" :title="text('价格')" desc-first />
                    <text class="demo-sort-cycle__value">{{ describeValue(descValue) }}</text>
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
import { demoTitle, localizeDemoControls, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
import type {
    ButtonSortChangeDetail,
    ButtonSortValue
} from '../../../uni_modules/snake-ui/components/snake-button-sort/types';

const { localeName, text } = useDemoLocale();

type QuickSortKey = 'recommend' | 'sales';

/** 价格列走组件自身状态，综合/销量是同一栏里的一次性排序项。 */
const priceSort = ref<ButtonSortValue>('');
const currentSort = ref<'recommend' | 'price' | 'sales'>('recommend');
/** 三个循环方式各自独立，互不影响。 */
const triValue = ref<ButtonSortValue>('');
const toggleValue = ref<ButtonSortValue>('');
const descValue = ref<ButtonSortValue>('');

function selectQuick(key: QuickSortKey) {
    currentSort.value = key;
    // 受控用法：切到别的列把价格排序置空，箭头才会跟着复位
    priceSort.value = '';
}

function handlePriceChange(payload: ButtonSortChangeDetail) {
    // allowReset 关闭时组件不会再回空值，这里仍按返回值判断
    currentSort.value = payload.value ? 'price' : 'recommend';
}

function describeValue(value: ButtonSortValue): string {
    if (value === 'asc') return text('升序');
    if (value === 'desc') return text('降序');
    return text('默认');
}

const currentSummary = computed(() => {
    if (currentSort.value === 'sales') return text('销量');
    if (currentSort.value !== 'price') return text('综合');
    return `${text('价格')} · ${describeValue(priceSort.value)}`;
});

const controls: DemoControl[] = [
    { key: 'sortTitle', label: '按钮文字', type: 'input', defaultValue: '价格' },
    { key: 'sortFontSize', label: '字号', type: 'slider', defaultValue: 13, min: 12, max: 18, step: 1, unit: 'px' },
    {
        key: 'sortTitleColor',
        label: '标题颜色',
        type: 'select',
        // 空值表示跟随主题文字色，与组件默认一致
        defaultValue: '',
        options: [
            { label: '默认', value: '' },
            { label: '次要文字', value: '#606266' },
            { label: '中灰', value: '#909399' }
        ]
    },
    {
        key: 'sortActiveColor',
        label: '激活颜色',
        type: 'select',
        // 空值表示用主题绿
        defaultValue: '',
        options: [
            { label: '默认', value: '' },
            { label: '品牌绿', value: '#06D290' },
            { label: '蓝色', value: '#2563eb' }
        ]
    },
    { key: 'sortAllowReset', label: '允许回到未排序', type: 'switch', defaultValue: true },
    { key: 'sortDescFirst', label: '降序优先', type: 'switch', defaultValue: false }
];
const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return localizeDemoControls(controls);
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('button-sort', '排序按钮');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<style scoped>
.demo-sort-bar {
    display: flex;
    height: 44px;
    align-items: center;
    padding: 0 4px;
    border-bottom: 1px solid var(--snake-color-divider);
    background-color: var(--snake-color-surface);
}
.demo-sort-bar__item {
    display: flex;
    flex: 1;
    height: 100%;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.demo-sort-bar__label {
    font-size: 13px;
    line-height: 1;
    color: var(--snake-color-text);
}
.demo-sort-bar__item.is-active .demo-sort-bar__label {
    color: var(--snake-color-primary);
    font-weight: 500;
}
.demo-sort-summary {
    display: block;
    margin-top: 12px;
    font-size: 13px;
    color: var(--snake-color-text-secondary);
}
.demo-sort-hint {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    color: var(--snake-color-text-muted);
}
.demo-sort-cycle {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
}
.demo-sort-cycle__title {
    display: block;
    margin-bottom: 8px;
    font-size: 12px;
    line-height: 1.4;
    color: var(--snake-color-text-secondary);
    text-align: center;
}
.demo-sort-cycle__value {
    display: block;
    margin-top: 8px;
    font-size: 12px;
    line-height: 1.4;
    color: var(--snake-color-text-muted);
    text-align: center;
}
</style>
