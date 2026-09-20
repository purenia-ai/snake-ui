/** Tooltip 定位计算所需的节点矩形。 */
export interface TooltipRect {
    left: number;
    top: number;
    width: number;
    height: number;
}

/** 箭头左侧或顶部相对提示层的像素偏移。 */
export interface TooltipArrowPosition {
    x?: number;
    y?: number;
}

/**
 * 将箭头对准触发元素中心，并限制在提示层边缘以内。
 * 面板本身用 CSS 相对触发元素定位，内容尺寸变化时会自动重新布局。
 */
export function getTooltipArrowPosition(
    placement: string,
    target: TooltipRect,
    panel: TooltipRect,
    arrowSize: number
): TooltipArrowPosition {
    const vertical = placement.startsWith('top') || placement.startsWith('bottom');
    const panelSize = vertical ? panel.width : panel.height;
    const targetCenter = vertical ? target.left + target.width / 2 : target.top + target.height / 2;
    const panelStart = vertical ? panel.left : panel.top;
    const inset = arrowSize;
    const max = Math.max(inset, panelSize - arrowSize - inset);
    const offset = Math.min(max, Math.max(inset, targetCenter - panelStart - arrowSize / 2));
    return vertical ? { x: offset } : { y: offset };
}
