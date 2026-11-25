/**
 * snake-image-cropper 的几何层。
 *
 * 全部是纯函数，不引用 `uni` 与 Vue：裁剪框计算、铺满尺寸、缩放与位置约束都在这里，
 * 组件只负责把它们接到手势和 canvas 上。这样几何逻辑可以脱离运行时直接做数值断言。
 *
 * 坐标系约定：`left` / `top` 是**图片中心点相对裁剪框左上角**的偏移，
 * 裁剪框自身的原点为 `(0, 0)`，右下角为 `(cutWidth, cutHeight)`。
 */

/** 裁剪框矩形（px，相对舞台左上角）。 */
export interface CropperRect {
    /** 宽。 */ width: number;
    /** 高。 */ height: number;
    /** 距舞台左侧。 */ left: number;
    /** 距舞台顶部。 */ top: number;
}

/** 图片基准尺寸与铺满裁剪框所需的缩放。 */
export interface CropperPlacement {
    /** 缩放前的宽度。 */ width: number;
    /** 缩放前的高度。 */ height: number;
    /** 恰好覆盖裁剪框的缩放倍数。 */ scale: number;
}

export interface ComputeCutRectOptions {
    /** 舞台宽度。 */ width: number;
    /** 舞台高度。 */ height: number;
    /** 舞台内边距。 */ gap: number;
    /** 宽高比，`宽:高` 或 `宽/高`。 */ aspectRatio: string;
}

export interface ResolveInitialPlacementOptions {
    /** 原图宽度。 */ imageWidth: number;
    /** 原图高度。 */ imageHeight: number;
    /** 裁剪框宽。 */ cutWidth: number;
    /** 裁剪框高。 */ cutHeight: number;
    /** 显式指定的初始宽度，数字按 px、字符串支持 `%`。 */ imgWidth?: number | string;
    /** 显式指定的初始高度，规则同上。 */ imgHeight?: number | string;
    /** 用于把 `%` 折算成 px 的视口宽度。 */ viewportWidth: number;
    /** 用于把 `%` 折算成 px 的视口高度。 */ viewportHeight: number;
}

export interface RotateOptions {
    /** 原始宽。 */ width: number;
    /** 原始高。 */ height: number;
    /** 旋转角度（度）。 */ angle: number;
}

export interface ClampScaleOptions extends RotateOptions {
    /** 期望的缩放倍数。 */ scale: number;
    /** 裁剪框宽。 */ cutWidth: number;
    /** 裁剪框高。 */ cutHeight: number;
}

export interface ClampPositionOptions extends ClampScaleOptions {
    /** 期望的中心点 X（相对裁剪框左侧）。 */ left: number;
    /** 期望的中心点 Y（相对裁剪框顶部）。 */ top: number;
}

/** 坐标点。 */
export interface CropperPoint {
    x: number;
    y: number;
}

/**
 * 解析宽高比。
 * 支持 `1:1`、`16:9`、`4/3` 三种写法；切分后任一段不是有限正数时回退 `1`（正方形），
 * 避免 `NaN` 顺着裁剪框尺寸一路污染成整层空白。
 */
export function parseAspectRatio(value: string): number {
    if (!value) return 1;
    const [rawWidth, rawHeight] = String(value).split(/[:/]/);
    const widthRatio = Number(rawWidth);
    const heightRatio = Number(rawHeight);
    if (!Number.isFinite(widthRatio) || !Number.isFinite(heightRatio)) return 1;
    if (widthRatio <= 0 || heightRatio <= 0) return 1;
    return widthRatio / heightRatio;
}

/**
 * 在舞台内按宽高比取最大内接矩形并居中。
 * 先按宽度铺满，高度放不下时再按高度收缩；舞台比内边距还小时返回全零矩形。
 */
export function computeCutRect(options: ComputeCutRectOptions): CropperRect {
    const stageWidth = Math.max(Number(options.width) || 0, 0);
    const stageHeight = Math.max(Number(options.height) || 0, 0);
    const gap = Math.max(Number(options.gap) || 0, 0);
    const maxWidth = stageWidth - gap * 2;
    const maxHeight = stageHeight - gap * 2;

    if (maxWidth <= 0 || maxHeight <= 0) return { width: 0, height: 0, left: 0, top: 0 };

    const ratio = parseAspectRatio(options.aspectRatio);
    let width = maxWidth;
    let height = width / ratio;
    if (height > maxHeight) {
        height = maxHeight;
        width = height * ratio;
    }

    return {
        width,
        height,
        left: (stageWidth - width) / 2,
        top: (stageHeight - height) / 2
    };
}

/**
 * 把 `imgWidth` / `imgHeight` 归一成 px。
 * 数字按 px；字符串支持 `%`（按传入的基准长度折算）与 `px` 后缀；
 * 其余单位（如 `rpx`）在当前实现里无法脱离运行时换算，按「未指定」处理，回落到铺满逻辑。
 */
