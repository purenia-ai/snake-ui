import type { CmsError, CmsLinkService, CmsPageInfo } from '../snake-cms/types';

/** JumpApplet 组件的公开属性。 */
export interface JumpAppletProps<Data extends Record<string, any> = Record<string, any>> {
    /** CMS 装修组件配置数据。 */
    datas?: Data;
    /** link service 配置。 */
    linkService?: CmsLinkService;
    /** CMS 页面上下文信息。 */
    pageInfo?: CmsPageInfo;
}

/** JumpApplet 组件的事件契约。 */
export interface JumpAppletEmits {
    /** error 事件携带的参数。 */
    error: [error: CmsError];
}
