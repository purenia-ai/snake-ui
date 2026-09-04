export function formatTime(value: string | number | Date, pattern = 'yyyy-mm-dd hh:MM:ss'): string {
  // 10 位数字/字符串按秒级时间戳处理，统一换算为毫秒
  let timeValue: string | number | Date = value;
  if ((typeof timeValue === 'number' || typeof timeValue === 'string') && String(timeValue).length === 10) {
    timeValue = Number(timeValue) * 1000;
  }
  const date = timeValue instanceof Date ? timeValue : new Date(timeValue);
  if (Number.isNaN(date.getTime())) return '';
  const parts: Record<string, string> = {
    yyyy: String(date.getFullYear()),
    mm: String(date.getMonth() + 1).padStart(2, '0'),
    dd: String(date.getDate()).padStart(2, '0'),
    hh: String(date.getHours()).padStart(2, '0'),
    MM: String(date.getMinutes()).padStart(2, '0'),
    ss: String(date.getSeconds()).padStart(2, '0'),
  };
  return pattern.replace(/yyyy|mm|dd|hh|MM|ss/g, (token) => parts[token]);
}

export { formatTime as timeFormat };
