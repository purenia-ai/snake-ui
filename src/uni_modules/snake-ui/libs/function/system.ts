/** 获取系统信息：每次实时读取，不做缓存（窗口尺寸、主题等可能变化）。 */
export function getSystemInfo(): UniApp.GetSystemInfoResult {
    return uni.getSystemInfoSync();
}

/** sys 是 getSystemInfo 的短别名。 */
export function sys(): UniApp.GetSystemInfoResult {
    return getSystemInfo();
}

/** 当前操作系统平台（统一小写，如 'ios' / 'android' / 'devtools'）。 */
export function os(): string {
    return String(sys().platform || '').toLowerCase();
}
