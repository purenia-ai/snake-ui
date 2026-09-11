/**
 * 生成带前缀的轻量唯一 id：`前缀-时间戳36进制-随机串`。
 * 时间戳保证趋势递增，随机段兜底同毫秒碰撞，适合做组件内部 key、
 * v-for 列表 id（避免用 index 导致复用错乱）。
 * 非加密强度，勿用于令牌等安全场景。
 * @param prefix id 前缀，默认 'snake'
 */
export function guid(prefix = 'snake'): string {
    const random = Math.random().toString(36).slice(2, 10);
    return `${prefix}-${Date.now().toString(36)}-${random}`;
}
