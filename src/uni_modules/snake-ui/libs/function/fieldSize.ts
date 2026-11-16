/** 输入类组件（Input / Textarea）的尺寸档位。与 FormSize 取值一致，libs 层不反向依赖 components。 */
export type FieldSize = 'small' | 'default' | 'large';

/** 输入类组件的尺寸配置。 */
export interface FieldSizeConfig {
    /** 容器高度（px，375 稿） */
    height: number;
    /** 文字字号（px） */
    fontSize: number;
    /** 操作图标字号（px） */
    iconSize: number;
}

/**
 * 输入类组件的尺寸表：Input 与 Textarea 共用同一套数值，
 * 避免两个组件各写一份 min-height / font-size 魔法数字而互相漂移。
 * 三档高度取整到 32 / 40 / 48，字号与图标随之放大（13/14/16、14/16/18），
 * 与主流小程序组件库的三档语义保持一致。
 */
export const FIELD_SIZE_CONFIG: Record<FieldSize, FieldSizeConfig> = {
    small: { height: 32, fontSize: 13, iconSize: 14 },
    default: { height: 40, fontSize: 14, iconSize: 16 },
    large: { height: 48, fontSize: 16, iconSize: 18 }
};

/** 取某个尺寸的配置，非法值兜底到 default。 */
export function getFieldSizeConfig(size: FieldSize | string | undefined): FieldSizeConfig {
    if (size === 'small' || size === 'large') return FIELD_SIZE_CONFIG[size];
    return FIELD_SIZE_CONFIG.default;
}
