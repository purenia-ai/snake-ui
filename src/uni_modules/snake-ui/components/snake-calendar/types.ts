import type { ExtractPropTypes, PropType } from 'vue';
import type { SnakeStyleValue } from '../../types/global';

/** SnakeCalendarMode 类型定义。 */
export type SnakeCalendarMode = 'date' | 'range';
/** SnakeCalendarLunar 农历信息。 */
export interface SnakeCalendarLunar {
    /** 农历日中文。 */
    dayCn: string;
    /** 星期中文。 */
    weekCn: string;
    /** 农历月中文。 */
    monthCn: string;
    /** 农历日。 */
    day: number;
    /** 星期几。 */
    week: number;
    /** 农历月。 */
    month: number;
    /** 农历年。 */
    year: number;
}
/** SnakeCalendarChangeDate 单选模式 change 事件载荷。 */
export interface SnakeCalendarChangeDate {
    /** 选中年。 */
    year: number;
    /** 选中月。 */
    month: number;
    /** 选中日。 */
    day: number;
    /** 当月天数。 */
    days: number;
    /** 选中日期，格式 YYYY-MM-DD。 */
    result: string;
    /** 星期文本。 */
    week: string;
    /** 是否今天。 */
    isToday: boolean;
    /** 农历信息。 */
    lunar: SnakeCalendarLunar | null;
}
/** SnakeCalendarChangeRange 范围模式 change 事件载荷。 */
export interface SnakeCalendarChangeRange {
    /** 开始年。 */
    startYear: number;
    /** 开始月。 */
    startMonth: number;
    /** 开始日。 */
    startDay: number;
    /** 开始日期，格式 YYYY-MM-DD。 */
    startDate: string;
    /** 开始日期星期文本。 */
    startWeek: string;
    /** 结束年。 */
    endYear: number;
    /** 结束月。 */
    endMonth: number;
    /** 结束日。 */
    endDay: number;
    /** 结束日期，格式 YYYY-MM-DD。 */
    endDate: string;
    /** 结束日期星期文本。 */
    endWeek: string;
    /** 开始日期农历信息。 */
    startLunar: SnakeCalendarLunar | null;
    /** 结束日期农历信息。 */
    endLunar: SnakeCalendarLunar | null;
}

