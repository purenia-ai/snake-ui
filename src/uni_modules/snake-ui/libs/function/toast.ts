export function toast(title: string, duration = 2000): void {
  if (!title) return;
  uni.showToast({ title, icon: 'none', duration });
}
