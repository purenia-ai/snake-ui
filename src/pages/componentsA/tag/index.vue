<template>
    <DemoPage :title="title" :desc="text('以短文本标记商品属性、状态与筛选结果。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-tag-showcase">
                <view class="demo-tag-row">
                    <snake-tag text="包邮" />
                    <snake-tag type="primary" text="新品" />
                    <snake-tag type="success" text="已发货" />
                    <snake-tag type="error" text="缺货" />
                </view>
                <view class="demo-tag-row">
                    <snake-tag type="warning" plain round text="预售" />
                    <snake-tag type="info" size="small" icon="checkmark-circle" :text="text('已认证')" />
                    <snake-tag type="primary" size="mini" text="12 期免息" />
                </view>
                <view class="demo-tag-row">
                    <snake-tag
                        type="primary"
                        custom-style="background-color: #ff6a00; color: #ffffff"
                        :text="text('自定义底色')"
                    />
                    <snake-tag
                        type="primary"
                        plain
                        custom-style="background-color: #fff5e6"
                        :text="text('镂空保留描边')"
                    />
                    <text class="demo-tag-hint">{{ text('实心态换底色后描边自动透明，不会留主题色细边') }}</text>
                </view>
                <view class="demo-tag-row">
                    <snake-tag
                        :type="String(state.tagType)"
                        :size="String(state.tagSize)"
                        :plain="Boolean(state.tagPlain)"
                        :round="Boolean(state.tagRound)"
                        :closable="Boolean(state.tagClosable)"
                        :hair-line="Boolean(state.tagHairLine)"
                        :text="text('主标签')"
                        @close="onClose"
                    />
                    <text class="demo-tag-hint">{{ text('点击关闭图标查看事件') }}</text>
                </view>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const controls: DemoControl[] = [
    {
        key: 'tagType',
        label: '主题',
        type: 'select',
        defaultValue: 'primary',
        options: [
            { label: '默认', value: 'default' },
            { label: '主要', value: 'primary' },
            { label: '成功', value: 'success' },
            { label: '警告', value: 'warning' },
            { label: '错误', value: 'error' },
            { label: '信息', value: 'info' }
        ]
    },
    {
        key: 'tagSize',
        label: '尺寸',
        type: 'select',
        defaultValue: 'default',
        options: [
            { label: '默认', value: 'default' },
            { label: '中等', value: 'medium' },
            { label: '小', value: 'small' },
            { label: '迷你', value: 'mini' }
        ]
    },
    { key: 'tagPlain', label: '镂空', type: 'switch', defaultValue: false },
    { key: 'tagRound', label: '圆角', type: 'switch', defaultValue: false },
    { key: 'tagClosable', label: '可关闭', type: 'switch', defaultValue: false },
    { key: 'tagHairLine', label: '半像素描边', type: 'switch', defaultValue: true }
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
    return demoTitle('tag', '标签');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function onClose() {
    uni.showToast({ title: text('标签已关闭'), icon: 'none' });
}
</script>

<style scoped>
.demo-tag-showcase {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.demo-tag-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
}

.demo-tag-hint {
    color: var(--snake-color-text-muted);
    font-size: 12px;
}
</style>
