/**
 * 去除字符串空格。
 * @param value 输入字符串
 * @param position 去除位置：'both'（默认）| 'left' | 'right' | 'all'
 */
export function trim(value: string, position: 'both' | 'left' | 'right' | 'all' = 'both'): string {
    if (position === 'left') return value.replace(/^\s+/, '');
    if (position === 'right') return value.replace(/\s+$/, '');
    if (position === 'all') return value.replace(/\s+/g, '');
    return value.trim();
}
