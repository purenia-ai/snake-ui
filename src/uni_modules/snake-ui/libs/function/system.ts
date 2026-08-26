import { getSystemInfo } from './platform';

export function sys(): UniApp.GetSystemInfoResult {
    return getSystemInfo();
}

export function os(): string {
    return String(sys().platform || '').toLowerCase();
}
