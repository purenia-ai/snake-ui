<template>
    <view class="snake-step" :class="rootClass" :style="[rootStyle, customStyle]">
        <view class="snake-step__head">
            <view v-if="dot" class="snake-step__dot" />
            <view v-else class="snake-step__circle" :style="circleStyle">
                <slot name="icon">
                    <snake-icon
                        v-if="displayIcon"
                        :name="displayIcon"
                        size="inherit"
                        :margin-left="0"
                        :margin-right="0"
                        custom-class="snake-step__icon"
                    />
                    <text v-else class="snake-step__index">{{ displayIndex }}</text>
                </slot>
            </view>
            <!-- 连接线用真实节点承载：WXSS 的选择器白名单里没有伪类，伪元素方案在小程序会漏画最后一段 -->
            <view v-if="showLine" class="snake-step__line" />
        </view>
        <view class="snake-step__body">
            <view class="snake-step__title">
                <slot name="title">{{ title }}</slot>
            </view>
            <view v-if="description || slots.default" class="snake-step__description">
                <slot>{{ description }}</slot>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component Step
 * @description 步骤条子项：展示单步的序号/图标、标题与描述，状态由父级 Steps 推导或由 status 覆盖。
 * @see /components/steps
 */
import { computed, useSlots } from 'vue';
import Icon from '../snake-icon/snake-icon.vue';
import { useParent } from '../../libs/hooks';
import { stepsContextKey, type StepsContext } from '../snake-steps/types';
import { stepProps, type StepStatus } from './types';

defineOptions({ name: 'SnakeStep', options: { addGlobalClass: true, virtualHost: true, styleIsolation: 'shared' } });

const props = defineProps(stepProps);
const slots = useSlots();
const { parent, index } = useParent<StepsContext>(stepsContextKey);

/** 序号从 1 开始；脱离父级渲染时固定为 1。 */
const displayIndex = computed(() => (index.value < 0 ? 1 : index.value + 1));

const status = computed<StepStatus>(() => {
    if (props.status) return props.status;
    const context = parent.value;
    if (!context) return 'wait';
    const current = context.current.value;
    if (index.value < 0) return 'wait';
    if (index.value < current) return 'finish';
    if (index.value === current) return 'process';
    return 'wait';
});

const activeColor = computed(() => parent.value?.activeColor.value ?? 'var(--snake-color-primary, #06D290)');
const inactiveColor = computed(() => parent.value?.inactiveColor.value ?? 'var(--snake-color-text-muted, #909399)');
const errorColor = computed(() => parent.value?.errorColor.value ?? 'var(--snake-color-error, #FA3534)');

/** 点状模式由父级统一开关。 */
const dot = computed(() => Boolean(parent.value?.dot.value));

/** 已完成/进行中圆点用主题色，异常用错误色，未开始只描边。 */
const circleStyle = computed(() => {
    if (status.value === 'finish' || status.value === 'process') {
        return {
            backgroundColor: activeColor.value,
            borderColor: activeColor.value,
            color: 'var(--snake-color-white, #ffffff)'
        };
    }
    if (status.value === 'error') {
        return {
            backgroundColor: errorColor.value,
            borderColor: errorColor.value,
            color: 'var(--snake-color-white, #ffffff)'
        };
    }
    return {
        backgroundColor: 'transparent',
        borderColor: inactiveColor.value,
        color: inactiveColor.value
    };
});

/** 圆点、点状指示器、标题共用的状态色。 */
const statusColor = computed(() => {
    if (status.value === 'error') return errorColor.value;
    if (status.value === 'wait') return inactiveColor.value;
    return activeColor.value;
});

/** 连接线的颜色取决于当前步骤是否已完成。 */
const rootStyle = computed<Record<string, string>>(() => ({
    '--snake-step-status-color': statusColor.value,
    '--snake-step-line-color': status.value === 'finish' ? activeColor.value : inactiveColor.value
}));

/**
 * 是否为最后一个子步骤。
 * 不用 CSS 伪类选择器定位最后一项：WXSS 的选择器白名单里只有 class / id / 元素 / ::after / ::before，
 * 伪类在小程序端不保证生效，最后一段连接线会漏处理。
 */
const isLast = computed(() => {
    const context = parent.value;
    if (!context || index.value < 0) return true;
    return index.value >= context.children.length - 1;
});

const showLine = computed(() => !isLast.value);

/** 已完成画对勾、异常画叉；显式传入的 icon 优先级最高。 */
const displayIcon = computed(() => {
    if (props.icon) return props.icon;
    if (status.value === 'finish') return 'checkmark';
    if (status.value === 'error') return 'close';
    return '';
});

