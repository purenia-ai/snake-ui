// 获取父组件的参数，因为支付宝小程序不支持 provide/inject 的写法
// this.$parent 在非 H5 中可以准确获取到父组件，但在 H5 中需要多层 this.$parent.$parent.xxx
interface SnakeVueInstance {
    $parent?: SnakeVueInstance;
    $options?: { name?: string };
    [key: string]: any;
}

/**
 * 沿 $parent 链查找指定 name 的父组件并按 keys 取参。
 * @param this 当前组件实例（Options API 调用方用 getParent.call(this, ...)）
 * @param name 父组件 name
 * @param keys 需要获取的参数名数组或对象；对象形态时子组件已有值优先（false 也算已传）
 * @returns 父组件参数对象
 */
export function getParent(
    this: SnakeVueInstance,
    name: string,
    keys: string[] | Record<string, any>
): Record<string, any> {
    let parent = this.$parent;
    // 通过 while 历遍，这里主要是为了 H5 需要多层解析的问题
    while (parent) {
        if (parent.$options?.name !== name) {
            // 如果组件的 name 不相等，继续上一级寻找
            parent = parent.$parent;
        } else {
            const data: Record<string, any> = {};
            // 传数组时直接用数组元素值当做键值去父组件寻找
            if (Array.isArray(keys)) {
                keys.forEach(val => {
                    data[val] = parent?.[val] ? parent[val] : '';
                });
            } else {
                for (const key in keys) {
                    const childValue = keys[key];
                    // 空数组/空对象视为未传，回落父组件的值
                    if (Array.isArray(childValue) || (childValue && childValue.constructor === Object)) {
                        data[key] = Object.keys(childValue).length ? childValue : parent[key];
                    } else {
                        // 只要子组件有传值，即使是 false 值也算「传值」，覆盖父组件的同名参数
                        data[key] = childValue || childValue === false ? childValue : parent[key];
                    }
                }
            }
            return data;
        }
    }
    return {};
}

// 兼容默认导入习惯：import getParent from '.../getParent'
export default getParent;
