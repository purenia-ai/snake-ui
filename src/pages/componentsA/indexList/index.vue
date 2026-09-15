<template>
    <DemoPage :title="title" :desc="text('通过右侧索引快速定位列表中的分组内容。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-index demo-index-list-showcase">
                <snake-index-list
                    :index-list="letters"
                    :scroll-top="scrollTop"
                    :active-color="String(state.indexColor)"
                >
                    <view v-for="letter in letters" :key="letter">
                        <snake-index-anchor
                            :index="letter"
                            :text="letter"
                            custom-style="height: 64rpx; padding: 0 20rpx"
                        />
                        <view v-for="item in 3" :key="item" class="demo-index-row">
                            {{ letter }} {{ isEnglish ? 'item' : '类内容' }} {{ item }}
                        </view>
                    </view>
                </snake-index-list>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { onPageScroll } from '@dcloudio/uni-app';
import { computed, reactive, ref } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const letters = ['A', 'B', 'C', 'D'];
const scrollTop = ref(0);
const controls: DemoControl[] = [
    {
        key: 'indexColor',
        label: '活动颜色',
        type: 'select',
        defaultValue: '#06D290',
        options: [
            { label: '品牌绿', value: '#06D290' },
            { label: '蓝色', value: '#2563eb' }
        ]
    }
];
const state = reactive<Record<string, DemoValue>>({ indexColor: '#06D290' });
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
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
onPageScroll(event => {
    scrollTop.value = event.scrollTop;
});
</script>

<style scoped>
.demo-index-row {
    min-height: 160rpx;
    padding: 28rpx 20rpx;
    border-bottom: 1rpx solid var(--snake-color-divider);
    color: var(--snake-color-text-secondary);
    background: var(--snake-color-surface);
}
</style>
