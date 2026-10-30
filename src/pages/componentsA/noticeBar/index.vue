<template>
    <DemoPage :title="title" :desc="text('承载重要通知，支持横向滚动、纵向轮播、有限队列和关闭操作。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-notice-bar-showcase">
                <view class="demo-notice-bar__heading">
                    <text class="demo-variant-title">{{ isEnglish ? 'Live configuration' : '实时配置' }}</text>
                    <text class="demo-variant-caption">{{
                        isEnglish ? 'Changes apply immediately' : '控制项会立即生效'
                    }}</text>
                </view>
                <snake-notice-bar
                    :type="String(state.noticeType)"
                    :volume-icon="Boolean(state.noticeIcon)"
                    :more-icon="Boolean(state.noticeMore)"
                    :mode="liveVertical ? 'vertical' : 'horizontal'"
                    :direction="liveVertical ? 'column' : 'row'"
                    :text="liveVertical ? '' : liveText"
                    :list="liveVertical ? liveList : []"
                    :autoplay="Boolean(state.noticeAutoplay)"
                    :play-state="state.noticePlayState === 'paused' ? 'paused' : 'play'"
                    :is-circular="Boolean(state.noticeCircular)"
                    :speed="Number(state.noticeSpeed)"
                    :duration="Number(state.noticeDuration)"
                    @get-more="handleActionMore"
                />

                <view class="demo-notice-bar__heading">
                    <text class="demo-variant-title">{{ isEnglish ? 'Finite queue' : '有限队列' }}</text>
                    <text class="demo-variant-caption">
                        {{ isEnglish ? `Completed ${finiteEndCount} time(s)` : `已完成 ${finiteEndCount} 次` }}
                    </text>
                </view>
                <snake-notice-bar
                    ref="finiteNoticeRef"
                    :list="finiteList"
                    :is-circular="false"
                    :duration="1600"
                    volume-icon
                    @end="finiteEndCount += 1"
                />
                <snake-button size="mini" plain @click="resetFiniteNotice">
                    {{ isEnglish ? 'Replay queue' : '重新播放' }}
                </snake-button>

                <view class="demo-notice-bar__heading">
                    <text class="demo-variant-title">{{ isEnglish ? 'Close and actions' : '关闭与操作' }}</text>
                    <text class="demo-variant-caption">{{
                        actionMessage || (isEnglish ? 'Try the icons on the right' : '试试右侧图标')
                    }}</text>
                </view>
                <snake-notice-bar
                    v-model:show="actionNoticeVisible"
                    type="warning"
                    text="系统公告已更新"
                    volume-icon
                    more-icon
                    close-icon
                    @close="handleActionClose"
                    @get-more="handleActionMore"
                />
                <snake-button v-if="!actionNoticeVisible" size="mini" plain @click="restoreActionNotice">
                    {{ isEnglish ? 'Restore notice' : '恢复通知' }}
                </snake-button>
            </view>
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

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const finiteNoticeRef = ref<{ reset: () => void }>();
const actionNoticeVisible = ref(true);
const finiteEndCount = ref(0);
const actionMessage = ref('');
const controls: DemoControl[] = [
    {
        key: 'noticeType',
        label: '通知类型',
        type: 'select',
        defaultValue: 'info',
        options: [
            { label: '主要', value: 'primary' },
            { label: '成功', value: 'success' },
            { label: '警告', value: 'warning' },
            { label: '错误', value: 'error' },
            { label: '信息', value: 'info' }
        ]
    },
    {
        key: 'noticeMode',
        label: '展示模式',
        type: 'select',
        defaultValue: 'horizontal',
        options: [
            { label: '横向', value: 'horizontal' },
            { label: '纵向', value: 'vertical' }
        ]
    },
    { key: 'noticeCircular', label: '无缝循环', type: 'switch', defaultValue: true },
    { key: 'noticeAutoplay', label: '自动播放', type: 'switch', defaultValue: true },
    {
        key: 'noticePlayState',
        label: '播放状态',
        type: 'select',
        defaultValue: 'play',
        options: [
            { label: '播放', value: 'play' },
            { label: '暂停', value: 'paused' }
        ]
    },
    { key: 'noticeIcon', label: '显示提示图标', type: 'switch', defaultValue: true },
    { key: 'noticeMore', label: '显示更多操作', type: 'switch', defaultValue: true },
    {
        key: 'noticeSpeed',
        label: '滚动速度',
        type: 'slider',
        defaultValue: 80,
        min: 40,
        max: 200,
        step: 20,
        unit: 'rpx/s'
    },
    {
        key: 'noticeDuration',
        label: '轮播间隔',
        type: 'slider',
        defaultValue: 1800,
        min: 1000,
        max: 4000,
        step: 200,
        unit: 'ms'
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
    return demoTitle('notice-bar', '通知栏');
});
const liveVertical = computed(() => state.noticeMode === 'vertical');
const liveText = computed(() =>
    isEnglish.value ? 'Welcome to Snake UI — configurable notice playback' : '欢迎使用 Snake UI，通知栏支持可配置播放'
);
const liveList = computed(() =>
    isEnglish.value
        ? ['Foundation components are ready', 'Supports H5, mini programs and apps']
        : ['基础组件已就绪', '支持 H5、小程序和 App']
);
const finiteList = computed(() =>
    isEnglish.value
        ? ['Order paid successfully', 'Coupon expires tonight', 'Delivery has been dispatched']
        : ['订单支付成功', '优惠券将于今晚到期', '商品已经发货']
);
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function resetFiniteNotice() {
    finiteEndCount.value = 0;
    finiteNoticeRef.value?.reset();
}
function restoreActionNotice() {
    actionNoticeVisible.value = true;
    actionMessage.value = '';
}
function handleActionMore() {
    actionMessage.value = isEnglish.value ? 'More action triggered' : '已触发更多操作';
}
function handleActionClose() {
    actionMessage.value = isEnglish.value ? 'Notice dismissed; restore it below' : '通知已关闭，可点击下方恢复';
}
</script>

<style scoped>
.demo-stack {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
}
.demo-notice-bar__heading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16rpx;
}
.demo-variant-title {
    color: var(--snake-color-text);
    font-size: 28rpx;
    font-weight: 600;
    line-height: 1.4;
}
.demo-variant-caption {
    flex: 1;
    overflow: hidden;
    color: var(--snake-color-text-muted, #909399);
    font-size: 24rpx;
    line-height: 1.4;
    text-align: right;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
