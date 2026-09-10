import type { IndexListEmits, IndexListExpose, IndexListProps } from '../snake-index-list/types';

/** IndexListPanel 组件的公开属性。 */
export interface IndexListPanelProps extends IndexListProps {}

/** IndexListPanel 组件的事件契约。 */
export type IndexListPanelEmits = IndexListEmits;

/** IndexListPanel 组件实例公开的方法。 */
export type IndexListPanelExpose = IndexListExpose;
