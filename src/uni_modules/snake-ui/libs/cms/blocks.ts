export type SnakeCmsBlockCategory = 'content' | 'navigation' | 'commerce' | 'custom';

export interface SnakeCmsBlockDefinition {
    version: 1 | 2;
    category: SnakeCmsBlockCategory;
    componentName: `snake-${string}`;
    standalone: boolean;
}

/**
 * Built-in page-decoration blocks supported by snake-cms.
 *
 * Keep this catalog free of Vue imports so it can be consumed by types,
 * diagnostics and tooling without changing mini-program bundling behavior.
 */
export const snakeCmsBlocks = {
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
    hotzone: { version: 1, category: 'content', componentName: 'snake-hotzone', standalone: true },
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
} as const satisfies Record<string, SnakeCmsBlockDefinition>;

export type SnakeCmsBuiltinComponent = keyof typeof snakeCmsBlocks;
export type SnakeCmsV1BuiltinComponent = {
    [Key in SnakeCmsBuiltinComponent]: (typeof snakeCmsBlocks)[Key]['version'] extends 1 ? Key : never;
}[SnakeCmsBuiltinComponent];
export type SnakeCmsV2BuiltinComponent = {
    [Key in SnakeCmsBuiltinComponent]: (typeof snakeCmsBlocks)[Key]['version'] extends 2 ? Key : never;
}[SnakeCmsBuiltinComponent];

export const snakeCmsBuiltinComponents = new Set<SnakeCmsBuiltinComponent>(
    Object.keys(snakeCmsBlocks) as SnakeCmsBuiltinComponent[]
);

export function isSnakeCmsBuiltinComponent(component: string): component is SnakeCmsBuiltinComponent {
    return snakeCmsBuiltinComponents.has(component as SnakeCmsBuiltinComponent);
}
