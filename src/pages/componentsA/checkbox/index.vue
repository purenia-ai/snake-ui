<template>
    <DemoPage :title="title" :desc="text('可独立使用的复选框，也可放入 CheckboxGroup 管理数量上下限与批量操作。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-control-stack demo-checkbox-showcase">
                <text class="demo-variant-title">{{ text('独立复选框') }}</text>
                <snake-checkbox
                    v-model="accepted"
                    :disabled="Boolean(state.checkboxDisabled)"
                    :shape="shapeValue"
                    :size="String(state.checkboxSize)"
                    :placement="placementValue"
                    :active-color="String(state.checkActiveColor)"
                    :inactive-color="String(state.checkInactiveColor)"
                    :label-disabled="Boolean(state.checkboxLabelDisabled)"
                >
                    {{ isEnglish ? 'Accept the user agreement' : '同意用户协议' }}
                </snake-checkbox>
                <text class="demo-checkbox-value">{{ isEnglish ? 'Current value: ' : '当前值：' }}{{ accepted }}</text>
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('分组多选与数量限制')">
            <view class="demo-control-stack">
                <text class="demo-variant-title">
                    {{
                        isEnglish
                            ? `Pick ${state.checkMin}–${state.checkMax} fruits`
                            : `选择 ${state.checkMin}–${state.checkMax} 种水果`
                    }}
                </text>
                <snake-checkbox-group
                    v-model="fruits"
                    :disabled="Boolean(state.checkboxDisabled)"
                    :size="String(state.checkboxSize)"
                    :wrap="Boolean(state.checkboxWrap)"
                    :border="Boolean(state.checkboxBorder)"
                    :placement="placementValue"
                    :shape="shapeValue"
                    :min="Number(state.checkMin)"
                    :max="Number(state.checkMax)"
                    :active-color="String(state.checkActiveColor)"
                    :inactive-color="String(state.checkInactiveColor)"
                    :label-disabled="Boolean(state.checkboxLabelDisabled)"
                >
                    <snake-checkbox v-for="item in options" :key="item.value" :name="item.value">
                        {{ item.label }}
                    </snake-checkbox>
                </snake-checkbox-group>
                <text class="demo-checkbox-value">
                    {{ isEnglish ? 'Selected: ' : '已选：' }}{{ selectedLabels || (isEnglish ? 'None' : '无') }}
                </text>
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('全选与半选')">
            <view class="demo-control-stack">
                <snake-checkbox :model-value="allChecked" :indeterminate="partlyChecked" @change="toggleAllFruits">
                    {{ isEnglish ? 'Select all' : '全选' }}
                </snake-checkbox>
                <snake-checkbox-group ref="groupRef" v-model="fruits" :max="Number(state.checkMax)">
                    <snake-checkbox v-for="item in options" :key="item.value" :name="item.value">
                        {{ item.label }}
                    </snake-checkbox>
                </snake-checkbox-group>
                <text class="demo-checkbox-value">
                    {{ isEnglish ? 'toggleAll → ' : 'toggleAll 返回：' }}{{ lastToggleResult }}
                </text>
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('列表形态')">
            <view class="demo-control-stack">
                <text class="demo-variant-title">{{ text('指示器在右 + 行分隔线') }}</text>
                <snake-checkbox-group v-model="channels" wrap border placement="right" inactive-color="#c0c4cc">
                    <snake-checkbox v-for="item in channelOptions" :key="item.value" :name="item.value" border>
                        {{ item.label }}
                    </snake-checkbox>
                </snake-checkbox-group>
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('状态总览')">
            <view class="demo-checkbox-gallery">
                <view class="demo-checkbox-item">
                    <snake-checkbox :model-value="true">{{ isEnglish ? 'Checked' : '已选' }}</snake-checkbox>
                    <text>{{ isEnglish ? 'Checked' : '已选' }}</text>
                </view>
                <view class="demo-checkbox-item">
                    <snake-checkbox :model-value="false">{{ isEnglish ? 'Unchecked' : '未选' }}</snake-checkbox>
                    <text>{{ isEnglish ? 'Unchecked' : '未选' }}</text>
                </view>
                <view class="demo-checkbox-item">
                    <snake-checkbox :model-value="true" shape="circle">{{
                        isEnglish ? 'Circle' : '圆形'
                    }}</snake-checkbox>
                    <text>circle</text>
                </view>
                <view class="demo-checkbox-item">
                    <snake-checkbox :model-value="false" indeterminate>{{
                        isEnglish ? 'Indeterminate' : '半选'
                    }}</snake-checkbox>
                    <text>indeterminate</text>
                </view>
                <view class="demo-checkbox-item">
                    <snake-checkbox :model-value="true" disabled>{{
                        isEnglish ? 'Disabled · checked' : '禁用·已选'
                    }}</snake-checkbox>
                    <text>{{ isEnglish ? 'Disabled · checked' : '禁用·已选' }}</text>
                </view>
                <view class="demo-checkbox-item">
                    <snake-checkbox :model-value="false" disabled>{{
                        isEnglish ? 'Disabled · unchecked' : '禁用·未选'
                    }}</snake-checkbox>
                    <text>{{ isEnglish ? 'Disabled · unchecked' : '禁用·未选' }}</text>
                </view>
                <view class="demo-checkbox-item">
                    <snake-checkbox :model-value="false" :size="22">{{
                        isEnglish ? 'Custom 22' : '自定义 22'
                    }}</snake-checkbox>
                    <text>:size="22"</text>
                </view>
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('表单校验')">
            <snake-form :model="formModel" :rules="formRules">
                <snake-form-item :label="text('通知方式')" prop="channels" required>
                    <snake-checkbox-group v-model="formModel.channels" placement="right" wrap border>
                        <snake-checkbox v-for="item in channelOptions" :key="item.value" :name="item.value" border>
                            {{ item.label }}
                        </snake-checkbox>
                    </snake-checkbox-group>
                </snake-form-item>
            </snake-form>
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
import type { CheckboxPlacement } from '../../../uni_modules/snake-ui/components/snake-checkbox/types';
import type { CheckboxGroupExpose } from '../../../uni_modules/snake-ui/components/snake-checkbox-group/types';
import type { FormRules } from '../../../uni_modules/snake-ui/components/snake-form/types';
const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const state = reactive<Record<string, DemoValue>>({
    checkboxDisabled: false,
    checkboxSize: 'default',
    checkboxWrap: false,
    checkboxBorder: false,
    checkboxPlacement: 'left',
    checkboxShape: 'square',
    checkActiveColor: '#06D290',
    checkInactiveColor: '',
    checkboxLabelDisabled: false,
    checkMin: 0,
    checkMax: 2
});
const accepted = ref(true);
const fruits = ref<(string | number)[]>(['apple']);
const channels = ref<(string | number)[]>(['sms']);
const formModel = reactive({ channels: [] as (string | number)[] });
const groupRef = ref<CheckboxGroupExpose | null>(null);
const lastToggleResult = ref('—');
const fruitValues = ['apple', 'pear', 'lemon'];
const options = computed(() =>
    isEnglish.value
        ? [
              { value: 'apple', label: 'Apple' },
              { value: 'pear', label: 'Pear' },
              { value: 'lemon', label: 'Lemon' }
          ]
        : [
              { value: 'apple', label: '苹果' },
              { value: 'pear', label: '雪梨' },
              { value: 'lemon', label: '柠檬' }
          ]
);
const channelOptions = computed(() =>
    isEnglish.value
        ? [
              { value: 'sms', label: 'SMS' },
              { value: 'email', label: 'Email' },
              { value: 'push', label: 'In-app push' }
          ]
        : [
              { value: 'sms', label: '短信通知' },
              { value: 'email', label: '邮件通知' },
              { value: 'push', label: '应用内推送' }
          ]
);
const selectedLabels = computed(() =>
    fruits.value
        .map(value => options.value.find(item => item.value === value)?.label ?? String(value))
        .join(isEnglish.value ? ', ' : '、')
);
const allChecked = computed(() => fruitValues.every(value => fruits.value.includes(value)));
const partlyChecked = computed(() => fruits.value.length > 0 && !allChecked.value);
const shapeValue = computed<'square' | 'circle'>(() => (state.checkboxShape === 'square' ? 'square' : 'circle'));
const placementValue = computed<CheckboxPlacement>(() => (state.checkboxPlacement === 'right' ? 'right' : 'left'));
const formRules = computed<FormRules>(() => ({
    channels: [{ required: true, type: 'array', min: 1, message: text('请至少选择一种通知方式'), trigger: 'change' }]
}));
function toggleAllFruits() {
    const next = groupRef.value?.toggleAll({ checked: !allChecked.value }) ?? [];
    lastToggleResult.value = next.length ? next.join(', ') : '[]';
}
const controls: DemoControl[] = [
    { key: 'checkboxDisabled', label: '禁用状态', type: 'switch', defaultValue: false },
    {
        key: 'checkboxSize',
        label: '组件尺寸',
        type: 'select',
        defaultValue: 'default',
        options: [
            { label: 'small', value: 'small' },
            { label: 'default', value: 'default' },
            { label: 'large', value: 'large' },
            { label: '18px', value: 18 }
        ]
    },
    {
        key: 'checkboxPlacement',
        label: '指示器位置',
        type: 'select',
        defaultValue: 'left',
        options: [
            { label: '左侧', value: 'left' },
            { label: '右侧', value: 'right' }
        ]
    },
    { key: 'checkboxWrap', label: '每个换行', type: 'switch', defaultValue: false },
    { key: 'checkboxBorder', label: '行分隔线', type: 'switch', defaultValue: false },
    {
        key: 'checkboxShape',
        label: '图标形状',
        type: 'select',
        defaultValue: 'square',
        options: [
            { label: '方形', value: 'square' },
            { label: '圆形', value: 'circle' }
        ]
    },
    {
        key: 'checkActiveColor',
        label: '选中颜色',
        type: 'select',
        defaultValue: '#06D290',
        options: [
            { label: '品牌绿', value: '#06D290' },
            { label: '蓝色', value: '#2563eb' },
            { label: '橙色', value: '#FF6A0C' }
        ]
    },
    {
        key: 'checkInactiveColor',
        label: '未选颜色',
        type: 'select',
        defaultValue: '',
        options: [
            { label: '默认', value: '' },
            { label: '浅灰', value: '#c0c4cc' },
            { label: '浅蓝', value: '#93c5fd' }
        ]
    },
    { key: 'checkboxLabelDisabled', label: '禁用文本点击', type: 'switch', defaultValue: false },
    {
        key: 'checkMin',
        label: '最少选择数',
        type: 'select',
        defaultValue: 0,
        options: [
            { label: '0', value: 0 },
            { label: '1', value: 1 },
            { label: '2', value: 2 }
        ]
    },
    {
        key: 'checkMax',
        label: '最多选择数',
        type: 'select',
        defaultValue: 2,
        options: [
            { label: '1', value: 1 },
            { label: '2', value: 2 },
            { label: '3', value: 3 }
        ]
    }
];
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('checkbox', '复选框');
});
function updateValue(key: string, nextValue: DemoValue) {
    state[key] = nextValue;
}
</script>
<style scoped>
.demo-control-stack {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 12px;
}
.demo-control-stack > text {
    color: var(--snake-color-text-secondary);
    font-size: 13px;
}
.demo-checkbox-value {
    color: var(--snake-color-text-secondary);
    font-size: 13px;
}
.demo-checkbox-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 14px 20px;
    padding: 12px;
    border-radius: 8px;
    background: var(--snake-color-surface-muted);
}
.demo-checkbox-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;
}
.demo-checkbox-item > text {
    color: var(--snake-color-text-muted);
    font-size: 11px;
}
</style>
