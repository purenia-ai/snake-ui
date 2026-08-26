export function clipboard(value: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (typeof uni === 'undefined' || typeof uni.setClipboardData !== 'function') {
            reject(new Error('[Snake UI] clipboard is unavailable on this platform.'));
            return;
        }
        uni.setClipboardData({ data: value, success: () => resolve(), fail: reject });
    });
}
