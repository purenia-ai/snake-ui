import { throttle } from '../function';

export function useSnakeThrottle<Args extends unknown[]>(callback: (...args: Args) => void, wait?: number) {
    return throttle(callback, wait);
}
