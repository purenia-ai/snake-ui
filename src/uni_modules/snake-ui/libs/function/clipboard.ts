/**
 * 复制文本到剪贴板（Promise 版）：成功 resolve，平台无该 API 或调用失败 reject。
 * 不接管提示——小程序端由 uni 默认行为弹「已复制」。
 */
export function clipboard(value: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (typeof uni === 'undefined' || typeof uni.setClipboardData !== 'function') {
            reject(new Error('[Snake UI] clipboard is unavailable on this platform.'));
            return;
        }
        uni.setClipboardData({ data: value, success: () => resolve(), fail: reject });
    });
}
