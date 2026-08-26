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
