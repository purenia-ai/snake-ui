import { getCurrentInstance, nextTick, ref } from 'vue';

/**
 * useRect - 获取元素的位置信息（响应式版本，对齐 uView 生态 useRect 形态）。
 * 基础层的 function/getRect.ts 因 node 直载测试约束保持无 vue 依赖，
 * 响应式能力（rect ref + refresh）由本 hook 提供。
 * @param selector 选择器（如 #id 或 .class）
 * @param all 是否获取所有匹配元素
 * @returns rect 响应式的节点信息，refresh 主动刷新方法
 */
export function useRect(selector: string | null = null, all = false) {
    const rect = ref<any>(all ? [] : null);
    const instance = getCurrentInstance();

    async function getRect(realSelector: string | null = null, delay = 0): Promise<any> {
        const targetSelector = realSelector || selector;
        if (!targetSelector) return rect.value;
        await nextTick();
        return new Promise(resolve => {
            setTimeout(() => {
                uni.createSelectorQuery()
                    .in(instance?.proxy)
                    [all ? 'selectAll' : 'select'](targetSelector as string)
                    .boundingClientRect((res: any) => {
                        rect.value = res;
                        resolve(res);
                    })
                    .exec();
            }, delay);
        });
    }

    function refresh(selector?: string | null, delay?: number): Promise<any> {
        return getRect(selector, delay);
    }

    return {
        rect,
        getRect,
        refresh
    };
}

export default useRect;
