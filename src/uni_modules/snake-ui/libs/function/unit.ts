export type UnitValue = number | string | null | undefined;

const BARE_NUMBER_PATTERN = /^-?\d+(?:\.\d+)?$/;

/**
 * 给数值补单位：裸数字（含多值简写中的每一段）追加 unit，其余原样返回；
 * null / undefined / 空串统一归一为 "0" + unit。
 * 空值不透传，而是归零。
 */
export function addUnit(value: UnitValue = 0, unit = 'rpx'): string {
    if (value === null || value === undefined || value === '') return `0${unit}`;
    if (typeof value === 'number') return `${value}${unit}`;
    const normalized = String(value).trim();
    // 多值（空格分隔，用于 margin/padding 等简写）：逐段套用单值规则，已有单位的段保持原样。
    if (normalized.includes(' ')) {
        return normalized
            .split(/\s+/)
            .map(segment => (BARE_NUMBER_PATTERN.test(segment) ? `${segment}${unit}` : segment))
            .join(' ');
    }
    return BARE_NUMBER_PATTERN.test(normalized) ? `${normalized}${unit}` : normalized;
}

// node 直载测试等无 uni 环境返回 0，由 pxToRpx 归入非法视口兜底
function getViewportWidth(): number {
    if (typeof uni === 'undefined') return 0;
    return Number(uni.getSystemInfoSync().windowWidth);
}

/**
 * px 换算 rpx（750 设计稿基准）。
 * @param value 像素值
 * @param viewportWidth 视口宽度，默认实时读取；注入固定值便于测试与固定稿计算
 * @returns 形如 "375rpx" 的字符串；value 或视口宽度非法时返回 "0rpx"
 */
export function pxToRpx(value: UnitValue = 0, viewportWidth = getViewportWidth()): string {
    const numericValue = Number(value);
    const numericViewportWidth = Number(viewportWidth);

    if (!Number.isFinite(numericValue) || !Number.isFinite(numericViewportWidth) || numericViewportWidth <= 0) {
        return '0rpx';
    }

    return `${(numericValue * 750) / numericViewportWidth}rpx`;
}
