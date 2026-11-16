<template>
    <DemoPage :title="title" :desc="text('把长内容折叠成标题行，用于商品参数与常见问题。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <snake-collapse v-model="active" :accordion="Boolean(state.accordion)" :border="Boolean(state.border)">
                <snake-collapse-item name="spec" :title="text('商品参数')" :duration="Number(state.duration)">
                    <template #icon>
                        <snake-icon
                            name="info-circle"
                            :size="16"
                            :margin-left="0"
                            :margin-right="0"
                            color="var(--snake-color-primary, #06D290)"
                        />
                    </template>
                    <view>{{ text('材质：棉 95%、氨纶 5%') }}</view>
                    <view>{{ text('产地：浙江') }}</view>
                </snake-collapse-item>
                <snake-collapse-item
                    name="service"
                    :title="text('售后说明')"
                    icon="kefu-ermai"
                    :duration="Number(state.duration)"
                >
                    <view>{{ text('签收后 7 天内可申请无理由退货。') }}</view>
                </snake-collapse-item>
                <snake-collapse-item name="stock" :title="text('库存紧张，暂不可选')" disabled />
            </snake-collapse>
            <text class="demo-collapse-hint">
                {{ text('第一项用 #icon 插槽，第二项用 icon 属性') }}
            </text>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { CollapseValue } from '../../../uni_modules/snake-ui';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const active = ref<CollapseValue>(['spec']);
const controls: DemoControl[] = [
    { key: 'accordion', label: '手风琴', type: 'switch', defaultValue: false },
    { key: 'border', label: '分割线', type: 'switch', defaultValue: true },
    { key: 'duration', label: '动画时长', type: 'slider', defaultValue: 250, min: 0, max: 600, step: 50, unit: 'ms' }
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
    return demoTitle('collapse', '折叠面板');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<style scoped>
.snake-collapse {
    border-radius: 8px;
}

.demo-collapse-hint {
    display: block;
    margin-top: 10px;
    color: var(--snake-color-text-muted);
    font-size: 12px;
}
</style>
