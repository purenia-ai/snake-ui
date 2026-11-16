<template>
    <view class="snake-picker" :class="rootClass" :style="customStyle" :aria-disabled="isDisabled ? 'true' : 'false'">
        <snake-popup
            v-model="popupValue"
            mode="bottom"
            :round="round"
            :close-on-click-overlay="maskCloseAble && !confirming"
            :safe-area-inset-bottom="safeAreaInsetBottom"
            :root-portal="rootPortal"
            :z-index="popupZIndex"
            @click-overlay="overlayClick"
        >
            <view class="snake-picker__panel">
                <view
                    class="snake-picker__header"
                    :class="{ 'snake-picker__header--bordered': border }"
                    @touchmove.stop.prevent=""
                >
                    <view
                        class="snake-picker__header__btn snake-picker__header__cancel"
                        role="button"
                        tabindex="0"
                        :aria-label="cancelTextValue"
                        :style="{ color: cancelColor }"
                        hover-class="snake-picker__btn--hover"
                        :hover-stay-time="150"
                        @click="handleCancel"
                        @keydown.enter.prevent="handleCancel"
                    >
                        {{ cancelTextValue }}
                    </view>
                    <view class="snake-picker__header__title snake-picker__ellipsis">{{ title }}</view>
                    <view
                        class="snake-picker__header__btn snake-picker__header__confirm"
                        :class="{ 'snake-picker__header__btn--pending': confirming }"
                        role="button"
                        tabindex="0"
                        :aria-label="confirmTextValue"
                        :aria-busy="confirming ? 'true' : 'false'"
                        :style="{ color: confirmTint }"
                        hover-class="snake-picker__btn--hover"
                        :hover-stay-time="150"
                        @touchmove.stop=""
                        @click.stop="handleConfirm"
                        @keydown.enter.prevent="handleConfirm"
                    >
                        {{ confirmTextValue }}
                    </view>
                </view>
                <view class="snake-picker__body" :style="bodyStyle">
                    <!-- 选中框底色画在自己的节点上：原生 indicator 的不透明底色会盖住文字，
                         靠 z-index 把它压下去在小程序端不可移植 -->
                    <view
                        v-if="readyToRender && hasColumns"
                        class="snake-picker__roller"
                        :style="rollerStyle"
                        aria-hidden="true"
                    ></view>
                    <picker-view
                        v-if="readyToRender && hasColumns"
                        :value="defaultSelector"
                        class="snake-picker__body__picker-view"
                        :indicator-style="indicatorStyle"
                        :immediate-change="immediateChange"
                        mask-class="snake-picker__mask"
                        indicator-class="snake-picker__indicator"
                        @pickstart="pickstart"
                        @pickend="pickend"
                        @change="columnChange"
                    >
                        <picker-view-column v-for="(item, index) in columnData" :key="index">
                            <view
                                v-for="(item1, index1) in item"
                                :key="index1"
                                class="snake-picker__body__picker-view__item"
                                :class="{
                                    'snake-picker__body__picker-view__item--active': isActiveItem(index, index1)
                                }"
                            >
                                <view class="snake-picker__ellipsis">{{ item1[labelName] }}</view>
                            </view>
                        </picker-view-column>
                    </picker-view>
                    <view v-else class="snake-picker__empty">{{ emptyTextValue }}</view>
                </view>
            </view>
        </snake-popup>
    </view>
</template>

<script setup lang="ts">
/**
 * @component Picker
 * @description 列选择器，用于单列、多列、多列联动的选择场景，基于原生 picker-view 与 Popup 实现。
 * @see /components/picker
 */

import { computed, inject, ref, watch } from 'vue';
import zIndex from '../../libs/config/zIndex';
import { useLocale } from '../../libs/hooks/useLocale';
import { formItemKey } from '../snake-form-item/types';
import {
    DEFAULT_PICKER_ITEM_HEIGHT,
    DEFAULT_PICKER_VISIBLE_ITEM_COUNT,
    MAX_PICKER_COLUMN_COUNT,
    pickerProps,
    type PickerBeforeConfirm,
    type PickerEmits,
    type PickerExpose,
    type PickerItem,
    type PickerResult
} from './types';

