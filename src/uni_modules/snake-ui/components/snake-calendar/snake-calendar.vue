<template>
    <snake-popup
        v-model="popupValue"
        mode="bottom"
        :overlay="!isPage"
        :embedded="isPage"
        :close-on-click-overlay="maskCloseAble"
        :safe-area-inset-bottom="safeAreaInsetBottom"
        :z-index="layerZIndex"
        :round="borderRadius"
        :closeable="closeable"
        :custom-style="customStyle"
        @close="onPopupClose"
    >
        <view class="snake-calendar" :class="[customClass, { 'snake-calendar--page': isPage }]" :style="[customStyle]">
            <view v-if="!isPage" class="snake-calendar__header">
                <view v-if="!slots.tooltip" class="snake-calendar__header__text">{{ toolTipValue }}</view>
                <slot v-else name="tooltip" />
            </view>
            <view class="snake-calendar__action">
                <view class="snake-calendar__action__icon">
                    <snake-icon
                        v-if="changeYear"
                        name="arrow-left-double"
                        :color="yearArrowColor"
                        @click="changeYearHandler(0)"
                    />
                </view>
                <view class="snake-calendar__action__icon">
                    <snake-icon
                        v-if="changeMonth"
                        name="arrow-left"
                        :color="monthArrowColor"
                        @click="changeMonthHandler(0)"
                    />
                </view>
                <view class="snake-calendar__action__text">{{ showTitle }}</view>
                <view class="snake-calendar__action__icon">
                    <snake-icon
                        v-if="changeMonth"
                        name="arrow-right"
                        :color="monthArrowColor"
                        @click="changeMonthHandler(1)"
                    />
                </view>
                <view class="snake-calendar__action__icon">
                    <snake-icon
                        v-if="changeYear"
                        name="arrow-right-double"
                        :color="yearArrowColor"
                        @click="changeYearHandler(1)"
                    />
                </view>
            </view>
            <view class="snake-calendar__week-day">
                <view v-for="(item, index) in weekDayZh" :key="index" class="snake-calendar__week-day__text">
                    {{ item }}
                </view>
            </view>
            <view class="snake-calendar__content">
                <!-- 前置空白部分 -->
                <block v-for="(item, index) in weekdayArr" :key="index">
                    <view class="snake-calendar__content__item"></view>
                </block>
                <view
                    v-for="(item, index) in daysArr"
                    :key="index"
                    class="snake-calendar__content__item"
                    :class="{
                        'snake-calendar__content__item--hover': openDisAbled(year, month, index + 1),
                        'snake-calendar__content--start-date':
                            (mode === 'range' && startDate === `${year}-${formatNum(month)}-${formatNum(index + 1)}`) ||
                            mode === 'date',
                        'snake-calendar__content--end-date':
                            (mode === 'range' && endDate === `${year}-${formatNum(month)}-${formatNum(index + 1)}`) ||
                            mode === 'date',
                        'snake-calendar__content--checked': isCheckedDate(index + 1),
                        'snake-calendar__content--today-checked': isTodayChecked(index + 1),
                        'snake-calendar__content--checkin-mode': checkinMode
                    }"
                    :style="{
                        backgroundColor:
                            !checkinMode && checkedDates.length === 0 && !todayChecked ? getColor(index, 1) : ''
                    }"
                    @click="dateClick(index)"
                >
                    <view
                        class="snake-calendar__content__item__inner"
                        :class="{ 'snake-calendar__content__item__inner--today-checked': isTodayChecked(index + 1) }"
                        :style="{
                            color: getCheckinTextColor(index + 1) || getColor(index, 2),
                            backgroundColor: getCheckinColor(index + 1)
                        }"
                    >
                        <!-- 今日已打卡时显示对勾，否则显示日期 -->
                        <view v-if="isTodayChecked(index + 1)" class="snake-calendar__content__item__checkmark">
                            <snake-icon name="checkmark" size="36" :color="checkedColor" />
                        </view>
                        <template v-else>
                            <!-- 自定义日期内容插槽 - 优先级最高 -->
                            <template v-if="useDateSlot">
                                <view class="snake-calendar__content__item__day">{{ index + 1 }}</view>
                                <view
                                    class="snake-calendar__content__item__lunar"
                                    :style="{ color: getSlotColor(index + 1) }"
                                >
                                    <slot name="date" :date="getDateInfo(index + 1)" />
                                </view>
                            </template>
                            <template v-else>
                                <!-- 日期数字右上角标记：休/班 -->
                                <view
                                    v-if="isHoliday(index + 1)"
                                    class="snake-calendar__content__item__mark snake-calendar__content__item__mark--holiday"
                                    :style="{ color: getHolidayWorkdayColor(index + 1, holidayColor) }"
                                >
                                    {{ t('holiday') }}
                                </view>
                                <view
                                    v-else-if="isWorkday(index + 1)"
                                    class="snake-calendar__content__item__mark snake-calendar__content__item__mark--workday"
                                    :style="{ color: getHolidayWorkdayColor(index + 1, workdayColor) }"
                                >
                                    {{ t('workday') }}
                                </view>
                                <view class="snake-calendar__content__item__day">{{ index + 1 }}</view>
                                <!-- 范围选择开始日期显示"开始" -->
                                <view
                                    v-if="
                                        mode === 'range' &&
                                        startDate === `${year}-${formatNum(month)}-${formatNum(index + 1)}` &&
                                        startDate !== endDate
                                    "
                                    class="snake-calendar__content__item__lunar"
                                    :style="{ color: activeColor }"
                                >
                                    {{ startTextValue }}
                                </view>
                                <!-- 范围选择结束日期显示"结束" -->
                                <view
                                    v-else-if="
                                        mode === 'range' &&
                                        endDate === `${year}-${formatNum(month)}-${formatNum(index + 1)}`
                                    "
                                    class="snake-calendar__content__item__lunar"
                                    :style="{ color: activeColor }"
                                >
                                    {{ endTextValue }}
                                </view>
                                <!-- 节日名称 -->
                                <view
                                    v-else-if="getFestival(index + 1)"
                                    class="snake-calendar__content__item__lunar snake-calendar__content__item__festival"
                                    :style="{ color: getHolidayWorkdayColor(index + 1, festivalColor) }"
                                >
                                    {{ getFestival(index + 1) }}
                                </view>
                                <!-- 农历 -->
                                <view
                                    v-else-if="showLunar"
                                    class="snake-calendar__content__item__lunar"
                                    :style="{ color: getCheckinLunarColor(index + 1) || getColor(index, 2) }"
                                >
                                    {{
                                        lunarArr[index]?.dayCn === '初一'
                                            ? lunarArr[index].monthCn
                                            : (lunarArr[index]?.dayCn ?? '')
                                    }}
                                </view>
                                <!-- 占位元素：当有节日/农历数据时保持高度一致 -->
                                <view
                                    v-else-if="showFestival"
                                    class="snake-calendar__content__item__lunar snake-calendar__content__item__placeholder"
                                ></view>
                            </template>
                        </template>
                    </view>
                </view>
                <view class="snake-calendar__content__bg-month">{{ month }}</view>
            </view>
            <!-- 页面模式下不显示确定按钮，选择完成自动触发 change 事件 -->
            <view v-if="!isPage" class="snake-calendar__bottom">
                <view class="snake-calendar__bottom__choose">
                    <text>{{ mode === 'date' ? activeDate : startDate }}</text>
                    <text v-if="endDate">{{ t('to') }}{{ endDate }}</text>
                </view>
                <view class="snake-calendar__bottom__btn">
                    <snake-button
                        :type="btnType"
                        :disabled="btnDisable"
                        shape="circle"
                        size="default"
                        block
                        @click="btnFix(false)"
                    >
                        {{ t('confirmText') }}
                    </snake-button>
                </view>
            </view>
        </view>
    </snake-popup>
