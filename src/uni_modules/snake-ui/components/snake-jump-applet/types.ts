import type { SnakeCmsError, SnakeCmsLinkService, SnakeCmsPageInfo } from '../snake-cms/types';

/** SnakeJumpApplet 组件的公开属性。 */
export interface SnakeJumpAppletProps<Data extends Record<string, any> = Record<string, any>> {
    /** CMS 装修组件配置数据。 */
    datas?: Data;
    /** link service 配置。 */
    linkService?: SnakeCmsLinkService;
    /** CMS 页面上下文信息。 */
    pageInfo?: SnakeCmsPageInfo;
}

/** SnakeJumpApplet 组件的事件契约。 */
export interface SnakeJumpAppletEmits {
    /** error 事件携带的参数。 */
    error: [error: SnakeCmsError];
}
