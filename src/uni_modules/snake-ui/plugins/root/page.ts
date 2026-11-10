import { parseSFC, wrapPageTemplate } from './utils';

/**
 * 页面模板转换：将页面内容包裹在 <global-root-view> 中
 *
 * <global-root-view> 是 App.root.vue 注册的全局组件，
 * 其模板中的 <slot /> 接收页面内容。
 *
 * 解析 SFC 与包裹模板拆开：解析依赖 `vue/compiler-sfc`（可用性与宿主环境有关），
 * 包裹是纯字符串处理，放在 utils.ts 里便于单测。
 */
export async function transformPage(code: string) {
    const sfc = await parseSFC(code);
    return wrapPageTemplate(code, sfc);
}