defineOptions({ name: 'SnakePicker', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = defineProps(pickerProps);
const emit = defineEmits<PickerEmits>();
const { t } = useLocale('picker');
// 与 FormItem 配对：跟随表单级禁用，确认后触发 change 校验
const formItem = inject(formItemKey, null);

/** 每列当前选中的下标，同时作为 picker-view 的 value。 */
const defaultSelector = ref<number[]>([0]);
/** picker-view 的列数据。 */
const columnData = ref<PickerItem[][]>([]);
/** 控制 picker 是否渲染：关闭后销毁原生 picker-view，下次打开重新创建以刷新数据。 */
const readyToRender = ref(false);
/** 用户上次确认的索引，首次打开使用 defaultValue。 */
const savedSelector = ref<number[] | null>(
    props.defaultValue && props.defaultValue.length ? [...props.defaultValue] : null
);
/** 每次列变化后保存的选择结果。 */
const selectValue = ref<PickerResult[]>([]);
/** 上一次列变化时的下标，用于联动模式定位变化的列。 */
const lastSelectIndex = ref<number[]>([]);
/** 列数。 */
const columnNum = ref(0);
/** 列是否还在滑动中：微信小程序滑动中点确定会拿到未落定的索引。 */
const moving = ref(false);
/** 确认拦截器是否在等待中。 */
const confirming = ref(false);
/** 滑动中触发确认时先挂起，等 pickend 再确认。 */
let pendingConfirm = false;
/** 确认请求令牌：拦截器返回时若令牌已变（取消/重新确认），丢弃本次结果。 */
let confirmToken = 0;

const popupZIndex = computed(() => Number(props.zIndex) || zIndex.popup);
/** 禁用态：自身 disabled，或 FormItem/Form 下发的 disabled。 */
const isDisabled = computed(() => props.disabled || formItem?.disabled.value || false);
const rootClass = computed(() => [props.customClass, { 'is-disabled': isDisabled.value }]);

const popupValue = computed({
    get: () => props.modelValue,
    set: (val: boolean) => emit('update:modelValue', val)
});

const cancelTextValue = computed(() => props.cancelText || t('cancelText'));
const confirmTextValue = computed(() => props.confirmText || t('confirmText'));
const emptyTextValue = computed(() => props.emptyText || t('emptyText'));

/** 行高与可见行数做兜底，避免非法值算出 0 高度的滚轮。 */
const itemHeight = computed(() => {
    const value = Number(props.itemHeight);
    return Number.isFinite(value) && value > 0 ? value : DEFAULT_PICKER_ITEM_HEIGHT;
});
const visibleItemCount = computed(() => {
    const value = Math.round(Number(props.visibleItemCount));
    return Number.isFinite(value) && value >= 1 ? value : DEFAULT_PICKER_VISIBLE_ITEM_COUNT;
});
const bodyStyle = computed(() => ({ height: `${itemHeight.value * visibleItemCount.value}px` }));
/** 选中框底色节点的高度，与滚轮每行高度保持一致。 */
const rollerStyle = computed(() => ({ height: `${itemHeight.value}px` }));
/** indicator 的高度决定滚轮每行的高度（H5 以 --picker-view-column-indicator-height 生效）。 */
const indicatorStyle = computed(() => `height: ${itemHeight.value}px;`);
/** 滑动中或等待拦截器时，确认按钮调成次要色，给出「暂时不可用」的反馈。 */
const confirmTint = computed(() => (moving.value || confirming.value ? props.cancelColor : props.confirmColor));
/** 有列数据才渲染滚轮，否则展示空态。 */
const hasColumns = computed(() => columnData.value.some(column => Array.isArray(column) && column.length > 0));

watch(
    () => props.modelValue,
    (val, oldVal) => {
        if (val) {
            if (isDisabled.value) {
                // 禁用态不允许被外部打开
                emit('update:modelValue', false);
                return;
            }
            // 同步调用 init()，确保 columnData 在 picker-view 渲染前就填充完毕
            init();
            readyToRender.value = true;
            if (oldVal !== undefined) emit('open');
        } else {
            readyToRender.value = false;
            pendingConfirm = false;
        }
    },
    { immediate: true }
);

// 数据在打开状态下变化时重新初始化，避免滚轮停留在旧列数据上
watch(
    () => [props.list, props.mode, props.valueName, props.labelName, props.childName],
    () => {
        if (!props.modelValue || isDisabled.value) return;
        init();
    }
);

/** 判断某列某行是否为当前选中行：选中行加粗，让滚轮有明确的落点。 */
function isActiveItem(columnIndex: number, rowIndex: number): boolean {
    return defaultSelector.value[columnIndex] === rowIndex;
}

/** 标识滑动开始，只有微信小程序才有这样的事件。 */
function pickstart() {
    // #ifdef MP-WEIXIN
    moving.value = true;
    // #endif
}

/** 标识滑动结束，滑动中触发的确认在这里补发。 */
function pickend() {
    // #ifdef MP-WEIXIN
    moving.value = false;
    // #endif
    if (!pendingConfirm) return;
    pendingConfirm = false;
    void handleConfirm();
}

/** 初始化列数、选中下标与列数据。 */
function init() {
    setColumnNum();
    setDefaultSelector();
    setColumnData();
    selectValue.value = collectResults(defaultSelector.value);
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
        useDefault && useDefault.length === columnNum.value ? [...useDefault] : Array(columnNum.value).fill(0);
    lastSelectIndex.value = [...defaultSelector.value];
}

/** 计算列数。联动模式按 children 逐层下钻，限制最大层数避免循环数据死循环。 */
function setColumnNum() {
    if (props.mode === 'single-column') {
        columnNum.value = 1;
        return;
    }
    if (props.mode === 'mutil-column') {
        // 一维数组会被当成「只有一列」，否则列数会按条目数虚增并越界取值
        columnNum.value = is2DList(props.list) ? props.list.length : 1;
        return;
    }
    let num = 1;
    let column: unknown = props.list;
    while (
        num < MAX_PICKER_COLUMN_COUNT &&
        Array.isArray(column) &&
        column[0] &&
        typeof column[0] === 'object' &&
        props.childName in (column[0] as PickerItem)
    ) {
        column = (column[0] as PickerItem)[props.childName];
        num++;
    }
    columnNum.value = num;
}

/** 获取需要展示在 picker 中的列数据。 */
function setColumnData() {
    const data: PickerItem[][] = [];
    if (props.mode === 'mutil-column-auto') {
        const root: PickerItem[] = is2DList(props.list) ? props.list[0] || [] : (props.list as PickerItem[]);
        let cursor: unknown = root[defaultSelector.value[0] ?? 0];
        for (let i = 0; i < columnNum.value; i++) {
            if (i === 0) {
                data[0] = root;
                cursor =
                    cursor && typeof cursor === 'object' ? ((cursor as PickerItem)[props.childName] as unknown) : [];
            } else {
                const column: PickerItem[] = Array.isArray(cursor) ? (cursor as PickerItem[]) : [];
                data[i] = column;
                const next = column[defaultSelector.value[i]];
                cursor = next && typeof next === 'object' ? ((next as PickerItem)[props.childName] as unknown) : [];
            }
        }
    } else if (props.mode === 'single-column') {
        data[0] = is2DList(props.list) ? [] : (props.list as PickerItem[]);
    } else {
        if (is2DList(props.list)) data.push(...props.list);
        else data.push(props.list as PickerItem[]);
    }
    columnData.value = data;
}

/** 按列下标收集选择结果，缺列按空值处理。 */
function collectResults(indexes: number[]): PickerResult[] {
    return Array.from({ length: columnNum.value }, (_item, index) => toResult(columnData.value[index], indexes[index]));
}

/** 取某一列某个下标的结果。 */
function toResult(column: PickerItem[] | undefined, index: number): PickerResult {
    const item = Array.isArray(column) ? column[index] : undefined;
    const result: PickerResult = {
        value: item ? item[props.valueName] : null,
        label: item ? item[props.labelName] : null
    };
    if (item && item.extra !== undefined) result.extra = item.extra;
    return result;
}

/** 找出联动模式下变化的列，返回最早变化的列下标。 */
function findChangedColumn(indexes: number[]): number {
    for (let i = 0; i < indexes.length; i++) {
        if (lastSelectIndex.value[i] !== indexes[i]) return i;
    }
    return -1;
}

/** 从变化列开始重建后续列，并把后续列重置到第一项。 */
function refreshCascadeColumns(from: number, indexes: number[]) {
    for (let i = from + 1; i < columnNum.value; i++) {
        const prevColumn = columnData.value[i - 1];
        const prevIndex = i - 1 === from ? indexes[from] : 0;
        const prevItem = Array.isArray(prevColumn) ? prevColumn[prevIndex] : undefined;
        columnData.value[i] =
            prevItem && typeof prevItem === 'object' ? ((prevItem[props.childName] as PickerItem[]) ?? []) : [];
        defaultSelector.value[i] = 0;
    }
}

/** 列变化处理。 */
function columnChange(event: { detail: { value: number[] } }) {
    const indexes = Array.isArray(event?.detail?.value) ? [...event.detail.value] : [];
    defaultSelector.value = indexes;
    if (props.mode === 'mutil-column-auto') {
        const changed = findChangedColumn(indexes);
        if (changed >= 0) refreshCascadeColumns(changed, indexes);
        selectValue.value = collectResults(defaultSelector.value);
        lastSelectIndex.value = [...defaultSelector.value];
    } else {
        selectValue.value = collectResults(indexes);
    }
    emit('change', selectValue.value.slice());
}

/** 关闭选择器。 */
function closeSelect() {
    emit('update:modelValue', false);
}

/** 点击遮罩关闭时发出 close 事件，供外部感知非确认/取消的关闭路径。 */
function overlayClick() {
    if (props.maskCloseAble && !confirming.value) emit('close');
}

/** 作废进行中的确认。 */
function invalidateConfirm() {
    confirmToken += 1;
    confirming.value = false;
    pendingConfirm = false;
}

/** 点击取消。 */
function handleCancel() {
    invalidateConfirm();
    emit('cancel', selectValue.value.slice());
    closeSelect();
}

/** 确认完成：派发结果、记住下标、关闭并触发 FormItem 校验。 */
function finishConfirm(value: PickerResult[]) {
    emit('confirm', value);
    savedSelector.value = defaultSelector.value ? [...defaultSelector.value] : null;
    closeSelect();
    void formItem?.notify('change');
}

/** 点击确认。滑动中先挂起；配置了拦截器时等待其明确放行。 */
async function handleConfirm() {
    if (confirming.value) return;
    if (moving.value) {
        pendingConfirm = true;
        return;
    }
    pendingConfirm = false;
    const value = selectValue.value.slice();
    const hook: PickerBeforeConfirm | undefined = props.beforeConfirm;
    if (!hook) {
        finishConfirm(value);
        return;
    }
    const token = (confirmToken += 1);
    confirming.value = true;
    let allowed = false;
    try {
        // 必须明确放行：同步返回 true、异步 resolve(true)；抛错按不通过处理，保持弹层打开
        allowed = (await hook(value)) === true;
    } catch {
        allowed = false;
    }
    if (token !== confirmToken) return;
    confirming.value = false;
    if (!allowed) return;
    finishConfirm(value);
}

/** 打开选择器，需要绑定 v-model 才能生效。 */
function open() {
    if (isDisabled.value || props.modelValue) return;
    emit('update:modelValue', true);
}

/** 关闭选择器。 */
function close() {
    invalidateConfirm();
    closeSelect();
}

/** 类型守卫：是否为二维列表。 */
function is2DList(list: PickerItem[] | PickerItem[][]): list is PickerItem[][] {
    return Array.isArray(list) && list.length > 0 && Array.isArray(list[0]);
}

defineExpose<PickerExpose>({ open, close });
</script>

<style scoped>
/* 圆角由 popup 的 round 决定：popup 面板带 overflow，子节点会被裁到圆角内，
   这里再用 overflow: hidden 保证滚轮与工具栏不越出面板 */
.snake-picker__panel {
    overflow: hidden;
    width: 100%;
    background-color: var(--snake-picker-panel-bg, var(--snake-color-surface, #fff));
}
.snake-picker__header {
    position: relative;
    display: flex;
    align-items: center;
    height: var(--snake-picker-toolbar-height, 44px);
}
.snake-picker__header--bordered::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    border-bottom: 1px solid var(--snake-picker-divider-color, var(--snake-color-divider, #e4e7ed));
    transform: scaleY(0.5);
}
.snake-picker__header__title {
    flex: 1;
    min-width: 0;
    padding: 0 8px;
    font-size: var(--snake-picker-title-font-size, 15px);
    font-weight: var(--snake-picker-title-font-weight, 600);
    color: var(--snake-picker-title-color, var(--snake-color-text, #303133));
    text-align: center;
}
/* 按钮靠内边距撑宽并垂直居中：min-width 会把两侧按钮一起撑大，标题只剩很窄的一段 */
.snake-picker__header__btn {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 var(--snake-picker-toolbar-padding-x, 16px);
    font-size: var(--snake-picker-toolbar-font-size, 16px);
    white-space: nowrap;
}
.snake-picker__header__btn--pending {
    opacity: var(--snake-picker-pending-opacity, 0.6);
}
.snake-picker__btn--hover {
    opacity: 0.6;
}
.snake-picker__body {
    position: relative;
    overflow: hidden;
    width: 100%;
    background-color: var(--snake-picker-body-bg, var(--snake-color-surface, #fff));
}
/* 选中框底色：居中一条与行高等高的浅色色带，左右内缩、圆角收边，
   压在选择器之下（picker-view 提到 z-index: 1），不遮挡也不切割选中项文字 */
.snake-picker__roller {
    position: absolute;
    top: 50%;
    right: var(--snake-picker-roller-inset-x, 12px);
    left: var(--snake-picker-roller-inset-x, 12px);
    background-color: var(--snake-picker-roller-bg, var(--snake-color-background, #f6f6f6));
    border-radius: var(--snake-picker-roller-radius, 6px);
    transform: translateY(-50%);
    pointer-events: none;
}
.snake-picker__body__picker-view {
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    height: 100%;
}
.snake-picker__body__picker-view__item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 var(--snake-picker-item-padding-x, 12px);
    font-size: var(--snake-picker-item-font-size, 16px);
    color: var(--snake-picker-item-color, var(--snake-color-text, #303133));
    transition: color var(--snake-duration-fast, 180ms) var(--snake-easing-standard, ease);
}
/* 选中行：字重加粗 + 可单独配色，与指示框底色一起构成「选中」视觉 */
.snake-picker__body__picker-view__item--active {
    color: var(--snake-picker-item-active-color, var(--snake-color-text, #303133));
    font-weight: var(--snake-picker-item-active-font-weight, 600);
}
.snake-picker__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 16px;
    font-size: var(--snake-picker-empty-font-size, 14px);
    color: var(--snake-picker-empty-color, var(--snake-color-text-muted, #909399));
}
.snake-picker__ellipsis {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>

<style>
/* picker-view 的内部节点由原生组件渲染，只能通过全局类名设置样式 */
.snake-picker__mask {
    /* 只用「表面色 → 透明」的渐变：颜色跟着主题走，暗色模式不会留白雾；
       uni 用 background-size 把这两层分别裁到选择框上方与下方的区域，
       靠近选择框的一端透明，所以相邻选项仍然读得清 */
    background-image:
        linear-gradient(180deg, var(--snake-picker-mask-color, var(--snake-color-surface, #fff)), transparent),
        linear-gradient(0deg, var(--snake-picker-mask-color, var(--snake-color-surface, #fff)), transparent) !important;
}
.snake-picker__indicator {
    /* 选中框只是选中的底色 + 字重，回到底色的色带已经收边，默认不再叠 hairline */
    background-color: transparent !important;
}
/* 需要 iOS 那种「只有两条线」的样式时，给 --snake-picker-indicator-border-color 一个颜色即可 */
.snake-picker__indicator::before {
    border-top: 1px solid var(--snake-picker-indicator-border-color, transparent) !important;
}
.snake-picker__indicator::after {
    border-bottom: 1px solid var(--snake-picker-indicator-border-color, transparent) !important;
}
</style>
