<template>
    <DemoPage :title="title" :desc="text('集成占位、清除与操作按钮的常用搜索输入。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-search-stack">
                <text class="demo-variant-title">{{ text('实时预览') }}</text>
                <snake-search
                    v-model="keyword"
                    :shape="String(state.sShape)"
                    :show-action="Boolean(state.sShowAction)"
                    :clearabled="Boolean(state.sClear)"
                    :animation="Boolean(state.sAnimation)"
                    :bg-color="String(state.sBgColor)"
                    :disabled="Boolean(state.sDisabled)"
                    :input-align="String(state.sInputAlign)"
                    :placeholder="String(state.sPlaceholder || text('请输入关键字'))"
                    :action-text="isEnglish ? 'Search' : '搜索'"
                    margin="8px 0"
                    @search="onSearch"
                    @custom="onCustom"
                    @clear="onClear"
                />
                <text class="demo-search-hint">{{ text('搜索内容') }}：{{ keyword || '—' }}</text>
                <text class="demo-search-hint">{{ lastEvent || text('暂无事件') }}</text>
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('形状与状态')">
            <view class="demo-search-stack">
                <snake-search
                    shape="square"
                    height="34"
                    :show-action="false"
                    bg-color="#ffffff"
                    border-color="var(--snake-color-border, #e4e7ed)"
                    :placeholder="text('方形 + 描边')"
                />
                <snake-search disabled :placeholder="text('禁用态：点击触发 click')" @click="onDisabledClick" />
                <snake-search
                    v-model="focusKeyword"
                    animation
                    :placeholder="text('聚焦时展开右侧按钮')"
                    @custom="onCustom"
                />
            </view>
            <text class="demo-search-hint">{{ text('有内容就显示清除按钮，失焦后也能一键清空') }}</text>
        </DemoSection>
        <DemoSection variant="preview" :title="text('插槽与自定义按钮')">
            <view class="demo-search-stack">
                <snake-search v-model="slotKeyword" :placeholder="text('左侧插槽换成扫码，右侧插槽放图标')">
                    <template #left>
                        <snake-icon name="scan" :size="16" color="var(--snake-color-text-secondary, #606266)" />
                    </template>
                    <template #right>
                        <view class="demo-search-extra">
                            <snake-icon name="mic" :size="16" color="var(--snake-color-text-muted, #909399)" />
                        </view>
                    </template>
                </snake-search>
                <snake-search
                    v-model="actionKeyword"
                    :action-text="text('取消')"
                    :action-style="actionStyle"
                    @custom="onCustom"
                />
                <snake-search
                    v-model="hiddenKeyword"
                    :show-action="Boolean(false)"
                    :action-text="text('取消')"
                    :action-style="actionStyle"
                />
            </view>
            <text class="demo-search-hint">{{
                text('actionStyle 只改按钮外观，隐显仍由 showAction / animation 控制')
            }}</text>
        </DemoSection>
        <DemoSection variant="preview" :title="text('方法调用')">
            <view class="demo-search-stack">
                <snake-search
                    ref="searchRef"
                    v-model="methodKeyword"
                    :show-action="false"
                    :placeholder="text('通过 ref 调用 focus() / blur() / clear()')"
                />
                <view class="demo-search-tools">
                    <snake-button size="small" :text="text('聚焦')" @click="callFocus" />
                    <snake-button size="small" :text="text('失焦')" @click="callBlur" />
                    <snake-button size="small" :text="text('清空')" @click="callClear" />
                </view>
                <text class="demo-search-hint">{{ text('搜索内容') }}：{{ methodKeyword || '—' }}</text>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { SearchExpose } from '../../../uni_modules/snake-ui';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const keyword = ref('');
const focusKeyword = ref('');
const slotKeyword = ref('');
const actionKeyword = ref('');
const hiddenKeyword = ref('');
const methodKeyword = ref('');
const lastEvent = ref('');
const searchRef = ref<SearchExpose | null>(null);
const actionStyle = {
    width: '56px',
    height: '30px',
    lineHeight: '30px',
    borderRadius: '999px',
    background: 'var(--snake-color-primary, #06d290)',
    color: '#ffffff',
    fontWeight: 600,
    marginLeft: '8px'
};
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
    {
        key: 'sBgColor',
        label: '背景颜色',
        type: 'select',
        defaultValue: '#f1f1f1',
        options: [
            { label: '默认灰', value: '#f1f1f1' },
            { label: '薄荷', value: '#06D2901A' }
        ]
    },
    { key: 'sDisabled', label: '禁用状态', type: 'switch', defaultValue: false },
    {
        key: 'sInputAlign',
        label: '输入对齐',
        type: 'select',
        defaultValue: 'left',
        options: [
            { label: '左对齐', value: 'left' },
            { label: '居中', value: 'center' }
        ]
    },
    {
        key: 'sPlaceholder',
        label: '占位文字',
        type: 'input',
        defaultValue: '',
        placeholder: '请输入占位文字'
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
        placeholder: control.placeholder ? demoText(control.placeholder) : undefined,
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
function onCustom(value: string) {
    lastEvent.value = `${text('点击搜索')}：${value}`;
}
function onClear() {
    lastEvent.value = text('点击清除');
}
function onDisabledClick() {
    lastEvent.value = text('禁用状态下点击会触发 click');
}
function callFocus() {
    searchRef.value?.focus();
}
function callBlur() {
    searchRef.value?.blur();
}
function callClear() {
    searchRef.value?.clear();
}
</script>

<style scoped>
.demo-search-stack {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.demo-search-hint {
    color: var(--snake-color-text-muted);
    font-size: 12px;
}

.demo-search-extra {
    display: flex;
    flex: none;
    align-items: center;
    padding-left: 4px;
}

.demo-search-tools {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
</style>
