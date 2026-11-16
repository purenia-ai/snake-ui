<template>
    <DemoPage :title="title" :desc="text('管理一组互斥的单选值，支持列表形态、自定义尺寸与表单校验。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-control-stack demo-radio-showcase">
                <text class="demo-variant-title">{{ text('互斥选择') }}</text>
                <snake-radio-group
                    v-model="value"
                    :disabled="Boolean(state.radioDisabled)"
                    :size="String(state.radioSize)"
                    :wrap="Boolean(state.radioWrap)"
                    :border="Boolean(state.radioBorder)"
                    :width="widthValue"
                    :placement="placementValue"
                    :shape="shapeValue"
                    :active-color="String(state.radioActiveColor)"
                    :inactive-color="String(state.radioInactiveColor)"
                    :label-disabled="Boolean(state.radioLabelDisabled)"
                >
                    <snake-radio v-for="item in flavors" :key="item.value" :name="item.value">
                        {{ item.label }}
                    </snake-radio>
                </snake-radio-group>
                <text class="demo-radio-value">{{ isEnglish ? 'Selected: ' : '已选：' }}{{ selectedLabel }}</text>
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('列表形态')">
            <view class="demo-control-stack">
                <text class="demo-variant-title">{{ text('指示器在右 + 行分隔线') }}</text>
                <snake-radio-group v-model="layout" wrap border placement="right" inactive-color="#c0c4cc">
                    <snake-radio v-for="item in layouts" :key="item.value" :name="item.value" border>
                        {{ item.label }}
                    </snake-radio>
                </snake-radio-group>
                <text class="demo-radio-value">{{ isEnglish ? 'Selected: ' : '已选：' }}{{ layoutLabel }}</text>
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('尺寸与状态')">
            <view class="demo-radio-gallery">
                <view class="demo-radio-item">
                    <snake-radio-group v-model="sizeSmall" size="small">
                        <snake-radio name="s">{{ isEnglish ? 'Small' : '小号' }}</snake-radio>
                    </snake-radio-group>
                    <text>small</text>
                </view>
                <view class="demo-radio-item">
                    <snake-radio-group v-model="sizeDefault" size="default">
                        <snake-radio name="s">{{ isEnglish ? 'Default' : '默认' }}</snake-radio>
                    </snake-radio-group>
                    <text>default</text>
                </view>
                <view class="demo-radio-item">
                    <snake-radio-group v-model="sizeLarge" size="large">
                        <snake-radio name="s">{{ isEnglish ? 'Large' : '大号' }}</snake-radio>
                    </snake-radio-group>
                    <text>large</text>
                </view>
                <view class="demo-radio-item">
                    <snake-radio-group v-model="sizeCustom" :size="22">
                        <snake-radio name="s">{{ isEnglish ? 'Custom 22' : '自定义 22' }}</snake-radio>
                    </snake-radio-group>
                    <text>:size="22"</text>
                </view>
                <view class="demo-radio-item">
                    <snake-radio-group v-model="states" shape="square" active-color="#2563eb">
                        <snake-radio name="square">{{ isEnglish ? 'Square blue' : '方形蓝色' }}</snake-radio>
                    </snake-radio-group>
                    <text>{{ isEnglish ? 'Square' : '方形' }}</text>
                </view>
                <view class="demo-radio-item">
                    <snake-radio-group v-model="states" shape="circle">
                        <snake-radio name="square" disabled>{{
                            isEnglish ? 'Disabled · checked' : '禁用·已选'
                        }}</snake-radio>
                    </snake-radio-group>
                    <text>{{ isEnglish ? 'Disabled · checked' : '禁用·已选' }}</text>
                </view>
                <view class="demo-radio-item">
                    <snake-radio-group v-model="emptyState">
                        <snake-radio name="square" disabled>{{
                            isEnglish ? 'Disabled · unchecked' : '禁用·未选'
                        }}</snake-radio>
                    </snake-radio-group>
                    <text>{{ isEnglish ? 'Disabled · unchecked' : '禁用·未选' }}</text>
                </view>
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('表单校验')">
            <snake-form :model="formModel" :rules="formRules">
                <snake-form-item :label="text('配送方式')" prop="delivery" required>
                    <snake-radio-group v-model="formModel.delivery" wrap border placement="right">
                        <snake-radio v-for="item in deliveries" :key="item.value" :name="item.value" border>
                            {{ item.label }}
                        </snake-radio>
                    </snake-radio-group>
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
import type { FormRules } from '../../../uni_modules/snake-ui/components/snake-form/types';
import type { RadioPlacement } from '../../../uni_modules/snake-ui/components/snake-radio/types';
const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const state = reactive<Record<string, DemoValue>>({
    radioDisabled: false,
    radioSize: 'default',
    radioPlacement: 'left',
    radioWrap: false,
    radioBorder: false,
    radioWidth: 'auto',
    radioShape: 'circle',
    radioActiveColor: '#06D290',
    radioInactiveColor: '',
    radioLabelDisabled: false
});
const value = ref('sweet');
const layout = ref('list');
const sizeSmall = ref('s');
const sizeDefault = ref('s');
const sizeLarge = ref('s');
const sizeCustom = ref('s');
const states = ref('square');
const emptyState = ref('other');
const formModel = reactive({ delivery: '' });
const flavors = computed(() =>
    isEnglish.value
        ? [
              { value: 'sweet', label: 'Sweet' },
              { value: 'spicy', label: 'Spicy' },
              { value: 'mild', label: 'Mild' }
          ]
        : [
              { value: 'sweet', label: '鲜甜' },
              { value: 'spicy', label: '香辣' },
              { value: 'mild', label: '清淡' }
          ]
);
const layouts = computed(() =>
    isEnglish.value
        ? [
              { value: 'list', label: 'List view' },
              { value: 'grid', label: 'Grid view' },
              { value: 'compact', label: 'Compact view' }
          ]
        : [
              { value: 'list', label: '列表视图' },
              { value: 'grid', label: '网格视图' },
              { value: 'compact', label: '紧凑视图' }
          ]
);
const deliveries = computed(() =>
    isEnglish.value
        ? [
              { value: 'express', label: 'Express delivery' },
              { value: 'pickup', label: 'Store pickup' }
          ]
        : [
              { value: 'express', label: '快递配送' },
              { value: 'pickup', label: '到店自提' }
          ]
);
const selectedLabel = computed(() => flavors.value.find(item => item.value === value.value)?.label ?? value.value);
const layoutLabel = computed(() => layouts.value.find(item => item.value === layout.value)?.label ?? layout.value);
const shapeValue = computed<'square' | 'circle'>(() => (state.radioShape === 'square' ? 'square' : 'circle'));
const placementValue = computed<RadioPlacement>(() => (state.radioPlacement === 'right' ? 'right' : 'left'));
const widthValue = computed<string | number>(() => (state.radioWidth === 'auto' ? 'auto' : Number(state.radioWidth)));
const formRules = computed<FormRules>(() => ({
    delivery: [{ required: true, message: text('请选择配送方式'), trigger: 'change' }]
}));
const controls: DemoControl[] = [
    { key: 'radioDisabled', label: '禁用状态', type: 'switch', defaultValue: false },
    {
        key: 'radioSize',
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
        key: 'radioPlacement',
        label: '指示器位置',
        type: 'select',
        defaultValue: 'left',
        options: [
            { label: '左侧', value: 'left' },
            { label: '右侧', value: 'right' }
        ]
    },
    { key: 'radioWrap', label: '每个换行', type: 'switch', defaultValue: false },
    { key: 'radioBorder', label: '行分隔线', type: 'switch', defaultValue: false },
    {
        key: 'radioWidth',
        label: '单项宽度',
        type: 'select',
        defaultValue: 'auto',
        options: [
            { label: 'auto', value: 'auto' },
            { label: '120px', value: 120 }
        ]
    },
    {
        key: 'radioShape',
        label: '图标形状',
        type: 'select',
        defaultValue: 'circle',
        options: [
            { label: '圆形', value: 'circle' },
            { label: '方形', value: 'square' }
        ]
    },
    {
        key: 'radioActiveColor',
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
        key: 'radioInactiveColor',
        label: '未选颜色',
        type: 'select',
        defaultValue: '',
        options: [
            { label: '默认', value: '' },
            { label: '浅灰', value: '#c0c4cc' },
            { label: '浅蓝', value: '#93c5fd' }
        ]
    },
    { key: 'radioLabelDisabled', label: '禁用文本点击', type: 'switch', defaultValue: false }
];
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('radio', '单选框');
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
.demo-radio-value {
    color: var(--snake-color-text-secondary);
    font-size: 13px;
}
.demo-radio-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 14px 20px;
    padding: 12px;
    border-radius: 8px;
    background: var(--snake-color-surface-muted);
}
.demo-radio-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;
}
.demo-radio-item > text {
    color: var(--snake-color-text-muted);
    font-size: 11px;
}
</style>