/** snakeCalendarProps 运行时属性及默认值。 */
export const snakeCalendarProps = {
    /** 根节点自定义样式。 */
    customStyle: { type: [String, Object, Array] as PropType<SnakeStyleValue>, default: '' },
    /** 根节点自定义类名。 */
    customClass: { type: String, default: '' },
    /** 是否开启底部安全区适配。 */
    safeAreaInsetBottom: { type: Boolean, default: false },
    /** 是否允许通过点击遮罩关闭日历。 */
    maskCloseAble: { type: Boolean, default: true },
    /** 双向绑定控制日历的弹出与收起。 */
    modelValue: { type: Boolean, default: false },
    /** 弹出时的层级，0 表示使用弹层默认层级。 */
    zIndex: { type: [Number, String] as PropType<number | string>, default: 0 },
    /** 是否允许切换年份。 */
    changeYear: { type: Boolean, default: true },
    /** 是否允许切换月份。 */
    changeMonth: { type: Boolean, default: true },
    /** 选择模式，date 单个日期，range 日期范围。 */
    mode: { type: String as PropType<SnakeCalendarMode>, default: 'date' },
    /** 可切换的最大年份。 */
    maxYear: { type: [Number, String] as PropType<number | string>, default: 2050 },
    /** 可切换的最小年份。 */
    minYear: { type: [Number, String] as PropType<number | string>, default: 1950 },
    /** 最小可选日期，不在范围内的日期禁用不可选。 */
    minDate: { type: [Number, String] as PropType<number | string>, default: '1950-01-01' },
    /** 最大可选日期，默认最大值为今天。 */
    maxDate: { type: [Number, String] as PropType<number | string>, default: '' },
    /** 弹窗顶部左右两边的圆角值。 */
    borderRadius: { type: [String, Number] as PropType<string | number>, default: 20 },
    /** 月份切换按钮箭头颜色。 */
    monthArrowColor: { type: String, default: 'var(--snake-color-text-secondary, #606266)' },
    /** 年份切换按钮箭头颜色。 */
    yearArrowColor: { type: String, default: 'var(--snake-color-text-muted, #909399)' },
    /** 默认日期字体颜色。 */
    color: { type: String, default: 'var(--snake-color-text, #303133)' },
    /** 选中/起始结束日期背景色。 */
    activeBgColor: { type: String, default: 'var(--snake-color-primary, #06D290)' },
    /** 选中/起始结束日期字体颜色。 */
    activeColor: { type: String, default: 'var(--snake-color-white, #fff)' },
    /** 范围内日期背景色。 */
    rangeBgColor: { type: String, default: 'rgba(var(--snake-color-primary-rgb, 6, 210, 144), 0.13)' },
    /** 范围内日期字体颜色。 */
    rangeColor: { type: String, default: 'var(--snake-color-primary, #06D290)' },
    /** mode 为 range 时生效，起始日期自定义文案。 */
    startText: { type: String, default: '' },
    /** mode 为 range 时生效，结束日期自定义文案。 */
    endText: { type: String, default: '' },
    /** 确定按钮样式类型。 */
    btnType: { type: String, default: 'primary' },
    /** 当前选中日期带选中效果。 */
    isActiveCurrent: { type: Boolean, default: true },
    /** 初始化时是否默认选中今天，优先级低于 defaultDate/startDate/endDate。 */
    defaultSelectToday: { type: Boolean, default: true },
    /** 切换年月是否触发事件，mode 为 date 时生效。 */
    isChange: { type: Boolean, default: false },
    /** 是否显示右上角的关闭图标。 */
    closeable: { type: Boolean, default: true },
    /** 顶部的提示文字。 */
    toolTip: { type: String, default: '' },
    /** 是否显示农历。 */
    showLunar: { type: Boolean, default: false },
    /** 是否在页面中直接显示，不使用弹窗。 */
    isPage: { type: Boolean, default: false },
    /** 默认选中的日期，mode 为 date 时生效，格式 2024-01-01。 */
    defaultDate: { type: String, default: '' },
    /** 默认选中的开始日期，mode 为 range 时生效，格式 2024-01-01。 */
    startDate: { type: String, default: '' },
    /** 默认选中的结束日期，mode 为 range 时生效，格式 2024-01-01。 */
    endDate: { type: String, default: '' },
    /** 是否只读，只读模式下禁止点击选择日期。 */
    readonly: { type: Boolean, default: false },
    /** 已打卡日期列表，格式 ['2024-01-01']。 */
    checkedDates: { type: Array as PropType<string[]>, default: () => [] },
    /** 打卡日期背景色。 */
    checkedBgColor: { type: String, default: 'var(--snake-color-warning, #ff9900)' },
    /** 打卡日期字体颜色。 */
    checkedColor: { type: String, default: 'var(--snake-color-white, #fff)' },
    /** 今日是否已打卡。 */
    todayChecked: { type: Boolean, default: false },
    /** 今日已打卡背景色。 */
    todayCheckedBgColor: { type: String, default: 'var(--snake-color-success, #19be6b)' },
    /** 未打卡日期背景色。 */
    uncheckedBgColor: { type: String, default: 'var(--snake-color-text-light, #c0c4cc)' },
    /** 未打卡日期字体颜色。 */
    uncheckedColor: { type: String, default: 'var(--snake-color-white, #fff)' },
    /** 是否启用打卡签到模式（未打卡日期显示灰色）。 */
    checkinMode: { type: Boolean, default: false },
    /** 节假日列表，格式 ['2024-01-01']。 */
    holidays: { type: Array as PropType<string[]>, default: () => [] },
    /** 节假日文字颜色。 */
    holidayColor: { type: String, default: 'var(--snake-color-error, #fa3534)' },
    /** 加班日列表，格式 ['2024-01-06']。 */
    workdays: { type: Array as PropType<string[]>, default: () => [] },
    /** 加班日文字颜色。 */
    workdayColor: { type: String, default: 'var(--snake-color-primary, #06D290)' },
    /** 节日配置，格式 { '2024-04-04': '清明节' }。 */
    festivals: { type: Object as PropType<Record<string, string>>, default: () => ({}) },
    /** 节日文字颜色。 */
    festivalColor: { type: String, default: 'var(--snake-color-primary, #06D290)' },
    /** 是否显示内置节日（中国传统节日）。 */
    showFestival: { type: Boolean, default: false },
    /** 是否启用自定义日期内容插槽。 */
    useDateSlot: { type: Boolean, default: false }
} as const;

/** SnakeCalendar 组件的公开属性。 */
export type SnakeCalendarProps = ExtractPropTypes<typeof snakeCalendarProps>;

/** SnakeCalendar 组件的事件契约。 */
export interface SnakeCalendarEmits {
    /** 双向绑定值更新。 */
    'update:modelValue': [value: boolean];
    /** 弹窗通过按钮收起时触发（兼容 input 语义）。 */
    input: [value: boolean];
    /** 点击遮罩或关闭按钮收起时触发。 */
    close: [];
    /** 选择结果变化时触发。 */
    change: [value: SnakeCalendarChangeDate | SnakeCalendarChangeRange];
}
