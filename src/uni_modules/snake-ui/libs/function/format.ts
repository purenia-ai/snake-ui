/**
 * 价格格式化：剥离非数字字符后按 decimals 保留小数、整数部分加千分位；
 * 非有限数值按 0 处理。
 * @param value 数字或数字字符串
 * @param decimals 小数位数，默认 0
 * @param decimalPoint 小数点符号，默认 '.'
 * @param thousandsSeparator 千分位符号，默认 ','
 */
export function formatPrice(
    value: string | number,
    decimals = 0,
    decimalPoint = '.',
    thousandsSeparator = ','
): string {
    const numeric = Number(String(value).replace(/[^0-9+\-Ee.]/g, ''));
    const safe = Number.isFinite(numeric) ? numeric : 0;
    const fixed = safe.toFixed(Math.max(0, decimals)).split('.');
    fixed[0] = fixed[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
    return fixed.join(decimalPoint);
}

/** 姓名脱敏：单字原样，两字保首打 *，三字以上首尾保留、中间打 *。 */
export function formatName(value: string): string {
    if (value.length <= 1) return value;
    if (value.length === 2) return `${value[0]}*`;
    return `${value[0]}${'*'.repeat(value.length - 2)}${value.at(-1)}`;
}
