export interface CancelableFunction<Args extends unknown[]> {
    (...args: Args): void;
    cancel(): void;
}

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