const rootClass = computed(() => {
    const direction = parent.value?.direction.value ?? 'horizontal';
    const center = parent.value ? Boolean(parent.value.alignCenter.value) : true;
    return [
        `snake-step--${direction}`,
        `snake-step--${status.value}`,
        {
            'snake-step--center': center && direction === 'horizontal',
            'snake-step--dot': dot.value,
            'snake-step--last': isLast.value
        },
        props.customClass
    ];
});
</script>

<style scoped>
.snake-step {
    /* 指示器尺寸：点状模式换成小圆点，连接线的几何完全跟着这个变量走 */
    --snake-step-indicator-size: var(--snake-step-circle-size, 22px);
    position: relative;
    box-sizing: border-box;
}

.snake-step--dot {
    --snake-step-indicator-size: var(--snake-step-dot-size, 8px);
}

/* 等分宽度写在子项自己身上：父级 scoped 后代选择器跨组件在小程序端不可靠 */
.snake-step--horizontal {
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
}

.snake-step--horizontal.snake-step--center {
    align-items: center;
}

.snake-step--horizontal .snake-step__head {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
    width: 100%;
    height: var(--snake-step-circle-size, 22px);
}

.snake-step--horizontal.snake-step--center .snake-step__head {
    justify-content: center;
}

/* 只画相邻两个指示器之间的线段：起点让出自身宽度、终点停在下一个指示器的左边缘。
   若从圆心画到圆心，未开始状态的透明圆点会透出连线 */
.snake-step--horizontal .snake-step__line {
    position: absolute;
    top: 50%;
    left: var(--snake-step-indicator-size);
    width: calc(100% - var(--snake-step-indicator-size));
    height: 1px;
    margin-top: -0.5px;
    background-color: var(--snake-step-line-color, #e4e7ed);
}

.snake-step--horizontal.snake-step--center .snake-step__line {
    left: calc(50% + var(--snake-step-indicator-size) / 2);
}

.snake-step--horizontal .snake-step__body {
    margin-top: 6px;
    padding: 0 8px 0 0;
    text-align: left;
}

.snake-step--horizontal.snake-step--center .snake-step__body {
    align-items: center;
    padding: 0 4px;
    text-align: center;
}

.snake-step--vertical {
    display: flex;
    flex-direction: row;
    align-items: stretch;
}

.snake-step--vertical .snake-step__head {
    position: relative;
    display: flex;
    flex: 0 0 var(--snake-step-circle-size, 22px);
    justify-content: center;
    width: var(--snake-step-circle-size, 22px);
}

.snake-step--vertical .snake-step__line {
    position: absolute;
    top: var(--snake-step-indicator-size);
    left: 50%;
    width: 1px;
    height: calc(100% - var(--snake-step-indicator-size));
    margin-left: -0.5px;
    background-color: var(--snake-step-line-color, #e4e7ed);
}

.snake-step--vertical .snake-step__body {
    padding: 0 0 16px 10px;
    text-align: left;
}

/* 最后一项不留尾部空白 */
.snake-step--vertical.snake-step--last .snake-step__body {
    padding-bottom: 0;
}

.snake-step__circle {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: var(--snake-step-circle-size, 22px);
    height: var(--snake-step-circle-size, 22px);
    border: 1px solid transparent;
    border-radius: 50%;
    font-size: var(--snake-step-index-size, 12px);
    line-height: 1;
}

.snake-step__index {
    font-size: inherit;
    line-height: 1;
}

.snake-step__dot {
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    width: var(--snake-step-dot-size, 8px);
    height: var(--snake-step-dot-size, 8px);
    border: 1px solid var(--snake-step-status-color, #c8c9cc);
    border-radius: 50%;
    background-color: transparent;
}

.snake-step--dot.snake-step--finish .snake-step__dot,
.snake-step--dot.snake-step--error .snake-step__dot {
    background-color: var(--snake-step-status-color, #06d290);
}

/* 进行中用空心环，和已完成的实心点区分开 */
.snake-step--dot.snake-step--process .snake-step__dot {
    border-width: 2px;
    background-color: var(--snake-color-white, #ffffff);
}

/* snake-icon 传 size="inherit"，字号统一由这里控制，可被主题变量覆盖 */
.snake-step__icon {
    color: inherit;
    font-size: var(--snake-step-icon-size, 13px);
    line-height: 1;
}

.snake-step__body {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    min-width: 0;
}

.snake-step__title {
    color: var(--snake-color-text, #303133);
    font-size: var(--snake-step-title-size, 14px);
    line-height: 1.4;
    /* break-all 会把订单号、单号这类西文从中间劈开，用 break-word 只在整词放不下时换行 */
    word-break: normal;
    overflow-wrap: break-word;
}

.snake-step--error .snake-step__title {
    color: var(--snake-step-status-color, #fa3534);
}

.snake-step__description {
    margin-top: 2px;
    color: var(--snake-color-text-muted, #909399);
    font-size: var(--snake-step-description-size, 12px);
    line-height: 1.5;
    word-break: normal;
    overflow-wrap: break-word;
}
</style>
