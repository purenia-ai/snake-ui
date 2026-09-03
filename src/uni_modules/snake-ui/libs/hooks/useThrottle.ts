import { throttle } from '../function';

export function useThrottle<Args extends unknown[]>(callback: (...args: Args) => void, wait?: number) {
    return throttle(callback, wait);
}
