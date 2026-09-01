<script setup lang="ts">
import { computed, reactive } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const controls: DemoControl[] = [{ key: 'menuTitle', label: '菜单标题', type: 'input', defaultValue: '全部分类' }];
const state = reactive<Record<string, DemoValue>>({ menuTitle: '全部分类' });
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('drop-menu-item', '下拉菜单项');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<template>
    <DemoPage :title="title" :eyebrow="text('导航与布局')" :desc="text('下拉菜单项提供触发按钮、内容面板和关闭事件。')">
        <DemoSection variant="preview" :title="text('演示效果')"
            ><view class="demo-menu demo-drop-menu-item-showcase"
                ><snake-drop-menu
                    ><snake-drop-menu-item :title="String(state.menuTitle)"
                        ><view class="demo-menu-panel">{{
                            isEnglish
                                ? 'Place filters or other business content here'
                                : '这里可以放筛选项或其他业务内容'
                        }}</view></snake-drop-menu-item
                    ><snake-drop-menu-item :title="isEnglish ? 'Sort by' : '排序方式'"
                        ><view class="demo-menu-panel">{{
                            isEnglish ? 'Recommended · Latest · Price' : '综合排序 · 最新发布 · 价格优先'
                        }}</view></snake-drop-menu-item
                    ></snake-drop-menu
                ></view
            ></DemoSection
        >
        <DemoSection variant="controls" :title="text('参数配置')"
            ><DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue"
        /></DemoSection>
    </DemoPage>
</template>

<style scoped>
.demo-menu {
    min-height: 320rpx;
    padding: 28rpx 0;
}
.demo-menu :deep(.snake-drop-menu) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}
.demo-menu-panel {
    padding: 48rpx 28rpx;
    color: var(--snake-color-text-secondary);
    background: var(--snake-color-surface);
}
</style>
