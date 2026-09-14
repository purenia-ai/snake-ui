import {
    provide,
    reactive,
    getCurrentInstance,
    type VNode,
    type InjectionKey,
    type VNodeNormalizedChildren,
    type ComponentPublicInstance,
    type ComponentInternalInstance
} from 'vue';

/**
 * uni-app 的小程序 Vue 运行时没有导出 `isVNode`，但 VNode 本身保持 Vue 的
 * `__v_isVNode` 标记。使用该标记避免生成对缺失运行时导出的静态导入。
 */
const isVNode = (value: unknown): value is VNode =>
    Boolean(value && typeof value === 'object' && (value as { __v_isVNode?: unknown }).__v_isVNode === true);

export function flattenVNodes(children: VNode | VNodeNormalizedChildren): VNode[] {
    const result: VNode[] = [];

    const traverse = (children: VNode | VNodeNormalizedChildren) => {
        const vNode = Array.isArray(children) ? children : [children];
        vNode.forEach(child => {
            if (Array.isArray(child)) {
                traverse(child);
            } else if (isVNode(child) && child.component?.subTree) {
                result.push(child);
                traverse(child.component.subTree);
            } else if (isVNode(child) && Array.isArray(child.children)) {
                traverse(child.children);
            } else if (isVNode(child)) {
                result.push(child);
            }
        });
    };

    traverse(children);

    return result;
}

const findVNodeIndex = (vnodes: VNode[], vnode: VNode) => {
    const index = vnodes.indexOf(vnode);
    if (index === -1) {
        // 异步渲染等场景下 vnode 引用可能已变化；带 key 时退回 type + key 匹配以保持模板顺序。
        return vnodes.findIndex(item => vnode.key !== undefined && vnode.key !== null && item.type === vnode.type && item.key === vnode.key);
    }
    return index;
};

/**
 * 注册顺序可能与渲染顺序不一致（v-for / slot / 异步渲染），按父组件 vnode 树重排，
 * 保证 children 数组与模板中的子组件顺序一致。
 */
export function sortChildren(
    parent: ComponentInternalInstance,
    publicChildren: ComponentPublicInstance[],
    internalChildren: ComponentInternalInstance[]
) {
    const vnodes = parent && parent.subTree && parent.subTree.children ? flattenVNodes(parent.subTree) : [];
    internalChildren.sort((a, b) => findVNodeIndex(vnodes, a.vnode) - findVNodeIndex(vnodes, b.vnode));

    const orderedPublicChildren = internalChildren.map(item => item.proxy!);

    publicChildren.sort((a, b) => {
        const getIndex = (comp: ComponentPublicInstance) => {
            const uid = comp.$!.uid;
            return orderedPublicChildren.findIndex(i => i.$!.uid === uid);
        };

        return getIndex(a) - getIndex(b);
    });
}

/**
 * 父组件侧的关系 hook：linkChildren 时 provide 出 link / unlink / children 集合与业务上下文，
 * 子组件经 {@link useParent} 注入。children 为公开代理数组（exposed 的 ref 已解包），
 * 并始终按模板渲染顺序排列。
 *
 * Child 为子项公开代理的业务视图（按 defineExpose 的形态声明纯接口即可）；
 * 需要自定义 Child 时两个泛型必须同时显式给出，否则 ProvideValue 推断会被关闭。
 */
export function useChildren<Child = ComponentPublicInstance, ProvideValue = never>(key: InjectionKey<ProvideValue>) {
    const publicChildren: Child[] = reactive([]);
    const internalChildren: ComponentInternalInstance[] = reactive([]);
    const parent = getCurrentInstance()!;

    const linkChildren = (value: ProvideValue = {} as ProvideValue) => {
        const link = (child: ComponentInternalInstance) => {
            if (child.proxy) {
                if (internalChildren.indexOf(child) === -1) {
                    internalChildren.push(child);
                    publicChildren.push(child.proxy as Child);
                    sortChildren(parent, publicChildren as ComponentPublicInstance[], internalChildren);
                }
            }
        };

        const unlink = (child: ComponentInternalInstance) => {
            const index = internalChildren.indexOf(child);
            // unlink 仅应由已 link 的子组件调用；未注册实例的 index 为 -1，调用方不得传入。
            publicChildren.splice(index, 1);
            internalChildren.splice(index, 1);
        };

        provide(
            key,
            Object.assign(
                {
                    link,
                    unlink,
                    children: publicChildren,
                    internalChildren
                },
                value
            )
        );
    };

    return {
        children: publicChildren,
        linkChildren
    };
}
