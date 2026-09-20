<template>
    <DemoPage :title="title" :desc="isEnglish ? 'Short explanations beside an element.' : '在触发元素旁展示简短说明。'">
        <DemoSection bare variant="preview">
            <view class="tooltip-demo">
                <text class="tooltip-demo__heading">{{ isEnglish ? '12 placements' : '12 个展示方向' }}</text>
                <text class="tooltip-demo__description">
                    {{
                        isEnglish
                            ? 'Tap a label to see where its tip appears.'
                            : '点击方向标签，查看提示框相对触发元素的位置。'
                    }}
                </text>
                <view class="tooltip-demo__directions">
                    <view class="tooltip-demo__direction-row">
                        <snake-tooltip
                            v-for="direction in bottomDirections"
                            :key="direction"
                            :placement="direction"
                            :content="directionHint(direction)"
                            content-style="white-space: nowrap"
                        >
                            <button class="tooltip-demo__trigger">{{ direction }}</button>
                        </snake-tooltip>
                    </view>

                    <view class="tooltip-demo__direction-middle">
                        <view class="tooltip-demo__direction-column">
                            <snake-tooltip
                                v-for="direction in rightDirections"
                                :key="direction"
                                :placement="direction"
                                :content="directionHint(direction)"
                                content-style="white-space: nowrap"
                            >
                                <button class="tooltip-demo__trigger">{{ direction }}</button>
                            </snake-tooltip>
                        </view>
                        <view class="tooltip-demo__direction-column">
                            <snake-tooltip
                                v-for="direction in leftDirections"
                                :key="direction"
                                :placement="direction"
                                :content="directionHint(direction)"
                                content-style="white-space: nowrap"
                            >
                                <button class="tooltip-demo__trigger">{{ direction }}</button>
                            </snake-tooltip>
                        </view>
                    </view>

                    <view class="tooltip-demo__direction-row">
                        <snake-tooltip
                            v-for="direction in topDirections"
                            :key="direction"
                            :placement="direction"
                            :content="directionHint(direction)"
                            content-style="white-space: nowrap"
                        >
                            <button class="tooltip-demo__trigger">{{ direction }}</button>
                        </snake-tooltip>
                    </view>
                </view>
            </view>
        </DemoSection>

        <DemoSection bare variant="preview">
            <view class="tooltip-demo">
                <text class="tooltip-demo__heading">{{ isEnglish ? 'Options and states' : '参数与状态' }}</text>
                <view class="tooltip-demo__stage">
                    <snake-tooltip
                        :content="isEnglish ? 'A short explanation for this item' : '这是与当前元素相关的简短说明'"
                        :offset="Number(state.offset)"
                        :visible-arrow="Boolean(state.visibleArrow)"
                        :closeable="Boolean(state.closeable)"
                        :disabled="Boolean(state.disabled)"
                        :content-style="state.closeable ? 'padding-right: 48rpx' : ''"
                        @change="onChange"
                    >
                        <button class="tooltip-demo__trigger tooltip-demo__trigger--primary">
                            <snake-icon name="info-circle" :size="30" color="#fff" />
                            <text>{{ isEnglish ? 'Tap for details' : '点击查看说明' }}</text>
                        </button>
                    </snake-tooltip>
                </view>
                <text class="tooltip-demo__hint">{{ statusHint }}</text>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="isEnglish ? 'Options' : '参数配置'">
            <DemoControlPanel :controls="controls" :values="state" @change="updateValue" />
        </DemoSection>

        <DemoSection bare variant="preview">
            <view class="tooltip-demo">
                <text class="tooltip-demo__heading">
                    {{ isEnglish ? 'Controlled display and multiline content' : '受控显示与多行内容' }}
                </text>
                <view class="tooltip-demo__controlled">
                    <snake-tooltip
                        v-model="showDetail"
                        placement="bottom-start"
                        content-style="padding-right: 48rpx"
                        closeable
                    >
                        <button class="tooltip-demo__trigger">{{ isEnglish ? 'Delivery note' : '配送说明' }}</button>
                        <template #content>
                            <view class="tooltip-demo__content">
                                <text>{{
                                    isEnglish ? 'Delivery time varies by region.' : '配送时间因地区而异。'
                                }}</text>
                                <text>{{
                                    isEnglish ? 'Check the order page for details.' : '具体信息请查看订单页面。'
                                }}</text>
                            </view>
                        </template>
                    </snake-tooltip>
                    <snake-button type="primary" @click="showDetail = true">
                        {{ isEnglish ? 'Open with v-model' : '通过 v-model 打开' }}
                    </snake-button>
                </view>
                <text class="tooltip-demo__hint">
                    {{
                        isEnglish ? 'Use the close icon or tap outside to dismiss.' : '点击关闭图标或提示框外区域关闭。'
                    }}
                </text>
            </view>
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import { demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
import type {
    TooltipChangeDetail,
    TooltipPlacement
} from '../../../uni_modules/snake-ui/components/snake-tooltip/types';

const { localeName } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('tooltip', '文字提示');
});

