import type { SnakeCmsError, SnakeCmsLinkService, SnakeCmsPageInfo } from '../snake-cms/types';

export interface SnakeJumpAppletProps<Data extends Record<string, any> = Record<string, any>> {
    datas?: Data;
    linkService?: SnakeCmsLinkService;
    pageInfo?: SnakeCmsPageInfo;
}

export interface SnakeJumpAppletEmits {
    error: [error: SnakeCmsError];
}
