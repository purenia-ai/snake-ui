<template>
    <DemoPage :title="title" :desc="text('把入口按等分宽度排成九宫格，用于首页金刚区。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-grid-card">
                <snake-grid
                    :column="Number(state.column)"
                    :border="Boolean(state.border)"
                    :square="Boolean(state.square)"
                    :gutter="Number(state.gutter)"
                    clickable
                >
                    <snake-grid-item
                        v-for="item in entries"
                        :key="item.text"
                        :icon="item.icon"
                        :text="item.text"
                        :badge="item.badge || ''"
                        @click="onItemClick"
                    />
                </snake-grid>
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
    { key: 'column', label: '列数', type: 'slider', defaultValue: 4, min: 2, max: 5, step: 1, unit: '' },
    { key: 'border', label: '格线', type: 'switch', defaultValue: false },
    { key: 'square', label: '等高', type: 'switch', defaultValue: false },
    { key: 'gutter', label: '间距', type: 'slider', defaultValue: 0, min: 0, max: 20, step: 2, unit: 'px' }
];
const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
const entries = computed(() => {
    const _locale = localeName.value;
    return [
        { icon: 'home', text: demoText('首页'), badge: '' },
        { icon: 'search', text: demoText('搜索'), badge: '' },
        { icon: 'share', text: demoText('分享'), badge: '' },
        { icon: 'phone', text: demoText('客服'), badge: 3 },
        { icon: 'arrow-right', text: demoText('订单'), badge: '' },
        { icon: 'checkmark-circle', text: demoText('优惠券'), badge: '' },
        { icon: 'arrow-up', text: demoText('收藏'), badge: '' },
        { icon: 'close', text: demoText('设置'), badge: '' }
    ];
});
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
    return demoTitle('grid', '宫格');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function onItemClick(index: number) {
    const entry = entries.value[index];
    uni.showToast({ title: entry ? entry.text : String(index), icon: 'none' });
}
</script>

<style scoped>
/* 圆角卡片要裁剪，就得给角标留缓冲：徽标圆心压在图标右上角、向上溢出 7px，
   --snake-grid-item-padding: 8px 让每个格子多 8px 内边距，溢出量落在缓冲区内 */
.demo-grid-card {
    overflow: hidden;
    border-radius: 8px;
    --snake-grid-item-padding: 8px;
}
</style>
