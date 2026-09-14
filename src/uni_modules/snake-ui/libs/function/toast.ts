/**
 * 无图标 toast（icon: 'none'，最多展示两行）。
 * 默认时长 2000ms，不支持传 icon / 配置对象。
 * @param title 提示文案；空值静默忽略
 * @param duration 展示时长，单位 ms
 */
export function toast(title: string, duration = 2000): void {
    if (!title) return;
    uni.showToast({ title, icon: 'none', duration });
}
