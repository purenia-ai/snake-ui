/**
 * 滑动操作项的全局展开登记。
 *
 * 「同一时刻只允许一项停留展开态」需要跨实例通信，父级组件无处安放这个状态，
 * 因此用模块级登记表：每个实例在展开时登记自己的收起函数，展开新项前先收起
 * 其他已登记项。登记表不持有响应式数据，避免跨实例的额外渲染。
 */
const openedCollapsers = new Set<() => void>();

/** 登记一个已展开项。 */
export function registerOpened(collapse: () => void) {
    openedCollapsers.add(collapse);
}

/** 注销登记（收起或卸载时调用）。 */
export function unregisterOpened(collapse: () => void) {
    openedCollapsers.delete(collapse);
}

/**
 * 收起除调用者以外的所有已展开项。
 * 先复制快照再逐个收起：每个实例收起时会同步注销自己，直接遍历 Set 会跳过相邻项。
 */
export function closeOtherOpened(collapse: () => void) {
    for (const other of [...openedCollapsers]) {
        if (other !== collapse) other();
    }
}
