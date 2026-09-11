import {
    ref,
    shallowRef,
    inject,
    computed,
    onUnmounted,
    onMounted,
    getCurrentInstance,
    type InjectionKey,
    type ComponentPublicInstance,
    type ComponentInternalInstance,
    type Ref,
    type ShallowRef
} from 'vue';

/**
 * useChildren 的 linkChildren 在业务上下文之外附加的注册通道，
 * 子侧经 inject 拿到的实际形态。
 */
export type RelationParent<T> = T & {
    children: ComponentPublicInstance[];
    link(child: ComponentInternalInstance): void;
    unlink(child: ComponentInternalInstance): void;
    internalChildren: ComponentInternalInstance[];
};

type UseParentResult<T> = {
    parent: ShallowRef<RelationParent<T> | null>;
    index: Ref<number>;
};

/**
 * 子组件侧的关系 hook：按 InjectionKey 注入父上下文，自动注册 / 注销自身，
 * 并暴露响应式下标。配套 {@link useChildren} 使用（provide/inject 底座）。
 * 参数须保持裸 `InjectionKey<T>` 形态，嵌套泛型会让 T 推断失效。
 */
export function useParent<T>(key: InjectionKey<T>): UseParentResult<T> {
    const result: UseParentResult<T> = {
        parent: shallowRef<RelationParent<T> | null>(null),
        index: ref<number>(-1)
    };
    // #ifdef MP-TOUTIAO
    onMounted(() => {
        // #endif
        // 注入值在运行时携带 link / unlink（见 useChildren.linkChildren），此处按 RelationParent 视图读取
        result.parent.value = inject<RelationParent<T> | null>(key, null);

        if (result.parent.value) {
            const instance = getCurrentInstance()!;
            const { link, unlink, internalChildren } = result.parent.value;

            link(instance);
            onUnmounted(() => unlink(instance));

            result.index = computed(() => internalChildren.indexOf(instance));
        }
        // #ifdef MP-TOUTIAO
    });
    // #endif

    return result;
}
