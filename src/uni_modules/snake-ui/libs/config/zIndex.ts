/**
 * 组件层级数值表。
 *
 * 键名保持稳定，便于组件移植时直接引用；
 * 数值以 snake-ui 组件当前生效的默认值为准。
 */

export interface SnakeZIndexConfig {
    /** 提示气泡层级。 */
    toast: number;
    /** 无网络提示层级。 */
    noNetwork: number;
    /** 弹窗层级（popup / actionSheet / keyboard / picker 共用）。 */
    popup: number;
    /** 遮罩层级。 */
    mask: number;
    /** 导航栏层级。 */
    navbar: number;
    /** 顶部提示层级。 */
    topTips: number;
    /** 吸顶层级。snake-sticky 当前默认 10（CMS 传 19），有意不采用 970。 */
    sticky: number;
    /** 索引列表锚点吸顶层级。 */
    indexListSticky: number;
    /** 底部标签栏层级。 */
    tabbar: number;
    /** 下拉菜单层级。 */
    dropdown: number;
}

const zIndex: SnakeZIndexConfig = {
    toast: 10090,
    noNetwork: 10080,
    popup: 10075,
    mask: 10070,
    navbar: 980,
    topTips: 975,
    sticky: 10,
    indexListSticky: 965,
    tabbar: 998,
    dropdown: 985
};

export default zIndex;
