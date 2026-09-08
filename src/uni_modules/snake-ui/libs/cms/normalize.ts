import { deepClone } from '../function';
import { isSnakeCmsBuiltinComponent, snakeCmsBlocks } from './blocks';
export { snakeCmsBuiltinComponents } from './blocks';
import type {
    SnakeCmsBuiltinComponent,
    SnakeCmsComponentConfig,
    SnakeCmsDiagnostic,
    SnakeCmsNormalizedComponent,
    SnakeCmsOptions,
    SnakeCmsPageInfo
} from './types';

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
        const version = item.component.startsWith('v2.') ? 2 : 1;
        const setStyle = item.setStyle && typeof item.setStyle === 'object' ? item.setStyle : {};
        const hasValidV2Props = item.props !== null && typeof item.props === 'object' && !Array.isArray(item.props);
        const componentProps = hasValidV2Props ? item.props || {} : {};
        if (version === 1 && (item.visible === false || setStyle.showComponent === false)) return;
        if (version === 2 && item.active === false) return;

        const builtin = isSnakeCmsBuiltinComponent(component);
        if (version === 2 && !hasValidV2Props) {
            diagnostics.push({
                code: 'invalid-component',
                level: 'error',
                index,
                component,
                message: `CMS v2 component "${component}" must contain an object props field.`
            });
        }
        if (builtin && snakeCmsBlocks[component].version !== version) {
            diagnostics.push({
                code: 'invalid-component',
                level: 'error',
                index,
                component,
                message: `CMS component "${component}" has an invalid protocol version.`
            });
        }
        if (component === 'goodslist' || component === 'v2.goodslist') {
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
            version,
            originalComponent,
            setStyle,
            props: componentProps,
            builtin
        });
    });

    return { components, diagnostics };
}
