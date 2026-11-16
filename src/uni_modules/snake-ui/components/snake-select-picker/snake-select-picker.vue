<template>
    <view
        class="snake-select-picker"
        :class="rootClass"
        :style="customStyle"
        :aria-disabled="isDisabled ? 'true' : 'false'"
    >
        <snake-popup
            v-model="popupValue"
            mode="bottom"
            :round="round"
            :close-on-click-overlay="closeOnClickOverlay"
            :safe-area-inset-bottom="safeAreaInsetBottom"
            :root-portal="rootPortal"
            :z-index="popupZIndex"
            @opened="onOpened"
            @closed="onClosed"
        >
            <view class="snake-select-picker__panel">
                <view class="snake-select-picker__header">
                    <view class="snake-select-picker__title">{{ titleValue }}</view>
                    <view
                        class="snake-select-picker__close"
                        role="button"
                        tabindex="0"
                        :aria-label="closeTextValue"
                        hover-class="snake-select-picker__close--hover"
                        :hover-stay-time="120"
                        @click="handleCancel"
                        @keydown.enter.prevent="handleCancel"
                    >
                        <snake-icon
                            name="close"
                            :size="16"
                            color="var(--snake-select-picker-close-color, var(--snake-color-text-muted, #909399))"
                        />
                    </view>
                </view>
                <view v-if="filterable" class="snake-select-picker__search">
                    <snake-search
                        v-model="keyword"
                        :placeholder="filterPlaceholderValue"
                        :show-action="false"
                        margin="0"
                    />
                </view>
                <view class="snake-select-picker__body">
                    <scroll-view
                        class="snake-select-picker__scroll"
                        scroll-y
                        :style="bodyStyle"
                        :scroll-into-view="scrollIntoViewId"
                        :scroll-with-animation="true"
                    >
                        <view
                            v-for="(item, index) in displayList"
                            :id="itemId(index)"
                            :key="itemId(index)"
                            class="snake-select-picker__item"
                            :class="{
                                'snake-select-picker__item--checked': isChecked(item),
                                'snake-select-picker__item--disabled': isRowDisabled(item)
                            }"
                            :role="multiple ? 'checkbox' : 'radio'"
                            :aria-checked="isChecked(item) ? 'true' : 'false'"
                            :aria-disabled="isRowDisabled(item) ? 'true' : 'false'"
                            hover-class="snake-select-picker__item--hover"
                            :hover-stay-time="80"
                            @tap="toggleItem(item)"
                        >
                            <view class="snake-select-picker__label">
                                <text
                                    v-for="(segment, segmentIndex) in highlightSegments(item)"
                                    :key="segmentIndex"
                                    :class="{ 'snake-select-picker__label--hit': segment.hit }"
                                    >{{ segment.text }}</text
                                >
                            </view>
                            <view
                                class="snake-select-picker__indicator"
                                :class="[
                                    multiple
                                        ? 'snake-select-picker__indicator--square'
                                        : 'snake-select-picker__indicator--circle',
                                    {
                                        'snake-select-picker__indicator--checked': isChecked(item),
                                        'snake-select-picker__indicator--disabled': isRowDisabled(item)
                                    }
                                ]"
                            >
                                <snake-icon
                                    v-if="isChecked(item) && multiple"
                                    name="checkmark"
                                    :size="10"
                                    color="var(--snake-select-picker-indicator-color, #ffffff)"
                                />
                                <view v-else-if="isChecked(item)" class="snake-select-picker__dot"></view>
                            </view>
                        </view>
                        <view v-if="!displayList.length && !loading" class="snake-select-picker__empty">
                            {{ emptyTextValue }}
                        </view>
                    </scroll-view>
                    <view v-if="loading" class="snake-select-picker__loading">
                        <snake-loading size="24" />
                    </view>
                </view>
                <view v-if="showConfirmResolved" class="snake-select-picker__footer">
                    <view v-if="minTipVisible" class="snake-select-picker__tip">{{ minTextValue }}</view>
                    <snake-button
                        type="primary"
                        block
                        :loading="confirming"
                        :disabled="!canConfirm"
                        @click="handleConfirm"
                    >
                        {{ confirmTextValue }}
                    </snake-button>
                </view>
            </view>
        </snake-popup>
    </view>
