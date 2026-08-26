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

export function formatName(value: string): string {
    if (value.length <= 1) return value;
    if (value.length === 2) return `${value[0]}*`;
    return `${value[0]}${'*'.repeat(value.length - 2)}${value.at(-1)}`;
}
