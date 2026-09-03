export type UnitValue = number | string | null | undefined;

const BARE_NUMBER_PATTERN = /^-?\d+(?:\.\d+)?$/;

export function addUnit(value: UnitValue = 0, unit = 'px'): string {
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

function getViewportWidth(): number {
  if (typeof uni === 'undefined') return 0;
  return Number(uni.getSystemInfoSync().windowWidth);
}

export function pxToRpx(value: UnitValue = 0, viewportWidth = getViewportWidth()): string {
  const numericValue = Number(value);
  const numericViewportWidth = Number(viewportWidth);

  if (!Number.isFinite(numericValue) || !Number.isFinite(numericViewportWidth) || numericViewportWidth <= 0) {
    return '0rpx';
  }

  return `${(numericValue * 750) / numericViewportWidth}rpx`;
}
