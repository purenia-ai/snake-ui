import { ref, reactive, getCurrentInstance, onUnmounted, nextTick, computed, onMounted } from 'vue';
import { isSnakeDebugMode } from '../config/state';

/**
 * 组件父子关系注册表（对齐 uView 生态 useParent/useChildren 机制，供从 uView 移植组件直接引用）。
 * 与 snake 原生表单族的 internal/ InjectionKey 方案双轨并存：
 * internal/ 服务库内自研组件（类型更严格），本文件服务 uView 式移植组件（按组件 name 链查找 + 广播）。
 */

// 类型定义
interface ParentContext {
    name: string;
    addChild: (child: ChildContext) => void;
    removeChild: (childId: string) => void;
    broadcast: (event: string, data?: any, childIds?: string | string[]) => void;
    broadcastToChildren: (componentName: string, event: string, data?: any) => void;
    getChildren: () => ChildContext[];
    getExposed: () => Record<string, any>;
    getChildExposed: (childId: string) => Record<string, any>;
    getChildrenExposed: () => Array<{ id: string; name: string; exposed: Record<string, any> }>;
    getInstance: () => any;
}

interface ChildContext {
    id: string;
    name: string;
    getChildIndex: () => number;
    emitToParent: (event: string, data?: any) => void;
    getParentExposed: () => Record<string, any>;
    getInstance: () => any;
    getExposed: () => Record<string, any>;
}

// 符号定义
const PARENT_CONTEXT_SYMBOL = Symbol('snake_parent_context');
// 每个组件实例的 child id 缓存，避免同个组件中多次调用 useChildren 时生成不同 id
const CHILD_ID_SYMBOL = Symbol('snake_child_id');

type SnakeComponentInstance = {
    type?: { name?: string; __name?: string };
    proxy?: Record<PropertyKey, any> | null;
    exposed?: Record<string, any> | null;
    parent?: any;
    subTree?: any;
} | null;

