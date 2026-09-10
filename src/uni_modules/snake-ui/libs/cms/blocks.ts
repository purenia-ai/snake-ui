export type CmsBlockCategory = 'content' | 'navigation' | 'commerce' | 'custom';

export interface CmsBlockDefinition {
    version: 1 | 2;
    category: CmsBlockCategory;
    componentName: `snake-${string}`;
    standalone: boolean;
}

/**
 * Built-in page-decoration blocks supported by snake-cms.
 *
 * Keep this catalog free of Vue imports so it can be consumed by types,
 * diagnostics and tooling without changing mini-program bundling behavior.
 */
export const cmsBlocks = {
    commoditysearch: {
        version: 1,
        category: 'navigation',
        componentName: 'snake-commodity-search',
        standalone: true
    },
    auxiliarysegmentation: {
        version: 1,
        category: 'content',
        componentName: 'snake-auxiliary-segmentation',
        standalone: true
    },
    richtext: { version: 1, category: 'content', componentName: 'snake-rich-text', standalone: true },
    graphicnavigation: {
        version: 1,
        category: 'navigation',
        componentName: 'snake-graphic-navigation',
        standalone: true
    },
    images: { version: 1, category: 'content', componentName: 'snake-images', standalone: true },
    pictureads: { version: 1, category: 'content', componentName: 'snake-picture-ads', standalone: true },
    magiccube: { version: 1, category: 'content', componentName: 'snake-magic-cube', standalone: true },
    videos: { version: 1, category: 'content', componentName: 'snake-videos', standalone: true },
    notice: { version: 1, category: 'content', componentName: 'snake-notice', standalone: true },
    jumpApplet: { version: 1, category: 'navigation', componentName: 'snake-jump-applet', standalone: true },
    follow: { version: 1, category: 'navigation', componentName: 'snake-follow', standalone: true },
    suspension: {
        version: 1,
        category: 'navigation',
        componentName: 'snake-floating-bubble',
        standalone: true
    },
    coupon: { version: 1, category: 'commerce', componentName: 'snake-coupon', standalone: true },
    pagePopup: { version: 1, category: 'navigation', componentName: 'snake-page-popup', standalone: true },
    goodslist: { version: 1, category: 'commerce', componentName: 'snake-goods-list', standalone: true },
    custommodule: { version: 1, category: 'custom', componentName: 'snake-custom-module', standalone: true },
    'v2.carousel': { version: 2, category: 'content', componentName: 'snake-cms-v2-carousel', standalone: false },
    'v2.coupon': { version: 2, category: 'commerce', componentName: 'snake-cms-v2-coupon', standalone: false },
    'v2.custom': { version: 2, category: 'custom', componentName: 'snake-cms-v2-custom', standalone: false },
    'v2.divider': { version: 2, category: 'content', componentName: 'snake-cms-v2-divider', standalone: false },
    'v2.floatbutton': {
        version: 2,
        category: 'navigation',
        componentName: 'snake-cms-v2-floatbutton',
        standalone: false
    },
    'v2.goodslist': {
        version: 2,
        category: 'commerce',
        componentName: 'snake-cms-v2-goods-list',
        standalone: false
    },
    'v2.hotzone': { version: 2, category: 'navigation', componentName: 'snake-cms-v2-hotzone', standalone: false },
    'v2.images': { version: 2, category: 'content', componentName: 'snake-cms-v2-images', standalone: false },
    'v2.magiccube': {
        version: 2,
        category: 'content',
        componentName: 'snake-cms-v2-magiccube',
        standalone: false
    },
    'v2.notice': { version: 2, category: 'content', componentName: 'snake-cms-v2-notice', standalone: false },
    'v2.popup': { version: 2, category: 'navigation', componentName: 'snake-cms-v2-popup', standalone: false },
    'v2.richtext': {
        version: 2,
        category: 'content',
        componentName: 'snake-cms-v2-richtext',
        standalone: false
    },
    'v2.search': { version: 2, category: 'navigation', componentName: 'snake-cms-v2-search', standalone: false },
    'v2.video': { version: 2, category: 'content', componentName: 'snake-cms-v2-video', standalone: false }
} as const satisfies Record<string, CmsBlockDefinition>;

export type CmsBuiltinComponent = keyof typeof cmsBlocks;
export type CmsV1BuiltinComponent = {
    [Key in CmsBuiltinComponent]: (typeof cmsBlocks)[Key]['version'] extends 1 ? Key : never;
}[CmsBuiltinComponent];
export type CmsV2BuiltinComponent = {
    [Key in CmsBuiltinComponent]: (typeof cmsBlocks)[Key]['version'] extends 2 ? Key : never;
}[CmsBuiltinComponent];

export const cmsBuiltinComponents = new Set<CmsBuiltinComponent>(
    Object.keys(cmsBlocks) as CmsBuiltinComponent[]
);

export function isCmsBuiltinComponent(component: string): component is CmsBuiltinComponent {
    return cmsBuiltinComponents.has(component as CmsBuiltinComponent);
}
