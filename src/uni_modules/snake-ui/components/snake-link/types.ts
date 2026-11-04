import type { ExtractPropTypes, PropType } from 'vue';

/** linkProps 运行时属性及默认值。 */
export const linkProps = {
    /** 超链接文字。 */
    text: { type: [String, Number] as PropType<string | number>, default: '' },
    /** 文字颜色。 */
    color: { type: String, default: 'var(--snake-color-primary, #06D290)' },
    /** 字体大小，数值按 px（375 稿）处理。 */
    fontSize: { type: [String, Number] as PropType<string | number>, default: 14 },
    /** 是否显示下划线。 */
    underLine: { type: Boolean, default: false },
    /** 要跳转的链接。 */
    href: { type: String, default: '' },
    /** 小程序中复制到粘贴板后的提示语。 */
    mpTips: { type: String, default: '' },
    /** 下划线颜色，默认同文字颜色。 */
    lineColor: { type: String, default: '' },
    /** 是否默认点击跳转。 */
    defaultClick: { type: Boolean, default: true }
} as const;

/** Link 组件的公开属性。 */
export type LinkProps = ExtractPropTypes<typeof linkProps>;

/** Link 组件的事件契约。 */
export type LinkEmits = {
    /** defaultClick 为 false 时点击触发，携带链接地址。 */
    click: [href: string];
    /** 小程序端链接复制成功（用户关闭剪贴板权限时不触发），回传 setClipboardData 的 success 结果。 */
    'copy-success': [result: { errMsg?: string }];
    /** 小程序端链接复制失败（如用户关闭剪贴板权限），回传 setClipboardData 的失败信息。 */
    'copy-fail': [error: { errMsg?: string }];
};
