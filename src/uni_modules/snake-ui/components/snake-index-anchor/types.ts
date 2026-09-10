import type { StyleValue } from '../../types/global';
/** IndexAnchor 组件的公开属性。 */
export interface IndexAnchorProps {
    /** 当前数据项索引。 */
    index: string | number;
    /** 展示文本。 */
    text?: string;
    /** 是否使用默认插槽替代文本。 */
    useSlot?: boolean;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}
