import type { ExtractPropTypes, PropType } from 'vue';
import type { StyleValue } from '../../types/global';

/** 二维码纠错级别：L 约 7%、M 约 15%、Q 约 25%、H 约 30%。 */
export type QrCodeCorrectLevel = 'L' | 'M' | 'Q' | 'H';

/** qrCodeProps 运行时属性及默认值。 */
export const qrCodeProps = {
    /** 根节点自定义类名。 */
    customClass: { type: String, default: '' },
    /** 根节点自定义样式。 */
    customStyle: { type: [String, Object, Array] as PropType<StyleValue>, default: '' },
    /** 二维码内容，UTF-8 文本或链接。 */
    text: { type: String, default: '' },
    /** 二维码边长，单位 px。 */
    size: { type: Number, default: 200 },
    /** 纠错级别，带 Logo 时建议使用 H。 */
    correctLevel: { type: String as PropType<QrCodeCorrectLevel>, default: 'H' },
    /** 深色模块颜色。 */
    colorDark: { type: String, default: '#000000' },
    /** 浅色背景颜色。 */
    colorLight: { type: String, default: '#FFFFFF' },
    /** 二维码四周留白，单位 px。 */
    margin: { type: Number, default: 0 },
    /** 中心 Logo 图片地址，为空时不绘制。 */
    logo: { type: String, default: '' },
    /** Logo 宽度，单位 px，传 0 时取 size 的 20%。 */
    logoWidth: { type: Number, default: 0 },
    /** Logo 高度，单位 px，传 0 时同 logoWidth。 */
    logoHeight: { type: Number, default: 0 },
    /** Canvas 标识，不传时自动生成；同页多实例时建议显式指定。 */
    canvasId: { type: String, default: '' }
} as const;

/** QrCodeResolvedProps 组件的解析属性。 */
export type QrCodeResolvedProps = ExtractPropTypes<typeof qrCodeProps>;

/** QrCode 组件的公开属性。 */
export interface QrCodeProps {
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
    /** 二维码内容，UTF-8 文本或链接。 */
    text?: string;
    /** 二维码边长，单位 px。 */
    size?: number;
    /** 纠错级别，带 Logo 时建议使用 H。 */
    correctLevel?: QrCodeCorrectLevel;
    /** 深色模块颜色。 */
    colorDark?: string;
    /** 浅色背景颜色。 */
    colorLight?: string;
    /** 二维码四周留白，单位 px。 */
    margin?: number;
    /** 中心 Logo 图片地址，为空时不绘制。 */
    logo?: string;
    /** Logo 宽度，单位 px，传 0 时取 size 的 20%。 */
    logoWidth?: number;
    /** Logo 高度，单位 px，传 0 时同 logoWidth。 */
    logoHeight?: number;
    /** Canvas 标识，不传时自动生成；同页多实例时建议显式指定。 */
    canvasId?: string;
}

/** QrCode 组件的事件契约。 */
export type QrCodeEmits = {
    /** 点击二维码时触发。 */
    click: [event: Event];
    /** 内容编码或画布绘制失败时触发。 */
    error: [error: unknown];
};

/** QrCode 组件暴露的方法。 */
export interface QrCodeExpose {
    /** 等待当前绘制完成后导出二维码临时图片路径。 */
    exportImage: () => Promise<string>;
}
