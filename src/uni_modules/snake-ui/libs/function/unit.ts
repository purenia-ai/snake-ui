export type UnitValue = number | string | null | undefined;

const BARE_NUMBER_PATTERN = /^-?\d+(?:\.\d+)?$/;

/**
 * 给数值补单位：裸数字（含多值简写中的每一段）追加 unit，其余原样返回；
 * null / undefined / 空串统一归一为 "0" + unit。
 * 空值不透传，而是归零。
 *
 * 0.0.6 起默认单位由 rpx 改为 px（375 设计稿基准）：传给本库组件的裸数字
 * 一律按 375 稿 px 解释，与库内样式单位一致。
 */
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

/**
 * 尺寸值解析为 px 数值，供参与几何运算的属性使用（滑块偏移、画布尺寸、高度比较等）：
 * 裸数字与 px 后缀取数值本身（库口径为 375 稿 px），rpx 后缀按当前视口换算，
 * 无 uni 环境（node 直载测试）按 1rpx = 0.5px 折算；非法值归 0。
 * 此前组件内直接 Number(props.x) 参与运算，传入 "50rpx" 会得到 NaN 并使
 * transform / 画布尺寸整体失效，本函数即为其统一替代。
 */
export function unitToPx(value: UnitValue = 0): number {
    if (value === null || value === undefined || value === '') return 0;
    const normalized = String(value).trim();
    const numericValue = Number.parseFloat(normalized);
    if (!Number.isFinite(numericValue)) return 0;
    if (/rpx$/i.test(normalized)) {
        if (typeof uni !== 'undefined' && typeof uni.upx2px === 'function') {
            const converted = Number(uni.upx2px(numericValue));
            return Number.isFinite(converted) ? converted : numericValue / 2;
        }
        return numericValue / 2;
    }
    return numericValue;
}

// node 直载测试等无 uni 环境返回 0，由 pxToRpx 归入非法视口兜底
function getViewportWidth(): number {
    if (typeof uni === 'undefined') return 0;
    return Number(uni.getSystemInfoSync().windowWidth);
}

/**
 * v1 CMS 存量数据换算：旧数据里的尺寸数字按 750 设计稿 rpx 语义存储，
 * 渲染层调用本函数还原为 rpx 输出——与旧版行为完全一致：随屏宽等比缩放、
 * 并遵守 pages.json 的 rpxCalcMaxDeviceWidth（宽屏冻结为手机比例）。
 * 375 宽视口下 1rpx = 0.5px，即渲染结果等于 value/2 px。
 * @param value 750 稿 rpx 数值（裸数字或数字字符串）
 * @returns 形如 "30rpx" 的 rpx 字符串；空值归 "0rpx"，已带单位的字符串原样返回
 */
export function from750(value: UnitValue = 0): string {
    return addUnit(value, 'rpx');
}

/**
 * v1 CMS 存量数据换算（375 稿 px 语义字段，如 magiccube heights / pictureads height）：
 * 旧版这些字段经 pxToRpx 自补偿，实际物理高度恒定、按屏宽等比；库迁移到 375 稿 px 后，
 * 渲染层用本函数还原同样的等比行为（value × 2 rpx）。
 * @param value 375 稿 px 数值（裸数字或数字字符串）
 * @returns 形如 "30rpx" 的 rpx 字符串（value=15 时）；空值归 "0rpx"，已带单位的字符串原样返回
 */
export function from375(value: UnitValue = 0): string {
    if (value === null || value === undefined || value === '') return '0rpx';
    const numericValue = typeof value === 'number' ? value : Number(String(value).trim());
    return Number.isFinite(numericValue) ? `${numericValue * 2}rpx` : String(value);
}

/**
 * px 换算 rpx（750 设计稿基准）。
 * @deprecated 0.0.6 起库内单位为 375 稿 px，新增代码请勿使用；仅存量调用与
 * v1 CMS 兼容期间保留。
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
