export type SelectorRect = UniApp.NodeInfo & { width: number; height: number; top: number; left: number };

/**
 * 查询节点布局信息（boundingClientRect）。
 * 查不到节点不 reject：单值返回全 0 兜底 rect，all=true 返回空数组，调用方无需判空。
 * @param selector CSS 选择器
 * @param instance 组件实例（自动取 .proxy）或上下文对象；不传则页面级查询
 * @param all 是否查询全部匹配节点（返回数组）
 */
export function getRect(selector: string, instance?: unknown, all?: false): Promise<SelectorRect>;
export function getRect(selector: string, instance: unknown | undefined, all: true): Promise<SelectorRect[]>;
export function getRect(selector: string, instance?: unknown, all = false): Promise<SelectorRect | SelectorRect[]> {
    return new Promise(resolve => {
        let query = uni.createSelectorQuery();
        // instance 可能是组件实例（取 .proxy）也可能是上下文对象；部分平台无 query.in，降级为页面级查询
        const target = (instance as { proxy?: unknown } | undefined)?.proxy ?? instance;
        if (target && typeof query.in === 'function') query = query.in(target);
        const builder = all ? query.selectAll(selector) : query.select(selector);
        builder
            .boundingClientRect(rect =>
                resolve(
                    all
                        ? ((rect || []) as SelectorRect[])
                        : ((rect || { width: 0, height: 0, top: 0, left: 0 }) as SelectorRect)
                )
            )
            .exec();
    });
}
