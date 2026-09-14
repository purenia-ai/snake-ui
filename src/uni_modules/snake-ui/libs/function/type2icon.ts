/**
 * 语义类型 → 图标名，供 toast / modal 等结果类组件取配套图标；
 * 未识别的 type 落到 info-circle。
 * warning 映射为 'warning'。
 */
export function type2icon(type: string): string {
    return (
        ({ success: 'checkmark-circle', warning: 'warning', error: 'close-circle', info: 'info-circle' } as Record<string, string>)[type] ||
        'info-circle'
    );
}
