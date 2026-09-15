<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const lastClick = ref('');
const controls: DemoControl[] = [
    {
        key: 'lHref',
        label: '链接地址',
        type: 'input',
        defaultValue: 'https://github.com/zwbcode/snake-ui',
        placeholder: '请输入链接地址'
    },
    { key: 'lUnderLine', label: '下划线', type: 'switch', defaultValue: false },
    {
        key: 'lDefaultClick',
        label: '打开方式',
        type: 'select',
        defaultValue: true,
        options: [
            { label: '内置跳转', value: true },
            { label: '仅触发事件', value: false }
        ]
    },
    {
        key: 'lColor',
        label: '文字颜色',
        type: 'select',
        defaultValue: '#06D290',
        options: [
            { label: '品牌绿', value: '#06D290' },
            { label: '警示色', value: '#fa3534' },
            { label: '黑色', value: '#000000' }
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
    return demoTitle('link', '超链接');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function onLinkClick(href: string) {
    lastClick.value = `${text('点击事件')}：${href}`;
}
</script>

<template>
    <DemoPage :title="title" :desc="text('跨端打开链接或复制到粘贴板。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-link-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Live preview' : '实时预览' }}</text>
                <view>
                    <snake-link
                        :href="String(state.lHref)"
                        :under-line="Boolean(state.lUnderLine)"
                        :default-click="Boolean(state.lDefaultClick)"
                        :color="String(state.lColor)"
                        @click="onLinkClick"
                    >
                        {{ isEnglish ? 'Visit Snake UI' : '访问 Snake UI 仓库' }}
                    </snake-link>
                </view>
                <text class="demo-variant-sub">{{ lastClick || (isEnglish ? 'No event yet' : '暂无事件') }}</text>
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
</style>
