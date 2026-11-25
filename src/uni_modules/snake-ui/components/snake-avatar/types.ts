import type { ExtractPropTypes, PropType } from 'vue';
import type { UnitValue } from '../../libs/function/unit';
import type { ImageMode, StyleValue } from '../../types/global';

/** 头像形状。 */
export type AvatarShape = 'circle' | 'square';

/**
 * snake-avatar 运行时属性。
 *
 * `size` 与 `shape` 刻意不给默认值：缺省时由头像组下发的配置接管，只有既没传也没有组时
 * 才在组件内落到 `40` / `circle`（见 snake-avatar.vue 的 resolvedSize / resolvedShape）。
 */
export const avatarProps = {
    /** 根节点自定义样式。 */
    customStyle: { type: [String, Object, Array] as PropType<StyleValue>, default: () => ({}) },
    /** 根节点自定义类名。 */
    customClass: { type: String, default: '' },
    /** 图片地址。 */
    src: { type: String, default: '' },
    /** 文字兜底，原样渲染（组件不截取首字符）。 */
    text: { type: String, default: '' },
    /** 图标兜底，取 snake-icon 的图标名。 */
    icon: { type: String, default: '' },
    /** 形状，缺省时继承头像组配置。 */
    shape: { type: String as PropType<AvatarShape>, default: undefined },
    /** 尺寸，缺省时继承头像组配置，最终兜底 40。 */
    size: { type: [String, Number] as PropType<UnitValue>, default: undefined },
    /** 方形头像的圆角，数值按 px（375 稿）处理。 */
    radius: { type: [String, Number] as PropType<UnitValue>, default: 6 },
    /** 文字字号，缺省按尺寸的 0.4 倍计算。 */
    fontSize: { type: [String, Number] as PropType<UnitValue>, default: undefined },
    /** 背景色，缺省取主题的弱化表面色。 */
    bgColor: { type: String, default: '' },
    /** 文字与图标的颜色，缺省取主题的弱化文字色。 */
    color: { type: String, default: '' },
    /** 图片裁剪模式，同 uni-app image 的 mode。 */
    fit: { type: String as PropType<ImageMode>, default: 'aspectFill' }
} as const;

/** snake-avatar 解析后的属性。 */
export type AvatarResolvedProps = ExtractPropTypes<typeof avatarProps>;

/** snake-avatar 对外属性。 */
export interface AvatarProps {
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 图片地址。 */
    src?: string;
    /** 文字兜底，原样渲染。 */
    text?: string;
    /** 图标兜底。 */
    icon?: string;
    /** 形状。 */
    shape?: AvatarShape;
    /** 尺寸。 */
    size?: UnitValue;
    /** 方形头像的圆角。 */
    radius?: UnitValue;
    /** 文字字号。 */
    fontSize?: UnitValue;
    /** 背景色。 */
    bgColor?: string;
    /** 文字与图标的颜色。 */
    color?: string;
    /** 图片裁剪模式。 */
    fit?: ImageMode;
}

/** snake-avatar 事件。 */
export type AvatarEmits = {
    /** 点击头像，不携带参数（组内序号由调用方自行持有）。 */
    click: [];
    /** 图片加载失败；同一个地址只派发一次。 */
    error: [event: unknown];
};