const bottomDirections: TooltipPlacement[] = ['bottom-start', 'bottom', 'bottom-end'];
const rightDirections: TooltipPlacement[] = ['right-start', 'right', 'right-end'];
const leftDirections: TooltipPlacement[] = ['left-start', 'left', 'left-end'];
const topDirections: TooltipPlacement[] = ['top-start', 'top', 'top-end'];

const state = reactive<Record<string, DemoValue>>({
    offset: 8,
    visibleArrow: true,
    closeable: false,
    disabled: false
});
const showDetail = ref(false);
const lastChange = ref<'open' | 'close' | ''>('');
const statusHint = computed(() => {
    if (state.disabled) return isEnglish.value ? 'The trigger is disabled.' : '当前已禁用触发。';
    if (lastChange.value) {
        return isEnglish.value
            ? `Last event: ${lastChange.value}`
            : `最近事件：${lastChange.value === 'open' ? '打开' : '关闭'}`;
    }
    return isEnglish.value ? 'Tap outside to dismiss the tip.' : '点击提示框外的区域可关闭。';
});
const controls = computed<DemoControl[]>(() => [
    {
        key: 'offset',
        label: isEnglish.value ? 'Offset' : '提示间距',
        type: 'slider',
        defaultValue: 8,
        min: 4,
        max: 24,
        step: 2,
        unit: 'rpx'
    },
    { key: 'visibleArrow', label: isEnglish.value ? 'Show arrow' : '显示箭头', type: 'switch', defaultValue: true },
    { key: 'closeable', label: isEnglish.value ? 'Close button' : '关闭按钮', type: 'switch', defaultValue: false },
    { key: 'disabled', label: isEnglish.value ? 'Disabled' : '禁用触发', type: 'switch', defaultValue: false }
]);

function directionHint(direction: TooltipPlacement) {
    return isEnglish.value ? `Tip at ${direction}` : `${direction} 方向提示`;
}

function onChange(detail: TooltipChangeDetail) {
    lastChange.value = detail.show ? 'open' : 'close';
}

function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<style scoped lang="scss">
@import '../../../common/demo.scss';

.tooltip-demo {
    margin-bottom: 28rpx;
    border: 1rpx dashed var(--snake-color-divider);
    border-radius: 10rpx;
    background: var(--snake-color-surface);
}

.tooltip-demo__heading {
    display: block;
    padding: 24rpx 24rpx 12rpx;
    color: var(--snake-color-text);
    font-size: 30rpx;
    font-weight: 600;
    text-align: center;
}

.tooltip-demo__description,
.tooltip-demo__hint {
    display: block;
    padding: 0 24rpx 24rpx;
    color: var(--snake-color-text-muted);
    font-size: 23rpx;
    line-height: 1.5;
    text-align: center;
}

.tooltip-demo__directions {
    padding: 32rpx 18rpx 48rpx;
}

.tooltip-demo__direction-row,
.tooltip-demo__direction-middle {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.tooltip-demo__direction-middle {
    margin: 64rpx 0;
}

.tooltip-demo__direction-column {
    display: flex;
    flex-direction: column;
    gap: 28rpx;
}

.tooltip-demo__trigger {
    display: inline-flex;
    box-sizing: border-box;
    min-width: 168rpx;
    min-height: 76rpx;
    margin: 0;
    padding: 0 16rpx;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    border: 1rpx solid var(--snake-color-primary);
    border-radius: 8rpx;
    background: var(--snake-color-primary);
    color: #fff;
    font-size: 26rpx;
    font-weight: 500;
    line-height: 1.2;
}

.tooltip-demo__trigger::after {
    border: 0;
}

.tooltip-demo__trigger--primary {
    min-height: 80rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
}

.tooltip-demo__stage {
    display: flex;
    min-height: 160rpx;
    align-items: center;
    justify-content: center;
}

.tooltip-demo__controlled {
    display: flex;
    min-height: 160rpx;
    align-items: center;
    justify-content: space-around;
    gap: 20rpx;
    padding: 0 20rpx;
}

.tooltip-demo__content {
    display: flex;
    max-width: 320rpx;
    flex-direction: column;
    gap: 8rpx;
    white-space: nowrap;
}
</style>
