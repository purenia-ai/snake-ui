export type SelectorRect = UniApp.NodeInfo & { width: number; height: number; top: number; left: number };

export function getRect(selector: string, instance?: unknown): Promise<SelectorRect> {
  return new Promise((resolve) => {
    let query = uni.createSelectorQuery();
    const target = (instance as { proxy?: unknown } | undefined)?.proxy ?? instance;
    if (target && typeof query.in === 'function') query = query.in(target);
    query
      .select(selector)
      .boundingClientRect((rect) => resolve((rect || { width: 0, height: 0, top: 0, left: 0 }) as SelectorRect))
      .exec();
  });
}
