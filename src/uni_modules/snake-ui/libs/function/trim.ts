export function trim(value: string, position: 'both' | 'left' | 'right' | 'all' = 'both'): string {
    if (position === 'left') return value.replace(/^\s+/, '');
    if (position === 'right') return value.replace(/\s+$/, '');
    if (position === 'all') return value.replace(/\s+/g, '');
    return value.trim();
}
