<script setup lang="ts">
/**
 * @component Select
 * @description 列选择器，用于单列、多列、多列联动的选择场景，基于原生 picker-view 与 Popup 实现。
 * @see /components/select
 */

import { computed, ref, watch } from 'vue';
import zIndex from '../../libs/config/zIndex';
import { useLocale } from '../../libs/hooks/useLocale';
import Popup from '../snake-popup/snake-popup.vue';
import { selectProps, type SelectEmits, type SelectItem, type SelectResult } from './types';

defineOptions({ name: 'SnakeSelect', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = defineProps(selectProps);
const emit = defineEmits<SelectEmits>();
const { t } = useLocale('select');

// 用于列改变时保存当前索引，下一次变化时比较得出是哪一列发生了变化
const defaultSelector = ref<number[]>([0]);
// picker-view 的列数据
const columnData = ref<SelectItem[][]>([]);
// 控制 picker 是否渲染（等待初始化完成），确保原生 picker-view 在数据就绪后才创建
const readyToRender = ref(false);
// 保存用户上次确认的索引，首次打开会使用 props.defaultValue
const savedSelector = ref<number[] | null>(
    props.defaultValue && props.defaultValue.length ? props.defaultValue.slice() : null
);
// 每次队列发生变化时，保存选择的结果
const selectValue = ref<SelectResult[]>([]);
// 上一次列变化时的 index
const lastSelectIndex = ref<number[]>([]);
// 列数
const columnNum = ref(0);
// 列是否还在滑动中，微信小程序滑动中点确定结果可能不准确
const moving = ref(false);
// 用户有传递层级值时优先使用
const popupZIndex = computed(() => Number(props.zIndex) || zIndex.popup);

const popupValue = computed({
    get: () => props.modelValue,
    set: (val: boolean) => emit('update:modelValue', val)
});

const cancelTextValue = computed(() => props.cancelText || t('cancelText'));
const confirmTextValue = computed(() => props.confirmText || t('confirmText'));

watch(
    () => props.modelValue,
    val => {
        if (val) {
            // 同步调用 init()，确保 columnData 在 picker-view 渲染前就填充完毕
            init();
            readyToRender.value = true;
        } else {
            // 关闭弹窗时复位，下次打开时 picker-view 会重新创建，确保数据刷新
            readyToRender.value = false;
        }
    },
    { immediate: true }
);

/** 标识滑动开始，只有微信小程序才有这样的事件。 */
function pickstart() {
    // #ifdef MP-WEIXIN
    moving.value = true;
    // #endif
}
/** 标识滑动结束。 */
function pickend() {
    // #ifdef MP-WEIXIN
    moving.value = false;
    // #endif
}

function init() {
    setColumnNum();
    setDefaultSelector();
    setColumnData();
    selectValue.value = [];
    setSelectValue();
}

/** 获取默认选中列下标。 */
function setDefaultSelector() {
    let useDefault: number[] | null = null;
    if (props.preserveSelection) {
        useDefault = savedSelector.value && savedSelector.value.length ? savedSelector.value : props.defaultValue;
    } else {
        useDefault = props.defaultValue && props.defaultValue.length ? props.defaultValue : savedSelector.value;
    }
    defaultSelector.value =
        useDefault && useDefault.length === columnNum.value ? useDefault.slice() : Array(columnNum.value).fill(0);
    lastSelectIndex.value = [...defaultSelector.value];
}

/** 计算列数。 */
function setColumnNum() {
    if (props.mode === 'single-column') columnNum.value = 1;
    else if (props.mode === 'mutil-column') columnNum.value = props.list.length;
    else if (props.mode === 'mutil-column-auto') {
        let num = 1;
        let column: SelectItem[] | unknown = props.list;
        // 只要有元素并且第一个元素有 children 属性，继续遍历
        while (Array.isArray(column) && column[0] && typeof column[0] === 'object' && props.childName in column[0]) {
            column = (column[0] as SelectItem)[props.childName];
            num++;
        }
        columnNum.value = num;
    }
}

/** 获取需要展示在 picker 中的列数据。 */
function setColumnData() {
    const data: SelectItem[][] = [];
    selectValue.value = [];
    if (props.mode === 'mutil-column-auto') {
        let column: SelectItem[] | unknown = props.list[defaultSelector.value.length ? defaultSelector.value[0] : 0];
        for (let i = 0; i < columnNum.value; i++) {
            if (i === 0) {
                data[i] = is2DList(props.list) ? props.list[i] || [] : props.list;
                column = column && typeof column === 'object' ? (column as SelectItem)[props.childName] : [];
            } else {
                data[i] = Array.isArray(column) ? column : [];
                column =
                    Array.isArray(column) &&
                    column[defaultSelector.value[i]] &&
                    typeof column[defaultSelector.value[i]] === 'object'
                        ? (column[defaultSelector.value[i]] as SelectItem)[props.childName]
                        : [];
            }
        }
    } else if (props.mode === 'single-column') {
        data[0] = Array.isArray(props.list) && !is2DList(props.list) ? props.list : [];
    } else if (props.mode === 'mutil-column') {
        if (is2DList(props.list)) data.push(...props.list);
        else data.push(props.list);
    }
    columnData.value = data;
}

/** 获取默认选中的值，没有设置 defaultValue 就默认选中每列的第一个。 */
function setSelectValue() {
    for (let i = 0; i < columnNum.value; i++) {
        const tmp = columnData.value[i][defaultSelector.value[i]];
        const result: SelectResult = {
            value: tmp ? tmp[props.valueName] : null,
            label: tmp ? tmp[props.labelName] : null
        };
        if (tmp && tmp.extra !== undefined) result.extra = tmp.extra;
        selectValue.value.push(result);
    }
}

/** 列变化处理。 */
function columnChange(event: { detail: { value: number[] } }) {
    let index = -1;
    const columnIndex = event.detail.value;
    selectValue.value = [];
    defaultSelector.value = columnIndex;
    if (props.mode === 'mutil-column-auto') {
        // 对比前后两个数组，寻找变更的是哪一列
        lastSelectIndex.value.map((val, idx) => {
            if (val !== columnIndex[idx]) index = idx;
        });
        for (let i = index + 1; i < columnNum.value; i++) {
            // 变化列的下一列数据取自上一列选中项的 children，后续列默认选中第一个
            const prevCol = columnData.value[i - 1];
            const prevIdx = i - 1 === index ? columnIndex[index] : 0;
            columnData.value[i] =
                Array.isArray(prevCol) && prevCol[prevIdx] && typeof prevCol[prevIdx] === 'object'
                    ? ((prevCol[prevIdx] as SelectItem)[props.childName] as SelectItem[])
                    : [];
            defaultSelector.value[i] = 0;
        }
        // 历遍过程中 columnData 连锁变化可能触发多次 columnChange，只有数据稳定后的结果才是正确的
        columnIndex.map((_item, idx) => {
            const data = columnData.value[idx][columnIndex[idx]];
            const result: SelectResult = {
                value: data ? data[props.valueName] : null,
                label: data ? data[props.labelName] : null
            };
            if (data && data.extra !== undefined) result.extra = data.extra;
            selectValue.value.push(result);
        });
        lastSelectIndex.value = [...columnIndex];
    } else if (props.mode === 'single-column') {
        const data = columnData.value[0][columnIndex[0]];
        const result: SelectResult = {
            value: data ? data[props.valueName] : null,
            label: data ? data[props.labelName] : null
        };
        if (data && data.extra !== undefined) result.extra = data.extra;
        selectValue.value.push(result);
    } else if (props.mode === 'mutil-column') {
        columnIndex.map((_item, idx) => {
            const data = columnData.value[idx][columnIndex[idx]];
            const result: SelectResult = {
                value: data ? data[props.valueName] : null,
                label: data ? data[props.labelName] : null
            };
            if (data && data.extra !== undefined) result.extra = data.extra;
            selectValue.value.push(result);
        });
    }
}

/** 关闭选择器。 */
function closeSelect() {
    emit('update:modelValue', false);
}

/** 点击遮罩关闭时发出 close 事件，供外部感知非确认/取消的关闭路径。 */
function overlayClick() {
    if (props.maskCloseAble) emit('close');
}

/** 点击确定或取消。 */
function getResult(event: 'confirm' | 'cancel') {
    // #ifdef MP-WEIXIN
    if (moving.value) return;
    // #endif
    if (event === 'confirm') emit('confirm', selectValue.value);
    else emit('cancel', selectValue.value);
    // 用户确认后保存已确认的索引，作为下次打开时的默认值
    if (event === 'confirm') {
        savedSelector.value = defaultSelector.value ? defaultSelector.value.slice() : null;
    }
    closeSelect();
}

/** 类型守卫：是否为二维列表。 */
function is2DList(list: SelectItem[] | SelectItem[][]): list is SelectItem[][] {
    return Array.isArray(list) && list.length > 0 && Array.isArray(list[0]);
}
</script>

<template>
    <view class="snake-select" :class="customClass" :style="customStyle">
        <snake-popup
            v-model="popupValue"
            mode="bottom"
            :close-on-click-overlay="maskCloseAble"
            :safe-area-inset-bottom="safeAreaInsetBottom"
            :z-index="popupZIndex"
            @click-overlay="overlayClick"
        >
            <view class="snake-select__panel">
                <view class="snake-select__header" @touchmove.stop.prevent="">
                    <view
                        class="snake-select__header__cancel snake-select__header__btn"
                        :style="{ color: cancelColor }"
                        hover-class="snake-select__btn--hover"
                        :hover-stay-time="150"
                        @click="getResult('cancel')"
                    >
                        {{ cancelTextValue }}
                    </view>
                    <view class="snake-select__header__title snake-select__ellipsis">{{ title }}</view>
                    <view
                        class="snake-select__header__confirm snake-select__header__btn"
                        :style="{ color: moving ? cancelColor : confirmColor }"
                        hover-class="snake-select__btn--hover"
                        :hover-stay-time="150"
                        @touchmove.stop=""
                        @click.stop="getResult('confirm')"
                    >
                        {{ confirmTextValue }}
                    </view>
                </view>
                <view class="snake-select__body">
                    <picker-view
                        v-if="modelValue && readyToRender"
                        :value="defaultSelector"
                        class="snake-select__body__picker-view"
                        mask-class="snake-select__mask"
                        indicator-class="snake-select__indicator"
                        @pickstart="pickstart"
                        @pickend="pickend"
                        @change="columnChange"
                    >
                        <picker-view-column v-for="(item, index) in columnData" :key="index">
                            <view
                                v-for="(item1, index1) in item"
                                :key="index1"
                                class="snake-select__body__picker-view__item"
                            >
                                <view class="snake-select__ellipsis">{{ item1[labelName] }}</view>
                            </view>
                        </picker-view-column>
                    </picker-view>
                </view>
            </view>
        </snake-popup>
    </view>
</template>

<style scoped>
.snake-select__panel {
    width: 100%;
}
.snake-select__header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80rpx;
}
.snake-select__header::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    border-bottom: 1rpx solid var(--snake-color-border, #e4e7ed);
    transform: scaleY(0.5);
}
.snake-select__header__title {
    color: var(--snake-color-text-secondary, #606266);
}
.snake-select__header__btn {
    min-width: 150rpx;
    padding: 20rpx 30rpx;
}
.snake-select__btn--hover {
    opacity: 0.6;
}
.snake-select__body {
    overflow: hidden;
    width: 100%;
    height: 500rpx;
    background-color: var(--snake-color-surface, #fff);
}
.snake-select__body__picker-view {
    box-sizing: border-box;
    height: 100%;
}
.snake-select__body__picker-view__item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8rpx;
    font-size: 32rpx;
    color: var(--snake-color-text, #303133);
}
.snake-select__ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>

<style>
/* picker-view 原生内部节点只能通过全局类名设置样式 */
.snake-select__mask {
    background-image:
        linear-gradient(
            180deg,
            rgba(var(--snake-color-surface-rgb, 255, 255, 255), 0.95),
            rgba(var(--snake-color-surface-rgb, 255, 255, 255), 0.6)
        ),
        linear-gradient(
            0deg,
            rgba(var(--snake-color-surface-rgb, 255, 255, 255), 0.95),
            rgba(var(--snake-color-surface-rgb, 255, 255, 255), 0.6)
        );
}
.snake-select__indicator {
    border: rgba(var(--snake-color-surface-rgb, 255, 255, 255), 0.6);
}
</style>
