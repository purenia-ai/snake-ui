import type { CancelableFunction } from './debounce';

/**
 * 节流：wait 窗口内最多执行一次，且窗口结束时会补发最后一次尾随调用，
 * 保证「最后一次触发不丢」（uView 版本没有尾随保证）。
 * @param callback 目标回调，参数由包装函数透传
 * @param wait 节流窗口，单位 ms，默认 300
 * @returns 带 cancel() 的包装函数；cancel 同时重置计时基准
 */
export function throttle<Args extends unknown[]>(
    callback: (...args: Args) => void,
    wait = 300
): CancelableFunction<Args> {
    let lastCall = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const wrapped = ((...args: Args) => {
        const remaining = wait - (Date.now() - lastCall);
        if (remaining <= 0) {
            if (timer) clearTimeout(timer);
            timer = undefined;
            lastCall = Date.now();
            callback(...args);
            return;
        }
        if (!timer) {
            timer = setTimeout(() => {
                timer = undefined;
                lastCall = Date.now();
                callback(...args);
            }, remaining);
        }
    }) as CancelableFunction<Args>;
    wrapped.cancel = () => {
        if (timer) clearTimeout(timer);
        timer = undefined;
        lastCall = 0;
    };
    return wrapped;
}
