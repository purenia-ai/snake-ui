import { debounce } from '../function';

export function useSnakeDebounce<Args extends unknown[]>(callback: (...args: Args) => void, wait?: number) {
    return debounce(callback, wait);
}
