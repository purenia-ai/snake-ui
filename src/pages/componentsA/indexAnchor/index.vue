<template>
    <DemoPage :title="title" :desc="text('索引锚点定义分组位置，需要放在 IndexList 或 IndexListPanel 内使用。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-index-anchor-showcase">
                <view class="demo-index-status">
                    <view class="demo-index-status__main">
                        <text class="demo-index-status__label">{{ text('当前分组') }}</text>
                        <text class="demo-index-status__value">{{ currentLetter || '—' }}</text>
                    </view>
                    <text class="demo-index-status__meta">{{ eventText }}</text>
                </view>

                <view class="demo-index-panel">
                    <snake-index-list-panel
                        ref="panelRef"
                        :index-list="indexDemoLetters"
                        :active-color="String(state.anchorColor)"
                        @change="onChange"
                    >
                        <view v-for="group in indexDemoGroups" :key="group.letter">
                            <snake-index-anchor
                                :index="group.letter"
                                :use-slot="Boolean(state.anchorSlot)"
                                :text="anchorText(group.letter)"
                            >
                                <view class="demo-index-anchor-slot">
                                    <text class="demo-index-anchor-slot__label">{{ anchorText(group.letter) }}</text>
                                    <text class="demo-index-anchor-slot__count">
                                        {{ group.items.length }} {{ text('条') }}
                                    </text>
                                </view>
                            </snake-index-anchor>
                            <view v-for="item in group.items" :key="item.en" class="demo-index-row">
                                <text class="demo-index-row__name">{{ rowLabel(item) }}</text>
                                <text class="demo-index-row__tag">{{ group.letter }}</text>
                            </view>
                        </view>
                    </snake-index-list-panel>
                </view>

                <text class="demo-variant-caption">{{ text('切换插槽内容可对比文字锚点与自定义内容') }}</text>
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
import { indexDemoGroups, indexDemoLetters } from '../../../common/index-demo-data';
import type { IndexValue } from '../../../uni_modules/snake-ui/components/snake-index-list/types';

const { localeName, text } = useDemoLocale();
const currentLetter = ref('');
const changeCount = ref(0);
const panelRef = ref<{ scrollTo: (value: IndexValue) => void; update: () => void } | null>(null);
const controls: DemoControl[] = [
    { key: 'anchorPrefix', label: '分组前缀', type: 'input', defaultValue: '', placeholder: '分组' },
    { key: 'anchorSlot', label: '插槽内容', type: 'switch', defaultValue: false },
    {
        key: 'anchorColor',
        label: '活动颜色',
        type: 'select',
        defaultValue: '#06D290',
        options: [
            { label: '品牌绿', value: '#06D290' },
            { label: '蓝色', value: '#2563eb' },
            { label: '橙色', value: '#f97316' }
        ]
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
    return demoTitle('index-anchor', '索引锚点');
});
const eventText = computed(() => `${text('滚动同步')} ${changeCount.value}`);
const isEnglish = computed(() => localeName.value === 'en-US');

function rowLabel(item: { zh: string; en: string }) {
    return isEnglish.value ? item.en : item.zh;
}
function anchorText(letter: string) {
    const prefix = String(state.anchorPrefix ?? '').trim() || text('分组');
    return `${prefix} ${letter}`;
}
function onChange(payload: { index: number; value: IndexValue }) {
    currentLetter.value = String(payload.value);
    changeCount.value += 1;
}
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
// 插槽与文字两种锚点高度不同，切换后需要重新测量分组位置。
watch(
    () => [state.anchorSlot, state.anchorPrefix],
    async () => {
        await nextTick();
        panelRef.value?.update();
    }
);
</script>

<style scoped>
.demo-index-anchor-showcase {
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

.demo-index-panel {
    height: 320px;
    overflow: hidden;
    border: 1px solid var(--snake-color-divider);
    border-radius: 8px;
}

.demo-index-anchor-slot {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.demo-index-anchor-slot__label {
    font-weight: 600;
}

.demo-index-anchor-slot__count {
    color: var(--snake-color-text-muted);
    font-size: 11px;
    font-weight: 400;
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

.demo-variant-caption {
    color: var(--snake-color-text-secondary);
    font-size: 12px;
    line-height: 1.5;
}
</style>