</template>

<script setup lang="ts">
/**
 * @component Calendar
 * @description 日历，用于单个日期或日期范围的选择，包裹在底部弹层中，支持农历、节日、打卡签到与自定义插槽。
 * @see /components/calendar
 */

import { computed, onMounted, ref, useSlots, watch } from 'vue';
import zIndex from '../../libs/config/zIndex';
import { useLocale } from '../../libs/hooks/useLocale';
import Calendar from '../../libs/util/calendar';
import Button from '../snake-button/snake-button.vue';
import Icon from '../snake-icon/snake-icon.vue';
import Popup from '../snake-popup/snake-popup.vue';
import {
    calendarProps,
    type CalendarChangeDate,
    type CalendarChangeRange,
    type CalendarEmits,
    type CalendarLunar
} from './types';

defineOptions({ name: 'Calendar', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = defineProps(calendarProps);
const emit = defineEmits<CalendarEmits>();
const slots = useSlots();
const { t, currentLocale } = useLocale('calendar');

// 组件内部状态
// 星期几,值为0-6
const weekday = ref(1);
const weekdayArr = ref<number[]>([]);
const days = ref(0);
const daysArr = ref<number[]>([]);
const lunarArr = ref<CalendarLunar[]>([]);
const year = ref(2020);
const month = ref(0);
// 当前月有多少天
const day = ref(0);
const startYear = ref(0);
const startMonth = ref(0);
const startDay = ref(0);
const endYear = ref(0);
const endMonth = ref(0);
const endDay = ref(0);
const today = ref('');
const activeDate = ref('');
const startDate = ref('');
const endDate = ref('');
const isStart = ref(true);
const min = ref<{ year: number; month: number; day: number } | null>(null);
const max = ref<{ year: number; month: number; day: number } | null>(null);
const weekDayZh = ref([t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')]);

// 内置公历节日（格式：MM-DD），只收录中国法定与正式节日
const builtInFestivals: Record<string, string> = {
    '01-01': '元旦',
    '03-08': '妇女节',
    '03-12': '植树节',
    '05-01': '劳动节',
    '05-04': '青年节',
    '06-01': '儿童节',
    '07-01': '建党节',
    '08-01': '建军节',
    '09-10': '教师节',
    '10-01': '国庆节'
};

// 内置农历节日（格式：农历月-日），由 solar2lunar 换算，无需逐年维护公历日期
const builtInLunarFestivals: Record<string, string> = {
    '1-1': '春节',
    '1-15': '元宵节',
    '5-5': '端午节',
    '8-15': '中秋节',
    '9-9': '重阳节'
};

const dataChange = computed(() => `${props.mode}-${props.minDate}-${props.maxDate}`);
const lunarChange = computed(() => `${props.showLunar}-${props.showFestival}`);
const defaultDateChange = computed(
    () => `${props.defaultDate}-${props.startDate}-${props.endDate}-${props.defaultSelectToday}`
);
// 用户有传递层级值时优先使用
const layerZIndex = computed(() => Number(props.zIndex) || zIndex.popup);
const popupValue = computed({
    // 页面内嵌模式常显：不受 v-model 控制，避免未绑定 modelValue 时内容不渲染
    get: () => props.isPage || props.modelValue,
    set: (val: boolean) => emit('update:modelValue', val)
});

const btnDisable = computed(() => {
    let disable = false;
    if (props.mode === 'range') {
        if (!startDate.value || !endDate.value) {
            disable = true;
        }
    } else {
        if (!activeDate.value) {
            disable = true;
        }
    }
    return disable;
});

// 国际化计算属性
const startTextValue = computed(() => props.startText || t('startText'));
const endTextValue = computed(() => props.endText || t('endText'));
const toolTipValue = computed(() => props.toolTip || t('toolTip'));
const showTitle = computed(() => `${year.value}${t('year')}${month.value}${t('month')}`);

watch([dataChange, lunarChange], () => {
    init();
});

watch(defaultDateChange, () => {
    init();
});

onMounted(() => {
    init();
});

/** 获取日期颜色。 */
function getColor(index: number, type: number) {
    let color = type === 1 ? '' : props.color;
    const dayNum = index + 1;
    const date = `${year.value}-${formatNum(month.value)}-${formatNum(dayNum)}`;
    const timestamp = new Date(date.replace(/-/g, '/')).getTime();
    const start = startDate.value.replace(/-/g, '/');
    const end = endDate.value.replace(/-/g, '/');
    if ((props.isActiveCurrent && activeDate.value === date) || startDate.value === date || endDate.value === date) {
        color = type === 1 ? props.activeBgColor : props.activeColor;
    } else if (endDate.value && timestamp > new Date(start).getTime() && timestamp < new Date(end).getTime()) {
        color = type === 1 ? props.rangeBgColor : props.rangeColor;
    }
    return color;
}

/** 判断日期是否已打卡。 */
function isCheckedDate(dayNum: number) {
    const date = `${year.value}-${formatNum(month.value)}-${formatNum(dayNum)}`;
    return props.checkedDates.includes(date);
}

/** 判断是否是今日且已打卡。 */
function isTodayChecked(dayNum: number) {
    const date = `${year.value}-${formatNum(month.value)}-${formatNum(dayNum)}`;
    if (date !== today.value) {
        return false;
    }
    if (props.todayChecked) {
        return true;
    }
    if (props.checkedDates.includes(date)) {
        return true;
    }
    return false;
}

/** 获取打卡日期背景色。 */
function getCheckinColor(dayNum: number) {
    const date = `${year.value}-${formatNum(month.value)}-${formatNum(dayNum)}`;
    const isToday = date === today.value;
    const isInCheckedDates = props.checkedDates.includes(date);

    if (!props.checkinMode && props.checkedDates.length === 0 && !props.todayChecked) {
        return '';
    }
    if (isToday && (props.todayChecked || isInCheckedDates)) {
        return props.todayCheckedBgColor;
    }
    if (isInCheckedDates) {
        return props.checkedBgColor;
    }
    if (props.checkinMode) {
        return props.uncheckedBgColor;
    }
    return '';
}

/** 获取打卡日期文字颜色。 */
function getCheckinTextColor(dayNum: number) {
    if (!props.checkinMode && props.checkedDates.length === 0 && !props.todayChecked) {
        return '';
    }
    const date = `${year.value}-${formatNum(month.value)}-${formatNum(dayNum)}`;
    if (props.checkedDates.includes(date) || (date === today.value && props.todayChecked)) {
        return props.checkedColor;
    }
    if (props.checkinMode) {
        return props.uncheckedColor;
    }
    return '';
}

/** 获取打卡日期农历文字颜色。 */
function getCheckinLunarColor(dayNum: number) {
    if (!props.checkinMode && props.checkedDates.length === 0 && !props.todayChecked) {
        return '';
    }
    const date = `${year.value}-${formatNum(month.value)}-${formatNum(dayNum)}`;
    if (props.checkedDates.includes(date) || (date === today.value && props.todayChecked)) {
        return props.checkedColor;
    }
    if (props.checkinMode) {
        return props.uncheckedColor;
    }
    return '';
}

/** 获取自定义插槽的颜色。 */
function getSlotColor(dayNum: number) {
    const date = `${year.value}-${formatNum(month.value)}-${formatNum(dayNum)}`;
    if (props.isActiveCurrent && (activeDate.value === date || startDate.value === date || endDate.value === date)) {
        return props.activeColor;
    }
    if (props.checkinMode || props.checkedDates.length > 0 || props.todayChecked) {
        return getCheckinLunarColor(dayNum) || props.color;
    }
    return props.color;
}

/** 获取日期信息，用于自定义插槽。 */
function getDateInfo(dayNum: number) {
    const dateStr = `${year.value}-${formatNum(month.value)}-${formatNum(dayNum)}`;
    const dateObj = new Date(dateStr.replace(/-/g, '/'));
    const dayOfWeek = dateObj.getDay();
    const weekNames = [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')];
    const isSelected = activeDate.value === dateStr || startDate.value === dateStr || endDate.value === dateStr;

    return {
        year: year.value,
        month: month.value,
        day: dayNum,
        date: dateStr,
        week: weekNames[dayOfWeek],
        weekNum: dayOfWeek,
        isToday: dateStr === today.value,
        isHoliday: props.holidays.includes(dateStr),
        isWorkday: props.workdays.includes(dateStr),
        isChecked: props.checkedDates.includes(dateStr),
        isSelected,
        isTodayChecked: dateStr === today.value && props.todayChecked,
        lunar: lunarArr.value[dayNum - 1] || null
    };
}

/** 判断是否是节假日。 */
function isHoliday(dayNum: number) {
    const date = `${year.value}-${formatNum(month.value)}-${formatNum(dayNum)}`;
    return props.holidays.includes(date);
}

/** 判断是否是加班日。 */
function isWorkday(dayNum: number) {
    const date = `${year.value}-${formatNum(month.value)}-${formatNum(dayNum)}`;
    return props.workdays.includes(date);
}

/** 获取节日名称（合并内置节日和用户自定义节日）。 */
function getFestival(dayNum: number) {
    if (!props.showFestival && Object.keys(props.festivals).length === 0) {
        return '';
    }
    const date = `${year.value}-${formatNum(month.value)}-${formatNum(dayNum)}`;
    const monthDay = `${formatNum(month.value)}-${formatNum(dayNum)}`;
    if (date in props.festivals) {
        return props.festivals[date];
    }
    if (monthDay in props.festivals) {
        return props.festivals[monthDay];
    }
    if (props.showFestival) {
        if (builtInFestivals[monthDay]) {
            return builtInFestivals[monthDay];
        }
        const lunar = lunarArr.value[dayNum - 1];
        if (lunar) {
            // 清明是唯一放假的节气，公历日期逐年浮动，按节气判定
            if (lunar.term === '清明') return '清明节';
            const lunarFestival = builtInLunarFestivals[`${lunar.month}-${lunar.day}`];
            if (lunarFestival) return lunarFestival;
        }
    }
    return '';
}

/** 获取节假日/加班日文字颜色。 */
function getHolidayWorkdayColor(dayNum: number, defaultColor: string) {
    const date = `${year.value}-${formatNum(month.value)}-${formatNum(dayNum)}`;
    if (activeDate.value === date || startDate.value === date || endDate.value === date) {
        return props.activeColor;
    }
    return defaultColor;
}

/** 初始化日历数据。 */
function init() {
    const realNow = new Date();
    let now = realNow;
    const minDateObj = new Date(String(props.minDate));
    let maxDateObj = new Date(String(props.maxDate || ''));
    if (Number.isNaN(maxDateObj.getTime())) maxDateObj = new Date();
    if (now < minDateObj) now = minDateObj;
    if (now > maxDateObj) now = maxDateObj;
    year.value = now.getFullYear();
    month.value = now.getMonth() + 1;
    day.value = now.getDate();
    // 「今天」必须是真实日期，不能随 min/max 范围钳制漂移
    today.value = `${realNow.getFullYear()}-${formatNum(realNow.getMonth() + 1)}-${formatNum(realNow.getDate())}`;
    min.value = initDate(String(props.minDate));
    max.value = initDate(String(props.maxDate) || today.value);

    if (props.mode === 'date' && props.defaultDate) {
        const defaultDateObj = new Date(props.defaultDate.replace(/-/g, '/'));
        if (!Number.isNaN(defaultDateObj.getTime())) {
            year.value = defaultDateObj.getFullYear();
            month.value = defaultDateObj.getMonth() + 1;
            day.value = defaultDateObj.getDate();
            activeDate.value = `${year.value}-${formatNum(month.value)}-${formatNum(day.value)}`;
        } else if (props.defaultSelectToday) {
            activeDate.value = today.value;
        } else {
            activeDate.value = '';
        }
    } else if (props.mode === 'range' && (props.startDate || props.endDate)) {
        const startDateObj = props.startDate ? new Date(props.startDate.replace(/-/g, '/')) : null;
        const endDateObj = props.endDate ? new Date(props.endDate.replace(/-/g, '/')) : null;

        if (startDateObj && !Number.isNaN(startDateObj.getTime())) {
            year.value = startDateObj.getFullYear();
            month.value = startDateObj.getMonth() + 1;
            startYear.value = startDateObj.getFullYear();
            startMonth.value = startDateObj.getMonth() + 1;
            startDay.value = startDateObj.getDate();
            startDate.value = `${startYear.value}-${formatNum(startMonth.value)}-${formatNum(startDay.value)}`;
        }
        if (endDateObj && !Number.isNaN(endDateObj.getTime())) {
            endYear.value = endDateObj.getFullYear();
            endMonth.value = endDateObj.getMonth() + 1;
            endDay.value = endDateObj.getDate();
            endDate.value = `${endYear.value}-${formatNum(endMonth.value)}-${formatNum(endDay.value)}`;
        }
        isStart.value = true;
        activeDate.value = '';
    } else if (props.defaultSelectToday) {
        activeDate.value = today.value;
        resetRangeState();
    } else {
        activeDate.value = '';
        resetRangeState();
    }

    changeData();
}

/** 重置范围选择状态。 */
function resetRangeState() {
    startDate.value = '';
    startYear.value = 0;
    startMonth.value = 0;
    startDay.value = 0;
    endYear.value = 0;
    endMonth.value = 0;
    endDay.value = 0;
    endDate.value = '';
    isStart.value = true;
}

/** 日期字符串转对象。 */
function initDate(date: string) {
    const parts = date.split('-');
    return {
        year: Number(parts[0] || 1920),
        month: Number(parts[1] || 1),
        day: Number(parts[2] || 1)
    };
}

/** 判断日期是否可选。 */
function openDisAbled(yearNum: number, monthNum: number, dayNum: number) {
    let bool = true;
    const date = `${yearNum}/${formatNum(monthNum)}/${formatNum(dayNum)}`;
    const minStr = min.value ? `${min.value.year}/${formatNum(min.value.month)}/${formatNum(min.value.day)}` : '';
    const maxStr = max.value ? `${max.value.year}/${formatNum(max.value.month)}/${formatNum(max.value.day)}` : '';
    const timestamp = new Date(date).getTime();
    if (min.value && max.value && timestamp >= new Date(minStr).getTime() && timestamp <= new Date(maxStr).getTime()) {
        bool = false;
    }
    return bool;
}

/** 生成数组。 */
function generateArray(start: number, end: number) {
    return Array.from(new Array(end + 1).keys()).slice(start);
}

/** 格式化数字。 */
function formatNum(num: number) {
    return num < 10 ? `0${num}` : `${num}`;
}

/** 获取某月天数。 */
function getMonthDay(yearNum: number, monthNum: number) {
    return new Date(yearNum, monthNum, 0).getDate();
}

/** 获取某月第一天星期几。 */
function getWeekday(yearNum: number, monthNum: number) {
    const date = new Date(`${yearNum}/${monthNum}/01 00:00:00`);
    return date.getDay();
}

/** 检查年月是否超出范围。 */
function checkRange(yearNum: number, monthNum: number) {
    if (yearNum < Number(props.minYear) || yearNum > Number(props.maxYear)) {
        uni.showToast({ title: t('outOfRange'), icon: 'none' });
        return true;
    }
    const beforeMin =
        min.value && (yearNum < min.value.year || (yearNum === min.value.year && monthNum < min.value.month));
    const afterMax =
        max.value && (yearNum > max.value.year || (yearNum === max.value.year && monthNum > max.value.month));
    if (beforeMin || afterMax) {
        uni.showToast({ title: t('outOfRange'), icon: 'none' });
        return true;
    }
    return false;
}

/** 切换月份。 */
function changeMonthHandler(isAdd: number) {
    if (isAdd) {
        let m = month.value + 1;
        let y = m > 12 ? year.value + 1 : year.value;
        m = m > 12 ? 1 : m;
        if (!checkRange(y, m)) {
            month.value = m;
            year.value = y;
            changeData();
        }
    } else {
        let m = month.value - 1;
        let y = m < 1 ? year.value - 1 : year.value;
        m = m < 1 ? 12 : m;
        if (!checkRange(y, m)) {
            month.value = m;
            year.value = y;
            changeData();
        }
    }
}

/** 切换年份：若 minDate/maxDate 的月份在当前年超出，则切换到该年的最小/最大有效月。 */
function changeYearHandler(isAdd: number) {
    let y = isAdd ? year.value + 1 : year.value - 1;
    let m = month.value;
    if (min.value && y === min.value.year && m < min.value.month) {
        m = min.value.month;
    }
    if (max.value && y === max.value.year && m > max.value.month) {
        m = max.value.month;
    }
    if (!checkRange(y, m)) {
        year.value = y;
        month.value = m;
        changeData();
    }
}

/** 更新日历数据。 */
function changeData() {
    days.value = getMonthDay(year.value, month.value);
    daysArr.value = generateArray(1, days.value);
    weekday.value = getWeekday(year.value, month.value);
    weekdayArr.value = generateArray(1, weekday.value);
    if (props.showLunar || props.showFestival) {
        lunarArr.value = [];
        daysArr.value.forEach(d => {
            lunarArr.value.push(getLunar(year.value, month.value, d));
        });
    }
    if (props.isChange && props.mode === 'date') {
        btnFix(true);
    }
}

/** 获取农历。 */
function getLunar(yearNum: number, monthNum: number, dayNum: number): CalendarLunar {
    const val = Calendar.solar2lunar(yearNum, monthNum, dayNum) as {
        IDayCn: string;
        ncWeek: string;
        IMonthCn: string;
        lDay: number;
        nWeek: number;
        lMonth: number;
        lYear: number;
        isTerm: boolean;
        Term: string;
    };
    return {
        dayCn: val.IDayCn,
        weekCn: val.ncWeek,
        monthCn: val.IMonthCn,
        day: val.lDay,
        week: val.nWeek,
        month: val.lMonth,
        year: val.lYear,
        term: val.isTerm ? val.Term || '' : ''
    };
}

/** 日期点击事件。 */
function dateClick(dayIdx: number) {
    // 只读模式下禁止点击
    if (props.readonly) return;

    const d = dayIdx + 1;
    if (!openDisAbled(year.value, month.value, d)) {
        day.value = d;
        const date = `${year.value}-${formatNum(month.value)}-${formatNum(d)}`;
        if (props.mode === 'date') {
            activeDate.value = date;
            // 页面模式下单选完成自动触发 change；打卡签到模式下弹窗模式也立即触发
            if (props.isPage || props.checkinMode) {
                btnFix(true);
            }
        } else {
            const compare =
                new Date(date.replace(/-/g, '/')).getTime() < new Date(startDate.value.replace(/-/g, '/')).getTime();
            if (isStart.value || compare) {
                startDate.value = date;
                startYear.value = year.value;
                startMonth.value = month.value;
                startDay.value = day.value;
                endYear.value = 0;
                endMonth.value = 0;
                endDay.value = 0;
                endDate.value = '';
                activeDate.value = '';
                isStart.value = false;
            } else {
                endDate.value = date;
                endYear.value = year.value;
                endMonth.value = month.value;
                endDay.value = day.value;
                isStart.value = true;
                // 页面模式下范围选择完成自动触发 change
                if (props.isPage) {
                    btnFix(true);
                }
            }
        }
    }
}

/** 关闭弹窗。 */
function closeCalendar() {
    emit('input', false);
    emit('update:modelValue', false);
}

/** 遮罩或关闭按钮收起时触发。 */
function onPopupClose() {
    emit('close');
}

/** 获取星期文本。 */
function getWeekText(date: string) {
    const d = new Date(`${date.replace(/-/g, '/')} 00:00:00`);
    const week = d.getDay();
    const weekNames = [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')];
    return currentLocale.value === 'zh-CN' ? `星期${weekNames[week]}` : weekNames[week];
}

/** 确定按钮事件。 */
function btnFix(show: boolean) {
    // 页面模式下不关闭，弹窗模式下关闭
    if (!show && !props.isPage) {
        closeCalendar();
    }
    if (props.mode === 'date') {
        const arr = activeDate.value.split('-');
        const y = props.isChange ? year.value : Number(arr[0]);
        const m = props.isChange ? month.value : Number(arr[1]);
        const d = props.isChange ? day.value : Number(arr[2]);
        const daysNum = getMonthDay(y, m);
        const result = `${y}-${formatNum(m)}-${formatNum(d)}`;
        const weekText = getWeekText(result);
        let isToday = false;
        if (result === today.value) {
            isToday = true;
        }
        const lunar = props.showLunar ? getLunar(y, m, d) : null;
        const payload: CalendarChangeDate = {
            year: y,
            month: m,
            day: d,
            days: daysNum,
            result,
            week: weekText,
            isToday,
            lunar
        };
        emit('change', payload);
    } else {
        if (!startDate.value || !endDate.value) return;
        const startDateStr = `${startYear.value}-${formatNum(startMonth.value)}-${formatNum(startDay.value)}`;
        const startWeek = getWeekText(startDateStr);
        const endDateStr = `${endYear.value}-${formatNum(endMonth.value)}-${formatNum(endDay.value)}`;
        const endWeek = getWeekText(endDateStr);
        let startLunar: CalendarLunar | null = null;
        let endLunar: CalendarLunar | null = null;
        if (props.showLunar) {
            startLunar = getLunar(startYear.value, startMonth.value, startDay.value);
            endLunar = getLunar(endYear.value, endMonth.value, endDay.value);
        }
        const payload: CalendarChangeRange = {
            startYear: startYear.value,
            startMonth: startMonth.value,
            startDay: startDay.value,
            startDate: startDateStr,
            startWeek,
            endYear: endYear.value,
            endMonth: endMonth.value,
            endDay: endDay.value,
            endDate: endDateStr,
            endWeek,
            startLunar,
            endLunar
        };
        emit('change', payload);
    }
}
</script>

<style scoped>
.snake-calendar {
    color: var(--snake-color-text-secondary, #606266);
}
.snake-calendar--page {
    background-color: var(--snake-color-surface, #fff);
    border-radius: 16rpx;
}
.snake-calendar__header {
    box-sizing: border-box;
    width: 100%;
    font-size: 30rpx;
    background-color: var(--snake-color-surface, #fff);
    color: var(--snake-color-text, #303133);
}
.snake-calendar__header__text {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30rpx;
    padding: 0 60rpx;
}
.snake-calendar__action {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40rpx 0;
}
.snake-calendar__action__icon {
    margin: 0 16rpx;
}
.snake-calendar__action__text {
    padding: 0 16rpx;
    color: var(--snake-color-text, #303133);
    font-size: 32rpx;
    font-weight: bold;
    line-height: 32rpx;
}
.snake-calendar__week-day {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 0;
    overflow: hidden;
}
.snake-calendar__week-day__text {
    flex: 1;
    text-align: center;
}
.snake-calendar__content {
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding: 6px 0;
    background-color: var(--snake-color-surface, #fff);
}
.snake-calendar__content--end-date {
    border-top-right-radius: 8rpx;
    border-bottom-right-radius: 8rpx;
}
.snake-calendar__content--start-date {
    border-top-left-radius: 8rpx;
    border-bottom-left-radius: 8rpx;
}
.snake-calendar__content--checked .snake-calendar__content__item__inner,
.snake-calendar__content--today-checked .snake-calendar__content__item__inner,
.snake-calendar__content--checkin-mode .snake-calendar__content__item__inner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
}
.snake-calendar__content__item {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14.2857%;
    padding: 6px 0;
    overflow: hidden;
}
.snake-calendar__content__item--hover {
    opacity: 0.6;
}
.snake-calendar__content__item__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 84rpx;
    font-size: 32rpx;
}
.snake-calendar__content__item__inner--today-checked {
    display: flex;
    align-items: center;
    justify-content: center;
}
.snake-calendar__content__item__day {
    font-size: 32rpx;
    line-height: 1;
}
.snake-calendar__content__item__lunar {
    margin-top: 2rpx;
    font-size: 22rpx;
    line-height: 1;
    transform: scale(0.85);
}
.snake-calendar__content__item__mark {
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    z-index: 1;
    font-size: 24rpx;
    line-height: 1;
    transform: scale(0.75);
}
.snake-calendar__content__item__mark--holiday {
    color: var(--snake-color-error, #fa3534);
}
.snake-calendar__content__item__mark--workday {
    color: var(--snake-color-primary, #06d290);
}
.snake-calendar__content__item__festival {
    font-size: 22rpx;
    line-height: 1;
    color: var(--snake-color-primary, #06d290);
    transform: scale(0.85);
}
.snake-calendar__content__item__placeholder {
    min-height: 22rpx;
    margin-top: 2rpx;
    opacity: 0;
}
.snake-calendar__content__item__checkmark {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}
.snake-calendar__content__bg-month {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    font-size: 130px;
    line-height: 130px;
    color: var(--snake-color-border, #e4e7ed);
    transform: translate(-50%, -50%);
}
.snake-calendar__bottom {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0 40rpx 30rpx;
    font-size: 24rpx;
    color: var(--snake-color-text-muted, #909399);
    background-color: var(--snake-color-surface, #fff);
}
.snake-calendar__bottom__choose {
    height: 50rpx;
}
.snake-calendar__bottom__btn {
    width: 100%;
}
</style>
