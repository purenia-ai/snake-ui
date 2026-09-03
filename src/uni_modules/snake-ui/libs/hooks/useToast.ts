import { toast } from '../function/platform';

export function useToast() {
    return { show: toast };
}
