import type { ExtractPropTypes, PropType } from 'vue';
import type { SnakeStyleValue } from '../../types/global';

/** SnakeTextMode 类型定义。 */
export type SnakeTextMode = 'text' | 'price' | 'phone' | 'name' | 'date' | 'link';
/** SnakeTextDecoration 类型定义。 */
export type SnakeTextDecoration = 'none' | 'underline' | 'line-through';
/** SnakeTextAlign 类型定义。 */
export type SnakeTextAlign = 'left' | 'center' | 'right';
/** SnakeTextWordWrap 类型定义。 */
export type SnakeTextWordWrap = 'break-word' | 'normal' | 'anywhere';

/** snakeTextProps 运行时属性及默认值。 */
export const snakeTextProps = {
    /** 根节点自定义样式。 */
    customStyle: { type: [String, Object, Array] as PropType<SnakeStyleValue>, default: '' },
    /** 根节点自定义类名。 */
    customClass: { type: String, default: '' },
    /** 主题颜色。 */
    type: { type: String, default: '' },
    /** 是否显示文本。 */
    show: { type: Boolean, default: true },
    /** 显示的值。 */
    text: { type: [String, Number] as PropType<string | number>, default: '' },
    /** 前置图标。 */
    prefixIcon: { type: String, default: '' },
    /** 后置图标。 */
    suffixIcon: { type: String, default: '' },
    /** 文本处理模式。 */
    mode: { type: String as PropType<SnakeTextMode>, default: 'text' },
    /** 链接地址，mode 为 link 时使用。 */
    href: { type: String, default: '' },
    /** 格式化规则，字符串或函数。 */
    format: { type: [String, Function] as PropType<string | ((value: unknown) => unknown)>, default: '' },
    /** mode 为 phone 时，点击文本是否拨打电话。 */
    call: { type: Boolean, default: false },
    /** 小程序的打开方式。 */
    openType: { type: String, default: '' },
    /** 是否粗体。 */
    bold: { type: Boolean, default: false },
    /** 是否块状显示。 */
    block: { type: Boolean, default: false },
    /** 显示行数，超出显示省略号。 */
    lines: { type: [String, Number] as PropType<string | number>, default: '' },
    /** 文本颜色。 */
    color: { type: String, default: 'var(--snake-color-text, #303133)' },
    /** 字体大小。 */
    size: { type: [String, Number] as PropType<string | number>, default: 28 },
    /** 图标样式。 */
    iconStyle: { type: [Object, Array, String] as PropType<SnakeStyleValue>, default: () => ({ fontSize: '15px' }) },
    /** 文字样式。 */
    textStyle: { type: [Object, Array, String] as PropType<SnakeStyleValue>, default: () => ({}) },
    /** 文字装饰。 */
    decoration: { type: String as PropType<SnakeTextDecoration>, default: 'none' },
    /** 外边距。 */
    margin: { type: [Object, String, Number] as PropType<Record<string, unknown> | string | number>, default: 0 },
    /** 行高。 */
    lineHeight: { type: [String, Number] as PropType<string | number>, default: '' },
    /** 对齐方式。 */
    align: { type: String as PropType<SnakeTextAlign>, default: 'left' },
    /** 换行方式。 */
    wordWrap: { type: String as PropType<SnakeTextWordWrap>, default: 'normal' },
    /** 语言。 */
    lang: { type: String, default: '' },
    /** 会话来源。 */
    sessionFrom: { type: String, default: '' },
    /** 会话消息卡片标题。 */
    sendMessageTitle: { type: String, default: '' },
    /** 会话消息卡片跳转路径。 */
    sendMessagePath: { type: String, default: '' },
    /** 会话消息卡片图片地址。 */
    sendMessageImg: { type: String, default: '' },
    /** 是否显示会话消息卡片。 */
    showMessageCard: { type: Boolean, default: false },
    /** 打开 App 时传递的参数。 */
    appParameter: { type: String, default: '' },
    /** 原生表单行为类型。 */
    formType: { type: String, default: '' }
} as const;

/** SnakeText 组件的公开属性。 */
export type SnakeTextProps = ExtractPropTypes<typeof snakeTextProps>;

/** SnakeText 组件的事件契约。 */
export interface SnakeTextEmits {
    /** click 事件携带的参数。 */
    click: [];
    /** getuserinfo 事件携带的参数。 */
    getuserinfo: [event: unknown];
    /** contact 事件携带的参数。 */
    contact: [event: unknown];
    /** getphonenumber 事件携带的参数。 */
    getphonenumber: [event: unknown];
    /** error 事件携带的参数。 */
    error: [event: unknown];
    /** launchapp 事件携带的参数。 */
    launchapp: [event: unknown];
    /** opensetting 事件携带的参数。 */
    opensetting: [event: unknown];
}
