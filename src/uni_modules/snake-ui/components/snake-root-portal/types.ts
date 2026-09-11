import type { StyleValue } from '../../types/global';

/** RootPortal 组件的公开属性。 */
export interface RootPortalProps {
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}