</template>

<script setup lang="ts">
/**
 * @component SelectPicker
 * @description 单复选选择器，底部弹层内以列表勾选，配确认栏与本地搜索，支持最少/最多选择数与异步确认。
 * @see /components/select-picker
 */

import { computed, inject, nextTick, ref, watch } from 'vue';
import zIndex from '../../libs/config/zIndex';
import { addUnit } from '../../libs/function/unit';
import { useLocale } from '../../libs/hooks/useLocale';
import { formItemKey } from '../snake-form-item/types';
import {
    DEFAULT_SELECT_PICKER_MAX_HEIGHT,
    selectPickerProps,
    type SelectPickerBeforeConfirm,
    type SelectPickerEmits,
    type SelectPickerExpose,
    type SelectPickerItem,
    type SelectPickerPrimitive,
    type SelectPickerValue
} from './types';

defineOptions({ name: 'SnakeSelectPicker', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = defineProps(selectPickerProps);
const emit = defineEmits<SelectPickerEmits>();
const { t } = useLocale('selectPicker');
// 与 FormItem 配对：跟随表单级禁用，确认后触发 change 校验
const formItem = inject(formItemKey, null);

/** 搜索关键字。 */
const keyword = ref('');
/** 弹层内的草稿选中值，只有确认时才写回 v-model。 */
const draft = ref<SelectPickerPrimitive[]>([]);
/** 确认拦截器是否在等待中。 */
const confirming = ref(false);
/** scroll-view 的目标行 id，用于打开时定位到首个已选项。 */
const scrollIntoViewId = ref('');
/** 确认请求令牌：拦截器返回时若令牌已变（取消/重新确认），丢弃本次结果。 */
let confirmToken = 0;

const popupZIndex = computed(() => Number(props.zIndex) || zIndex.popup);
/** 禁用态：自身 disabled，或 FormItem/Form 下发的 disabled。 */
const isDisabled = computed(() => props.disabled || formItem?.disabled.value || false);
const rootClass = computed(() => [props.customClass, { 'is-disabled': isDisabled.value }]);

const popupValue = computed({
    get: () => props.visible,
    set: (val: boolean) => emit('update:visible', val)
});

const titleValue = computed(() => props.title || t('title'));
const confirmTextValue = computed(() => props.confirmText || t('confirmText'));
const closeTextValue = computed(() => t('closeText'));
const filterPlaceholderValue = computed(() => props.filterPlaceholder || t('filterPlaceholder'));
/** 关键字为空时用空数据文案，有值但过滤后为空时用无匹配文案。 */
const emptyTextValue = computed(() =>
    keyword.value.trim() ? props.noMatchText || t('noMatchText') : props.emptyText || t('emptyText')
);
const minTextValue = computed(() =>
    props.minText ? props.minText.replace('{n}', String(props.min)) : t('minText', { n: props.min })
);
/** 单选默认「点选即提交」，多选默认常显确认栏。 */
const showConfirmResolved = computed(() => props.showConfirm ?? !props.multiple);

/** 列表区高度做兜底，避免非法值算出 0 高度的列表。 */
const maxHeightValue = computed(() => {
    const value = Number(props.maxHeight);
    return Number.isFinite(value) && value > 0 ? value : DEFAULT_SELECT_PICKER_MAX_HEIGHT;
});
const bodyStyle = computed(() => ({ maxHeight: addUnit(maxHeightValue.value) }));

/** 已选数量是否达到上限（仅多选生效）。 */
const maxReached = computed(() => props.multiple && Number(props.max) > 0 && draft.value.length >= Number(props.max));
/** 是否满足最小选择数，决定确认按钮可用性。 */
const canConfirm = computed(() => !props.loading && (!props.multiple || draft.value.length >= Number(props.min)));
/** 未达最小选择数时展示提示行。 */
const minTipVisible = computed(() => props.multiple && Number(props.min) > 0 && draft.value.length < Number(props.min));

/** 过滤后的展示列表：按 label 做大小写不敏感的包含匹配。 */
const displayList = computed<SelectPickerItem[]>(() => {
    const kw = keyword.value.trim().toLowerCase();
    if (!kw) return props.list;
    return props.list.filter(item =>
        String(item[props.labelName] ?? '')
            .toLowerCase()
            .includes(kw)
    );
});

/** 取选项的值。 */
function valueOf(item: SelectPickerItem): SelectPickerPrimitive {
    return item[props.valueName] as SelectPickerPrimitive;
}

/** 选项是否已选中。 */
function isChecked(item: SelectPickerItem): boolean {
    return draft.value.includes(valueOf(item));
}

/** 选项自身是否禁用。 */
function isItemDisabled(item: SelectPickerItem): boolean {
    return Boolean(item[props.disabledName]);
}

/** 行是否不可点击：加载中、选项禁用，或已达上限且当前未选中。 */
function isRowDisabled(item: SelectPickerItem): boolean {
    return props.loading || isItemDisabled(item) || (maxReached.value && !isChecked(item));
}

/** 行 id，打开时用于 scroll-into-view 定位。 */
function itemId(index: number): string {
    return `snake-select-picker-item-${index}`;
}

/** 把 label 按关键字切成「命中 / 未命中」片段，用于搜索高亮。 */
function highlightSegments(item: SelectPickerItem): Array<{ text: string; hit: boolean }> {
    const text = String(item[props.labelName] ?? '');
    const kw = keyword.value.trim().toLowerCase();
    if (!kw) return [{ text, hit: false }];
    const at = text.toLowerCase().indexOf(kw);
    if (at < 0) return [{ text, hit: false }];
    return [
        { text: text.slice(0, at), hit: false },
        { text: text.slice(at, at + kw.length), hit: true },
        { text: text.slice(at + kw.length), hit: false }
    ].filter(segment => segment.text.length > 0);
}

/** 把 v-model 归一化成数组：单选标量与多选数组都走同一套比较逻辑。 */
function normalizeValue(value: SelectPickerValue | undefined): SelectPickerPrimitive[] {
    if (Array.isArray(value)) return value.slice();
    if (value === undefined || value === null || value === '') return [];
    return [value];
}

/** 对外的选中值：多选为数组，单选为标量（未选为 `''`）。 */
function finalValue(): SelectPickerValue {
    return props.multiple ? draft.value.slice() : (draft.value[0] ?? '');
}

/** 已选中的选项对象，按 list 顺序返回。 */
function selectedItems(): SelectPickerItem[] {
    return props.list.filter(item => draft.value.includes(valueOf(item)));
}

/** 草稿变化时派发 change。 */
function emitChange() {
    if (props.multiple) emit('change', draft.value.slice(), selectedItems());
    else emit('change', finalValue(), selectedItems());
}

/** 提交：派发 update:modelValue / confirm、关闭弹层并触发 FormItem 校验。 */
function finish() {
    const value = finalValue();
    const items = selectedItems();
    emit('update:modelValue', value);
    emit('confirm', value, items);
    emit('update:visible', false);
    void formItem?.notify('change');
}

/** 确认：配置了拦截器时等待其明确放行，未通过则保持弹层打开。 */
async function submit() {
    if (confirming.value) return;
    if (props.multiple && draft.value.length < Number(props.min)) return;
    const hook: SelectPickerBeforeConfirm | undefined = props.beforeConfirm;
    if (!hook) {
        finish();
        return;
    }
    const token = (confirmToken += 1);
    confirming.value = true;
    let allowed = false;
    try {
        // 必须明确放行：同步返回 true、异步 resolve(true)；抛错按不通过处理
        allowed = (await hook(finalValue())) === true;
    } catch {
        allowed = false;
    }
    if (token !== confirmToken) return;
    confirming.value = false;
    if (!allowed) return;
    finish();
}

/** 点击确认按钮。 */
function handleConfirm() {
    if (!canConfirm.value) return;
    void submit();
}

/** 点选一行：单选直接替换，多选增删；达到上限时未选项不可点。 */
function toggleItem(item: SelectPickerItem) {
    if (isRowDisabled(item) || confirming.value) return;
    const value = valueOf(item);
    const checked = isChecked(item);
    if (!props.multiple) {
        draft.value = [value];
    } else if (checked) {
        draft.value = draft.value.filter(current => current !== value);
    } else {
        if (maxReached.value) return;
        draft.value = [...draft.value, value];
    }
    emitChange();
    // 单选且不显示确认栏时，点选即提交
    if (!props.multiple && !showConfirmResolved.value) void submit();
}

/** 关闭并丢弃草稿：v-model 保持不变。 */
function close() {
    confirmToken += 1;
    confirming.value = false;
    draft.value = [];
    keyword.value = '';
    scrollIntoViewId.value = '';
    emit('update:visible', false);
}

/** 点击关闭图标：等同取消。 */
function handleCancel() {
    close();
}

/** 打开动画完成后派发 open，并定位到首个已选项。 */
function onOpened() {
    emit('open');
    if (!props.scrollIntoView) return;
    const index = displayList.value.findIndex(item => isChecked(item));
    if (index < 0) return;
    void nextTick(() => {
        scrollIntoViewId.value = itemId(index);
    });
}

/** 弹层关闭后派发 close。 */
function onClosed() {
    emit('close');
}

watch(
    () => props.visible,
    visible => {
        if (visible) {
            if (isDisabled.value) {
                // 禁用态不允许被外部打开
                emit('update:visible', false);
                return;
            }
            draft.value = normalizeValue(props.modelValue);
            keyword.value = '';
            scrollIntoViewId.value = '';
            return;
        }
        confirmToken += 1;
        confirming.value = false;
        keyword.value = '';
        scrollIntoViewId.value = '';
    },
    { immediate: true }
);

// 表单在提交瞬间把整组字段置灰时，已经打开的弹层要跟着收起，避免停在不可操作的状态
watch(isDisabled, disabled => {
    if (disabled && props.visible) close();
});

/** 打开弹层，需要绑定 visible 才能生效。 */
function open() {
    if (isDisabled.value || props.visible) return;
    emit('update:visible', true);
}

defineExpose<SelectPickerExpose>({ open, close });
</script>

<style scoped>
/* 圆角由 popup 的 round 决定：popup 面板带 overflow，子节点会被裁到圆角内 */
.snake-select-picker__panel {
    overflow: hidden;
    width: 100%;
    background-color: var(--snake-select-picker-bg, var(--snake-color-surface, #fff));
}
.snake-select-picker__header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--snake-select-picker-header-height, 48px);
    padding: 0 var(--snake-select-picker-header-padding-x, 16px);
}
.snake-select-picker__header::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    border-bottom: 1px solid var(--snake-select-picker-divider-color, var(--snake-color-divider, #e4e7ed));
    transform: scaleY(0.5);
}
.snake-select-picker__title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    font-size: var(--snake-select-picker-title-font-size, 16px);
    font-weight: var(--snake-select-picker-title-font-weight, 600);
    color: var(--snake-select-picker-title-color, var(--snake-color-text, #303133));
    text-overflow: ellipsis;
    white-space: nowrap;
}
.snake-select-picker__close {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: var(--snake-select-picker-close-size, 24px);
    height: var(--snake-select-picker-close-size, 24px);
    margin-left: 8px;
}
.snake-select-picker__close--hover {
    opacity: 0.6;
}
.snake-select-picker__search {
    padding: var(--snake-select-picker-search-padding-y, 8px) var(--snake-select-picker-header-padding-x, 16px) 0;
}
.snake-select-picker__body {
    position: relative;
    width: 100%;
}
.snake-select-picker__scroll {
    box-sizing: border-box;
    width: 100%;
}
.snake-select-picker__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    min-height: var(--snake-select-picker-item-height, 44px);
    padding: var(--snake-select-picker-item-padding-y, 10px) var(--snake-select-picker-header-padding-x, 16px);
}
.snake-select-picker__item--hover {
    background-color: var(--snake-select-picker-item-hover-bg, var(--snake-color-surface-muted, #f1f1f1));
}
.snake-select-picker__label {
    flex: 1;
    min-width: 0;
    padding-right: 12px;
    font-size: var(--snake-select-picker-item-font-size, 14px);
    line-height: 20px;
    color: var(--snake-select-picker-item-color, var(--snake-color-text, #303133));
    word-break: break-word;
}
/* 搜索命中的片段单独提色，便于在长列表里确认过滤结果 */
.snake-select-picker__label--hit {
    color: var(--snake-select-picker-active-color, var(--snake-color-primary, #06d290));
    font-weight: 600;
}
.snake-select-picker__item--checked .snake-select-picker__label {
    color: var(--snake-select-picker-active-color, var(--snake-color-primary, #06d290));
}
.snake-select-picker__item--disabled .snake-select-picker__label {
    color: var(--snake-select-picker-disabled-color, var(--snake-color-text-muted, #909399));
}
.snake-select-picker__indicator {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: var(--snake-select-picker-indicator-size, 18px);
    height: var(--snake-select-picker-indicator-size, 18px);
    border: 1px solid var(--snake-select-picker-indicator-border-color, var(--snake-color-border, #dcdfe6));
    background-color: transparent;
    transition:
        background-color var(--snake-duration-fast, 180ms) var(--snake-easing-standard, ease),
        border-color var(--snake-duration-fast, 180ms) var(--snake-easing-standard, ease);
}
.snake-select-picker__indicator--square {
    border-radius: var(--snake-select-picker-indicator-radius, 4px);
}
.snake-select-picker__indicator--circle {
    border-radius: 50%;
}
.snake-select-picker__indicator--checked {
    border-color: var(--snake-select-picker-active-color, var(--snake-color-primary, #06d290));
    background-color: var(--snake-select-picker-active-color, var(--snake-color-primary, #06d290));
}
.snake-select-picker__indicator--disabled {
    border-color: var(--snake-select-picker-indicator-disabled-color, var(--snake-color-border, #dcdfe6));
    background-color: transparent;
}
.snake-select-picker__dot {
    width: var(--snake-select-picker-dot-size, 8px);
    height: var(--snake-select-picker-dot-size, 8px);
    border-radius: 50%;
    background-color: var(--snake-select-picker-indicator-color, #ffffff);
}
.snake-select-picker__empty {
    padding: var(--snake-select-picker-empty-padding-y, 32px) 16px;
    font-size: var(--snake-select-picker-empty-font-size, 14px);
    color: var(--snake-select-picker-empty-color, var(--snake-color-text-muted, #909399));
    text-align: center;
}
.snake-select-picker__loading {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--snake-select-picker-loading-mask, rgba(255, 255, 255, 0.72));
}
.snake-select-picker__footer {
    padding: var(--snake-select-picker-footer-padding-y, 8px) var(--snake-select-picker-header-padding-x, 16px);
}
.snake-select-picker__tip {
    padding-bottom: 8px;
    font-size: var(--snake-select-picker-tip-font-size, 12px);
    color: var(--snake-select-picker-tip-color, var(--snake-color-error, #fa3534));
    text-align: center;
}
</style>
