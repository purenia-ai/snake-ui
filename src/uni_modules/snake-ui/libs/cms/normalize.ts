import { deepClone } from '../function';
import type {
    SnakeCmsBuiltinComponent,
    SnakeCmsComponentConfig,
    SnakeCmsDiagnostic,
    SnakeCmsNormalizedComponent,
    SnakeCmsOptions,
    SnakeCmsPageInfo
} from './types';

export const snakeCmsBuiltinComponents = new Set<SnakeCmsBuiltinComponent>([
    'commoditysearch',
    'auxiliarysegmentation',
    'richtext',
    'graphicnavigation',
    'images',
    'hotzone',
    'pictureads',
    'magiccube',
    'videos',
    'notice',
    'jumpApplet',
    'follow',
    'suspension',
    'coupon',
    'pagePopup',
    'goodslist',
    'custommodule'
]);

export interface SnakeCmsNormalizeResult {
    components: SnakeCmsNormalizedComponent[];
    diagnostics: SnakeCmsDiagnostic[];
}

export function normalizeSnakeCmsComponents(
    input: unknown,
    pageInfo: SnakeCmsPageInfo = {},
    options: SnakeCmsOptions = {}
): SnakeCmsNormalizeResult {
    const diagnostics: SnakeCmsDiagnostic[] = [];
    const components: SnakeCmsNormalizedComponent[] = [];
    const aliases: Record<string, SnakeCmsBuiltinComponent> = { videoss: 'videos', ...(options.aliases || {}) };
    let hasCommerceSection = false;

    if (!Array.isArray(input)) {
        diagnostics.push({ code: 'invalid-component', level: 'error', message: 'pageComponents must be an array.' });
        return { components, diagnostics };
    }

    input.forEach((raw, index) => {
        if (!raw || typeof raw !== 'object' || typeof (raw as SnakeCmsComponentConfig).component !== 'string') {
            diagnostics.push({
                code: 'invalid-component',
                level: 'error',
                index,
                message: 'CMS component must contain a string component key.'
            });
            return;
        }

        let item = deepClone(raw as SnakeCmsComponentConfig);
        const originalComponent = item.component;
        const normalizer = options.normalizers?.[originalComponent];
        if (normalizer) {
            try {
                const normalized = normalizer(item, { index, pageInfo });
                if (!normalized) return;
                item = normalized;
            } catch (cause) {
                diagnostics.push({
                    code: 'normalizer-error',
                    level: 'error',
                    index,
                    component: originalComponent,
                    message: `Normalizer failed for "${originalComponent}".`,
                    cause
                });
                return;
            }
        }

        const component = aliases[item.component] || item.component;
        const setStyle = item.setStyle && typeof item.setStyle === 'object' ? item.setStyle : {};
        if (item.visible === false || setStyle.showComponent === false) return;

        const builtin = snakeCmsBuiltinComponents.has(component as SnakeCmsBuiltinComponent);
        if (component === 'goodslist') {
            if (hasCommerceSection) {
                diagnostics.push({
                    code: 'duplicate-commerce-section',
                    level: 'warn',
                    index,
                    component,
                    message: 'Only the first goodslist section is rendered.'
                });
                return;
            }
            hasCommerceSection = true;
        }

        if (!builtin) {
            diagnostics.push({
                code: 'unknown-component',
                level: 'warn',
                index,
                component,
                message: `Unknown CMS component "${component}".`
            });
        }

        components.push({
            ...item,
            id: String(item.id ?? `${component}-${index}`),
            component,
            originalComponent,
            setStyle,
            builtin
        });
    });

    return { components, diagnostics };
}
