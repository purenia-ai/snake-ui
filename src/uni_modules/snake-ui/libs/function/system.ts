export function getSystemInfo(): UniApp.GetSystemInfoResult {
  return uni.getSystemInfoSync();
}

export function sys(): UniApp.GetSystemInfoResult {
  return getSystemInfo();
}

export function os(): string {
  return String(sys().platform || '').toLowerCase();
}
