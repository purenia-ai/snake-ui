import type { CancelableFunction } from './debounce';

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