/** 生成实例唯一ID。 */
function generateInstanceId(componentName: string): string {
    return `${componentName}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/** 查找父组件实例。 */
function findParentInstance(name: string, instance: SnakeComponentInstance): any {
    if (!instance) return null;

    let parent = instance.parent;
    while (parent) {
        const parentName = parent.type?.name || parent.type?.__name;
        if (parentName === name) {
            return parent;
        }
        parent = parent.parent;
    }
    return null;
}

/** 获取父组件上下文。 */
function getParentContext(name: string, instance: SnakeComponentInstance): ParentContext | null {
    const parentInstance = findParentInstance(name, instance);
    return parentInstance?.proxy?.[PARENT_CONTEXT_SYMBOL] || null;
}

/** 递归查找所有指定名称的子组件。 */
function findAllChildComponents(componentName: string, instance: SnakeComponentInstance): any[] {
    const components: any[] = [];

    function traverse(currentInstance: SnakeComponentInstance) {
        if (!currentInstance?.subTree) return;

        const subTree = currentInstance.subTree?.children || [];
        const children = Array.isArray(subTree) ? subTree : [subTree];

        children.forEach((vnode: any) => {
            const child = vnode.component;
            if (!child) return;

            const name = child.type?.name || child.type?.__name;
            if (name === componentName) {
                components.push(child);
            }
            traverse(child);
        });
    }

    traverse(instance);
    if (isSnakeDebugMode()) console.log(`Found ${components.length} ${componentName} components`);
    return components;
}

/**
 * 父组件 Hook：注册父上下文并收集子组件，支持向子组件广播调用其暴露方法。
 */
export function useParent(componentName?: string) {
    const instance = getCurrentInstance();
    if (!instance) {
        throw new Error('useParent must be called within setup function');
    }

    const type = instance.type as { name?: string; __name?: string };
    const name = componentName || type.name || type.__name;
    if (!name) {
        throw new Error('Component name is required for useParent');
    }

    const children = reactive<ChildContext[]>([]);
    const childrenMap = new Map<string, ChildContext>();

    const broadcast = (event: string, data?: any, childIds?: string | string[]) => {
        const targetChildren = childIds
            ? ((Array.isArray(childIds) ? childIds : [childIds])
                  .map(id => childrenMap.get(id))
                  .filter(Boolean) as ChildContext[])
            : Array.from(childrenMap.values());

        if (isSnakeDebugMode())
            console.log(`Parent ${name} broadcasting event: ${event} to ${targetChildren.length} children`);

        targetChildren.forEach(child => {
            const exposed = child.getExposed();
            if (exposed && typeof exposed[event] === 'function') {
                try {
                    exposed[event](data);
                } catch (error) {
                    if (isSnakeDebugMode('error')) console.error(`Error calling child method ${event}:`, error);
                }
            }
        });
    };

    const broadcastToChildren = (componentName: string, event: string, data?: any) => {
        if (isSnakeDebugMode())
            console.log(`Parent ${name} broadcasting event: ${event} to all ${componentName} components`);

        const childComponents = findAllChildComponents(componentName, instance as SnakeComponentInstance);
        let successCount = 0;

        childComponents.forEach(childComponent => {
            const exposed = childComponent.exposed || childComponent.proxy;
            if (exposed && typeof exposed[event] === 'function') {
                try {
                    exposed[event](data);
                    successCount++;
                } catch (error) {
                    if (isSnakeDebugMode('error')) console.error(`Error calling ${componentName} method ${event}:`, error);
                }
            }
        });

        if (isSnakeDebugMode())
            console.log(
                `Parent ${name} successfully called ${successCount} of ${childComponents.length} ${componentName} components`
            );
    };

    const parentContext: ParentContext = {
        name,
        addChild(child: ChildContext) {
            if (!childrenMap.has(child.id)) {
                childrenMap.set(child.id, child);
                children.push(child);
                if (isSnakeDebugMode()) console.log(`Parent ${name} added child: ${child.name}`);
            }
        },
        removeChild(childId: string) {
            if (childrenMap.has(childId)) {
                childrenMap.delete(childId);
                const index = children.findIndex(c => c.id === childId);
                if (index > -1) children.splice(index, 1);
                if (isSnakeDebugMode()) console.log(`Parent ${name} removed child: ${childId}`);
            }
        },
        broadcast,
        broadcastToChildren,
        getChildren: () => Array.from(childrenMap.values()),
        getExposed: () => instance.exposed || {},
        getChildExposed(childId: string) {
            const child = childrenMap.get(childId);
            return child?.getExposed?.() || {};
        },
        getChildrenExposed() {
            return Array.from(childrenMap.values())
                .filter(child => child.getExposed)
                .map(child => ({
                    id: child.id,
                    name: child.name,
                    exposed: child.getExposed()
                }))
                .filter(item => Object.keys(item.exposed).length > 0);
        },
        getInstance: () => instance
    };

    if (instance.proxy) {
        (instance.proxy as any)[PARENT_CONTEXT_SYMBOL] = parentContext;
    }

    onUnmounted(() => {
        childrenMap.forEach((_, childId) => parentContext.removeChild(childId));
        if (instance.proxy) {
            delete (instance.proxy as any)[PARENT_CONTEXT_SYMBOL];
        }
        if (isSnakeDebugMode()) console.log(`Parent ${name} unmounted and cleaned up`);
    });

    return {
        parentName: name,
        children,
        broadcast,
        broadcastToChildren,
        getChildren: parentContext.getChildren,
        getChildExposed: parentContext.getChildExposed,
        getChildrenExposed: parentContext.getChildrenExposed,
        getExposed: parentContext.getExposed,
        getInstance: parentContext.getInstance
    };
}

/**
 * 子组件 Hook：向上查找父上下文并注册自身，支持向父组件发射方法调用。
 * 挂载时自动重试链接（onMounted + nextTick + 500ms 兜底）。
 */
export function useChildren(componentName?: string, parentName?: string) {
    const instance = getCurrentInstance();
    if (!instance) {
        throw new Error('useChildren must be called within setup function');
    }

    const type = instance.type as { name?: string; __name?: string };
    const name = componentName || type.name || type.__name;
    // 尝试从实例上复用已有的 child id，避免同个组件内多次调用 useChildren 导致重复注册
    let instanceId: string | undefined = (instance.proxy as any)?.[CHILD_ID_SYMBOL];
    if (!instanceId) {
        instanceId = generateInstanceId(name || 'anonymous');
        if (instance.proxy) (instance.proxy as any)[CHILD_ID_SYMBOL] = instanceId;
    }
    const parentRef = ref<any | null>(null);
    const parentExposed = ref<Record<string, any>>({});

    const createSimulatedParentContext = (parentInstance: any): ParentContext => ({
        name: parentInstance?.type?.name || parentInstance?.type?.__name || 'unknown',
        addChild: () => isSnakeDebugMode() && console.log('Simulated parent added child'),
        removeChild: () => isSnakeDebugMode() && console.log('Simulated parent removed child'),
        broadcast: () => isSnakeDebugMode() && console.log('Simulated parent broadcasting'),
        broadcastToChildren: () => isSnakeDebugMode() && console.log('Simulated parent broadcasting to children'),
        getChildren: () => [],
        getExposed: () => parentInstance?.exposed || {},
        getChildExposed: () => ({}),
        getChildrenExposed: () => [],
        getInstance: () => parentInstance
    });

    const getParentExposed = (): Record<string, any> => {
        if (parentRef.value) {
            const exposed = parentRef.value.getExposed();
            parentExposed.value = exposed;
            return exposed;
        }
        return {};
    };

    const getExposed = (): Record<string, any> => instance.exposed || {};

    const findParent = (): ParentContext | null => {
        if (parentName) {
            const parentContext = getParentContext(parentName, instance as SnakeComponentInstance);
            if (parentContext) {
                if (!parentContext.getInstance) {
                    parentContext.getInstance = () => findParentInstance(parentName, instance as SnakeComponentInstance);
                }
                return parentContext;
            }

            const parentInstance = findParentInstance(parentName, instance as SnakeComponentInstance);
            if (parentInstance) {
                return createSimulatedParentContext(parentInstance);
            }
        }

        let current = instance.parent as SnakeComponentInstance;
        while (current) {
            const context = (current.proxy as any)?.[PARENT_CONTEXT_SYMBOL];
            if (context) {
                if (!context.getInstance) {
                    context.getInstance = () => current;
                }
                return context;
            }
            current = current.parent;
        }

        return instance.parent ? createSimulatedParentContext(instance.parent) : null;
    };

    const linkParent = (): boolean => {
        const parent = findParent();
        if (parent) {
            parentRef.value = parent;
            if (parent.addChild && childContext) {
                parent.addChild(childContext);
            }
            getParentExposed();
            if (isSnakeDebugMode()) console.log(`Child ${name || 'anonymous'} linked to parent ${parent.name}`);
            return true;
        }
        if (isSnakeDebugMode()) console.log(`Child ${name || 'anonymous'} no parent found, working in standalone mode`);
        return false;
    };

    const emitToParent = (event: string, data?: any) => {
        if (parentRef.value) {
            const exposed = getParentExposed();
            if (exposed && typeof exposed[event] === 'function') {
                try {
                    exposed[event](data, instanceId, name);
                } catch (error) {
                    if (isSnakeDebugMode('error')) console.error(`Error calling parent method ${event}:`, error);
                }
            }
        }
    };

    const getChildIndex = () => {
        if (!parentRef.value) return -1;
        try {
            const children = parentRef.value.getChildren();
            return children.findIndex((child: ChildContext) => child.id === instanceId);
        } catch {
            return -1;
        }
    };

    const childContext: ChildContext = {
        id: instanceId,
        name: name || 'anonymous',
        getChildIndex,
        emitToParent,
        getParentExposed,
        getInstance: () => instance,
        getExposed
    };

    if (isSnakeDebugMode()) console.log(`Child ${name || 'anonymous'} registered, looking for parent`);

    onMounted(() => {
        const connected = linkParent();
        nextTick(() => {
            const reconnected = linkParent();
            if (!connected && !reconnected) {
                setTimeout(linkParent, 500);
            }
        });
    });

    onUnmounted(() => {
        if (parentRef.value?.removeChild) {
            parentRef.value.removeChild(instanceId);
        }
        if (isSnakeDebugMode()) console.log(`Child ${name || 'anonymous'} unmounted`);
    });

    return {
        childId: instanceId,
        childName: name || 'anonymous',
        childIndex: computed(getChildIndex),
        parent: parentRef,
        emitToParent,
        getParentExposed,
        parentExposed: computed(() => parentExposed.value),
        getExposed
    };
}

/**
 * 检查父组件是否存在。
 */
export function hasParent(parentName?: string): boolean {
    const instance = getCurrentInstance();
    if (!instance) return false;

    if (parentName) {
        return getParentContext(parentName, instance as SnakeComponentInstance) !== null;
    }

    let current = instance.parent as SnakeComponentInstance;
    while (current) {
        if ((current.proxy as any)?.[PARENT_CONTEXT_SYMBOL]) return true;
        current = current.parent;
    }
    return false;
}

/**
 * 获取父组件上下文。
 */
export function getParentContextByName(parentName: string): ParentContext | null {
    const instance = getCurrentInstance();
    return instance ? getParentContext(parentName, instance as SnakeComponentInstance) : null;
}

/**
 * 热更新清理函数。
 */
export function cleanupComponentRelations(): void {
    if (isSnakeDebugMode()) console.log('Cleaning up component relations for hot reload');
}

// 热更新处理（仅 H5 vite 环境存在）
if (import.meta.hot) {
    import.meta.hot.accept(() => {
        if (isSnakeDebugMode()) console.log('Hot reload detected, relations will be automatically reconnected');
    });
}

export default {
    useParent,
    useChildren,
    hasParent,
    getParentContextByName,
    cleanupComponentRelations
};
