import type { ExtractPropTypes, PropType } from 'vue';
import type { StyleValue } from '../../types/global';

/** KeyboardMode 键盘形态：`default` 标准数字键盘，`custom` 右侧追加删除与确认大键（金额、密码场景），`car` 车牌号键盘。 */
export type KeyboardMode = 'default' | 'custom' | 'car';

/** CarKeyboardLang 车牌键盘语言：`zh` 省份简称页，`en` 数字与字母页。 */
export type CarKeyboardLang = 'zh' | 'en';

/** KeyboardKeyType 按键类型：`input` 数字 / 字母输入，`extra` 额外按键，`delete` 删除，`close` 收起键盘，`carLang` 车牌中英切换。 */
export type KeyboardKeyType = 'input' | 'extra' | 'delete' | 'close' | 'carLang';

/** KeyboardKey 键盘按键描述，用于渲染格子。 */
export interface KeyboardKey {
    /** 按键文本，图标键（删除 / 收起）为空串。 */
    text: string;
    /** 按键类型。 */
    type: KeyboardKeyType;
    /** 是否占两列宽。 */
    wider: boolean;
}

/** 长按删除键后开始连续删除的等待时间，单位 ms。 */
export const KEYBOARD_DELETE_HOLD_DELAY = 350;
/** 长按删除键期间每次删除的间隔，单位 ms。 */
export const KEYBOARD_DELETE_REPEAT_INTERVAL = 80;

/** keyboardProps 运行时属性及默认值。 */
export const keyboardProps = {
    /** 根节点自定义样式。 */
    customStyle: { type: [String, Object, Array] as PropType<StyleValue>, default: '' },
    /** 根节点自定义类名。 */
    customClass: { type: String, default: '' },
    /** 当前输入值，配合 `v-model` 使用。 */
    modelValue: { type: String, default: '' },
    /** 键盘开合，配合 `v-model:visible` 使用。 */
    visible: { type: Boolean, default: false },
    /** 键盘形态，`custom` 会把删除与确认放到右侧大键上，`car` 为车牌号键盘。 */
    mode: { type: String as PropType<KeyboardMode>, default: 'default' },
    /** 车牌键盘当前语言，传入即为受控（配合 `v-model:carLang`），仅 `mode` 为 `car` 时生效。 */
    carLang: { type: String as PropType<CarKeyboardLang>, default: undefined },
    /** 车牌键盘是否自动切换语言：输入首位省份后切到字母页，删空后回到省份页，仅非受控时生效。 */
    autoSwitchLang: { type: Boolean, default: false },
    /** 头部标题，与确认键都为空时不渲染头部。 */
    title: { type: String, default: '' },
    /** 输入值最大长度，达到后忽略新的输入。 */
    maxlength: { type: Number, default: Infinity },
    /** 左下角额外按键：`.` 用于金额，`X` 用于身份证；为空时该位置渲染收起键盘键。 */
    extraKey: { type: String, default: '' },
    /** 是否显示删除键。 */
    showDeleteKey: { type: Boolean, default: true },
    /** 删除键文案，为空时显示退格图标。 */
    deleteText: { type: String, default: '' },
    /** 是否显示确认键：`default` 渲染在头部右侧，`custom` 渲染为右侧大键。 */
    showConfirm: { type: Boolean, default: true },
    /** 确认键文案，缺省取语言包。 */
    confirmText: { type: String, default: '' },
    /** 是否打乱数字键顺序，每次打开重新随机（额外按键与 0 位置不变）。 */
    randomKeyOrder: { type: Boolean, default: false },
    /** 是否允许点击遮罩关闭。 */
    closeOnClickOverlay: { type: Boolean, default: true },
    /** 是否开启底部安全区适配。 */
    safeAreaInsetBottom: { type: Boolean, default: true },
    /** 是否将弹层传送到页面根节点渲染，避免被祖先的 transform、overflow 裁剪。 */
    rootPortal: { type: Boolean, default: false },
    /** 面板圆角：默认直角，传 `true` 取 `--snake-radius-large`，数字 / 字符串按 CSS 尺寸。 */
    round: { type: [Boolean, Number, String] as PropType<boolean | number | string>, default: false },
    /** 弹出时的层级，0 表示使用弹层默认层级。 */
    zIndex: { type: [Number, String] as PropType<number | string>, default: 0 },
    /** 是否禁用整组件，禁用后无法打开也无法输入。 */
    disabled: { type: Boolean, default: false }
} as const;

/** Keyboard 组件的公开属性。 */
export type KeyboardProps = ExtractPropTypes<typeof keyboardProps>;

/** Keyboard 组件的事件契约。 */
export type KeyboardEmits = {
    /** 输入值变化时派发（`v-model` 通道）。 */
    'update:modelValue': [value: string];
    /** 键盘开合变化时派发（`v-model:visible` 通道）。 */
    'update:visible': [visible: boolean];
    /** 车牌键盘语言变化时派发（`v-model:carLang` 通道）。 */
    'update:carLang': [lang: CarKeyboardLang];
    /** 打开动画完成后触发。 */
    open: [];
    /** 关闭动画完成后触发，包含确认、遮罩与收起键三条关闭路径。 */
    close: [];
    /** 点击数字或额外按键时派发该键的值。 */
    input: [key: string];
    /** 点击删除键时触发，长按会连续触发。 */
    delete: [];
    /** 点击确认键时派发当前输入值。 */
    confirm: [value: string];
};

/** Keyboard 组件通过模板 ref 暴露的接口。 */
export interface KeyboardExpose {
    /** 打开键盘，需要绑定 visible 才能生效。 */
    open(): void;
    /** 关闭键盘。 */
    close(): void;
}
