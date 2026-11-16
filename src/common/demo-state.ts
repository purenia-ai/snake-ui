import { reactive } from 'vue';
import type { DemoControl, DemoValue } from './demo-types';

/**
 * demo 页预览状态及其读写入口。
 *
 * 背景：控制面板的值天然是松散的（下拉项是字符串、滑块是数字），如果直接把状态声明成
 * `Record<string, DemoValue>`，绑到组件 prop 上就是 `string` 对字面量联合，永远对不上；
 * 若为此把组件 prop 放宽成 `string`，又会丢掉补全和拼写校验。
 *
 * 这里的做法是从控件定义反推状态类型：`as const` 保留下拉项的字面量，{@link DemoState}
 * 把它聚成联合类型，于是「控件里能选的值」必须落在「组件 prop 接受的联合」内，
 * demo 页因此真的被 props 类型校验，而不是靠 `as` 断言蒙混过关。
 * 写端（面板回调）是运行时的动态 key，只在 {@link setDemoValue} 里断言一次。
 */

/** 单个控件定义能产出的值：开关为布尔、滑块为数字、输入为字符串、下拉为选项值联合。 */
type DemoControlValue<C> = C extends { type: 'switch' }
    ? boolean
    : C extends { type: 'slider' }
      ? number
      : C extends { type: 'input' }
        ? string
        : C extends { options: readonly { value: infer V }[] }
          ? V
          : DemoValue;

/**
 * demo 页预览状态：键取自控件 key，值是该控件能产出的字面量联合。
 *
 * 状态值直接绑到组件 prop 上时由 props 的联合类型真正校验，而不是靠断言绕过：
 * 控件选项里写了组件不接受的取值，type-check 会直接报错。
 * 前提是页面把控件声明成 `as const satisfies readonly DemoControl[]`。
 */
export type DemoState<C extends readonly DemoControl[]> = {
    -readonly [K in C[number] as K['key']]: DemoControlValue<K>;
};

/** 写端用的宽松视图：动态 key 只在 {@link setDemoValue} 这一个断言点存在。 */
type LooseDemoState = Record<string, DemoValue>;

/**
 * 由控件定义生成 demo 页的预览状态（`reactive`），类型见 {@link DemoState}。
 *
 * 用法：`const controls = [...] as const satisfies readonly DemoControl[]` 之后
 * `const state = demoState(controls)`。新增 demo 页直接这么写；存量页面按需迁移。
 */
export function demoState<const C extends readonly DemoControl[]>(controls: C): DemoState<C> {
    return reactive(Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))) as DemoState<C>;
}

/**
 * 控制面板回写单个控件值。
 *
 * 面板只能拿到运行时的 `control.key`，写端在这里断言一次即可；
 * 读端（模板里绑给组件 props）保持强类型。
 */
export function setDemoValue(state: object, key: string, value: DemoValue) {
    (state as LooseDemoState)[key] = value;
}

/** 把全部控件恢复成默认值。 */
export function resetDemoState(state: object, controls: readonly DemoControl[]) {
    for (const control of controls) setDemoValue(state, control.key, control.defaultValue);
}
