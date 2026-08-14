export type UnitValue = number | string | null | undefined;

export function addUnit(value: UnitValue = 0, unit = 'px'): string {
  if (value === null || value === undefined || value === '') return `0${unit}`;
  if (typeof value === 'number') return `${value}${unit}`;
  const normalized = String(value).trim();
  return /^-?\d+(?:\.\d+)?$/.test(normalized) ? `${normalized}${unit}` : normalized;
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