function toExplicitPx(value: number | string | undefined, basis: number): number {
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'number') return Number.isFinite(value) && value > 0 ? value : 0;
    const normalized = String(value).trim();
    const numeric = Number.parseFloat(normalized);
    if (!Number.isFinite(numeric) || numeric <= 0) return 0;
    if (/%$/.test(normalized)) return (Math.max(Number(basis) || 0, 0) * numeric) / 100;
    if (/^-?\d+(?:\.\d+)?(?:px)?$/i.test(normalized)) return numeric;
    return 0;
}

/**
 * 计算图片的基准尺寸与铺满裁剪框所需的缩放。
 *
 * - 显式 `imgWidth` / `imgHeight` 优先，缺一边时按原图比例补另一边。
 * - 都不给时取「恰好覆盖裁剪框」的尺寸：宽图以高为准，高图以宽为准。
 * - 返回值一定满足 `width * scale >= cutWidth` 且 `height * scale >= cutHeight`。
 */
export function resolveInitialPlacement(options: ResolveInitialPlacementOptions): CropperPlacement {
    const imageWidth = Math.max(Number(options.imageWidth) || 0, 0);
    const imageHeight = Math.max(Number(options.imageHeight) || 0, 0);
    const cutWidth = Math.max(Number(options.cutWidth) || 0, 0);
    const cutHeight = Math.max(Number(options.cutHeight) || 0, 0);
    if (imageWidth <= 0 || imageHeight <= 0 || cutWidth <= 0 || cutHeight <= 0) {
        return { width: 0, height: 0, scale: 1 };
    }

    const explicitWidth = toExplicitPx(options.imgWidth, options.viewportWidth);
    const explicitHeight = toExplicitPx(options.imgHeight, options.viewportHeight);
    const imageRatio = imageWidth / imageHeight;

    let width: number;
    let height: number;
    if (explicitWidth > 0) {
        width = explicitWidth;
        height = explicitHeight > 0 ? explicitHeight : width / imageRatio;
    } else if (explicitHeight > 0) {
        height = explicitHeight;
        width = height * imageRatio;
    } else if (imageRatio > cutWidth / cutHeight) {
        height = cutHeight;
        width = height * imageRatio;
    } else {
        width = cutWidth;
        height = width / imageRatio;
    }

    const scale = Math.max(cutWidth / width, cutHeight / height);
    return { width, height, scale };
}

/**
 * 旋转 90/270 度时宽高互换，返回参与几何计算的边长。
 * 角度先归整到 90 的倍数再做奇偶判断，`-270` 这类负角度同样成立。
 */
export function rotatedSize(options: RotateOptions): { width: number; height: number } {
    const width = Math.max(Number(options.width) || 0, 0);
    const height = Math.max(Number(options.height) || 0, 0);
    const angle = Number(options.angle) || 0;
    const turns = ((Math.round(angle / 90) % 4) + 4) % 4;
    const exchanged = turns % 2 === 1;
    return exchanged ? { width: height, height: width } : { width, height };
}

/**
 * 缩放下限约束：旋转与缩放之后必须仍然覆盖裁剪框。
 * 只保证「不小于铺满」，上限（`max-scale`）由调用方先截断——顺序反了会把图片缩到露白。
 */
export function clampScale(options: ClampScaleOptions): number {
    const requested = Number(options.scale);
    const scale = Number.isFinite(requested) && requested > 0 ? requested : 1;
    const size = rotatedSize({ width: options.width, height: options.height, angle: options.angle });
    if (size.width <= 0 || size.height <= 0) return scale;

    const cutWidth = Math.max(Number(options.cutWidth) || 0, 0);
    const cutHeight = Math.max(Number(options.cutHeight) || 0, 0);
    return Math.max(scale, cutWidth / size.width, cutHeight / size.height);
}

/** 单个轴向的位置约束；图片不足覆盖时退化为居中，绝不返回反向区间。 */
function clampAxis(value: number, span: number, half: number): number {
    const spanSize = Math.max(Number(span) || 0, 0);
    const halfSize = Math.max(Number(half) || 0, 0);
    const min = spanSize - halfSize;
    const max = halfSize;
    if (min > max) return spanSize / 2;
    const requested = Number.isFinite(value) ? value : spanSize / 2;
    return Math.min(Math.max(requested, min), max);
}

/** 约束图片中心点，使裁剪框内不出现空白。 */
export function clampPosition(options: ClampPositionOptions): { left: number; top: number } {
    const size = rotatedSize({ width: options.width, height: options.height, angle: options.angle });
    const requested = Number(options.scale);
    const scale = Number.isFinite(requested) && requested > 0 ? requested : 1;
    const halfWidth = (size.width * scale) / 2;
    const halfHeight = (size.height * scale) / 2;

    return {
        left: clampAxis(options.left, options.cutWidth, halfWidth),
        top: clampAxis(options.top, options.cutHeight, halfHeight)
    };
}

/** 两点距离，用于双指缩放。 */
export function touchDistance(a: CropperPoint, b: CropperPoint): number {
    const deltaX = (Number(a?.x) || 0) - (Number(b?.x) || 0);
    const deltaY = (Number(a?.y) || 0) - (Number(b?.y) || 0);
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}
