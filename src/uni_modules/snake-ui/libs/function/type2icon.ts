/**
 * 语义类型 → 图标名，供 toast / modal 等结果类组件取配套图标；
 * 未识别的 type 落到 info-circle。
 * 注意 warning 映射为 'warning'，与 uView 的 'error-circle' 不同。
 */
export function type2icon(type: string): string {
    return (
        (
            { success: 'checkmark-circle', warning: 'warning', error: 'close-circle', info: 'info-circle' } as Record<
                string,
                string
            >
        )[type] || 'info-circle'
    );
}
