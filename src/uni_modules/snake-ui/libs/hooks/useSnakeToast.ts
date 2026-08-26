import { toast } from '../function/platform';

export function useSnakeToast() {
    return { show: toast };
}
