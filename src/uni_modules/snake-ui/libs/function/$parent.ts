// 获取父组件实例，因为支付宝小程序不支持 provide/inject 的写法
// 在非 H5 中 instance.parent 可以准确获取到父组件，但在 H5 中需要多层 parent.parent.xxx
// componentName 默认 undefined 有其含义：最顶层元素的 parent 就是 undefined，
// 不传 name 即查找最顶层的父实例。
//
// 注意：本文件属于 function/ 基础层，会被 node 直载测试加载，禁止 import 'vue'；
// 调用方（组件内）自行传入 getCurrentInstance() 结果，与 getRect(selector, instance) 约定一致。

export interface SnakeParentLike {
    parent?: SnakeParentLike | null;
    type?: { name?: string };
}

export function $parent(
    componentName?: string,
    instance?: SnakeParentLike | null
): SnakeParentLike | null | undefined {
    let parent = instance?.parent ?? null;

    if (!componentName) return parent;

    while (parent) {
        const name = parent.type?.name;
        if (name === componentName) {
            return parent;
        }
        parent = parent.parent ?? null;
    }
    return null;
}

// 兼容默认导入习惯：import $parent from '.../$parent'
export default $parent;
