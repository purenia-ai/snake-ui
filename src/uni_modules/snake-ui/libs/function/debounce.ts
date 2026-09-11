/** 包装后的函数：保留原调用能力，另提供 cancel() 取消未触发的定时执行。 */
export interface CancelableFunction<Args extends unknown[]> {
    (...args: Args): void;
    cancel(): void;
}

/**
 * 防抖：wait 毫秒内只有最后一次调用生效，静默期结束后执行。
 * @param callback 目标回调，参数由包装函数透传
 * @param wait 防抖窗口，单位 ms，默认 300
 * @param immediate true 时首次调用立即执行并进入冷却，默认 false
 * @returns 带 cancel() 的包装函数
 */
export function debounce<Args extends unknown[]>(
    callback: (...args: Args) => void,
    wait = 300,
    immediate = false
): CancelableFunction<Args> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const wrapped = ((...args: Args) => {
        const callNow = immediate && !timer;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            timer = undefined;
            if (!immediate) callback(...args);
        }, wait);
        if (callNow) callback(...args);
    }) as CancelableFunction<Args>;
    wrapped.cancel = () => {
        if (timer) clearTimeout(timer);
        timer = undefined;
    };
    return wrapped;
}
