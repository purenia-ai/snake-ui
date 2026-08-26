import { getRect } from '../function/platform';

export function useSnakeRect(instance?: unknown) {
    return { getRect: (selector: string) => getRect(selector, instance) };
}
