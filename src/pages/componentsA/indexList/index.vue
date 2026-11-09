<template>
    <DemoPage :title="title" :desc="text('通过右侧索引快速定位列表中的分组内容。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-index-list-showcase">
                <view class="demo-index-status">
                    <view class="demo-index-status__main">
                        <text class="demo-index-status__label">{{ text('当前分组') }}</text>
                        <text class="demo-index-status__value">{{ currentLetter || '—' }}</text>
                    </view>
                    <text class="demo-index-status__meta">{{ eventText }}</text>
                </view>

                <snake-index-list
                    ref="listRef"
                    :index-list="indexDemoLetters"
                    :scroll-top="scrollTop"
                    :sticky="Boolean(state.indexSticky)"
                    :offset-top="Number(state.indexOffset)"
                    :active-color="String(state.indexColor)"
                    @change="onChange"
                    @select="onSelect"
                >
                    <view v-for="group in indexDemoGroups" :key="group.letter">
                        <snake-index-anchor :index="group.letter" :text="anchorText(group.letter)" />
                        <view v-for="item in group.items" :key="item.en" class="demo-index-row">
                            <text class="demo-index-row__name">{{ rowLabel(item) }}</text>
                            <text class="demo-index-row__tag">{{ group.letter }}</text>
                        </view>
                    </view>
                </snake-index-list>

                <view class="demo-index-toolbar">
                    <snake-button size="small" @click="jumpTo('C')">{{ text('跳到 C 组') }}</snake-button>
                    <snake-button size="small" type="default" @click="refresh">{{ text('重新测量') }}</snake-button>
                    <text class="demo-variant-caption">{{ text('右侧索引可点击或拖动') }}</text>
                </view>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { onPageScroll } from '@dcloudio/uni-app';
import { computed, nextTick, reactive, ref } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
import { indexDemoGroups, indexDemoLetters } from '../../../common/index-demo-data';
import type { IndexValue } from '../../../uni_modules/snake-ui/components/snake-index-list/types';

const { localeName, text } = useDemoLocale();
const scrollTop = ref(0);
const currentLetter = ref('');
const changeCount = ref(0);
const selectCount = ref(0);
const listRef = ref<{ scrollTo: (value: IndexValue) => void; update: () => void } | null>(null);
const controls: DemoControl[] = [
    {
        key: 'indexColor',
        label: '活动颜色',
        type: 'select',
        defaultValue: '#06D290',
        options: [
            { label: '品牌绿', value: '#06D290' },
            { label: '蓝色', value: '#2563eb' },
            { label: '橙色', value: '#f97316' }
        ]
    },
    { key: 'indexSticky', label: '锚点吸顶', type: 'switch', defaultValue: true },
    { key: 'indexOffset', label: '吸顶偏移', type: 'slider', defaultValue: 44, min: 0, max: 88, step: 4, unit: 'px' }
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
    return demoTitle('index-list', '索引列表');
});
const eventText = computed(() => `${text('滚动同步')} ${changeCount.value} · ${text('点击索引')} ${selectCount.value}`);
const isEnglish = computed(() => localeName.value === 'en-US');

function rowLabel(item: { zh: string; en: string }) {
    return isEnglish.value ? item.en : item.zh;
}
function anchorText(letter: string) {
    return `${text('分组')} ${letter}`;
}
function onChange(payload: { index: number; value: IndexValue }) {
    currentLetter.value = String(payload.value);
    changeCount.value += 1;
}
function onSelect(value: IndexValue) {
    currentLetter.value = String(value);
    selectCount.value += 1;
}
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function jumpTo(letter: string) {
    listRef.value?.scrollTo(letter);
}
async function refresh() {
    await nextTick();
    listRef.value?.update();
    uni.showToast({ title: text('已重新测量'), icon: 'none' });
}
onPageScroll(event => {
    scrollTop.value = event.scrollTop;
});
</script>

<style scoped>
.demo-index-list-showcase {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.demo-index-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    background: var(--snake-color-surface-muted);
}

.demo-index-status__main {
    display: flex;
    align-items: baseline;
    gap: 8px;
}

.demo-index-status__label {
    color: var(--snake-color-text-secondary);
    font-size: 12px;
}

.demo-index-status__value {
    color: var(--snake-demo-accent-text);
    font-size: 18px;
    font-weight: 700;
    line-height: 1.2;
}

.demo-index-status__meta {
    flex: 1;
    color: var(--snake-color-text-muted);
    font-size: 11px;
    line-height: 1.4;
    text-align: right;
}

.demo-index-row {
    display: flex;
    min-height: 48px;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px 0 12px;
    border-bottom: 1px solid var(--snake-color-divider);
    color: var(--snake-color-text-secondary);
    background: var(--snake-color-surface);
    font-size: 14px;
}

.demo-index-row__tag {
    min-width: 18px;
    padding: 1px 5px;
    border-radius: 4px;
    color: var(--snake-color-text-muted);
    font-size: 11px;
    line-height: 1.6;
    text-align: center;
    background: var(--snake-color-surface-muted);
}

.demo-index-toolbar {
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
