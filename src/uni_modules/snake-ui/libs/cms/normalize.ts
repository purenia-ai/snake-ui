import { deepClone } from '../function';
import { isCmsBuiltinComponent, cmsBlocks } from './blocks';
export { cmsBuiltinComponents } from './blocks';
import type {
    CmsBuiltinComponent,
    CmsComponentConfig,
    CmsDiagnostic,
    CmsNormalizedComponent,
    CmsOptions,
    CmsPageInfo
} from './types';
import type { CmsV2BuiltinComponent } from './blocks';
import { normalizeCmsV2Props } from './v2';

export interface CmsNormalizeResult {
    components: CmsNormalizedComponent[];
    diagnostics: CmsDiagnostic[];
}

export function normalizeCmsComponents(
    input: unknown,
    pageInfo: CmsPageInfo = {},
    options: CmsOptions = {}
): CmsNormalizeResult {
    const diagnostics: CmsDiagnostic[] = [];
    const components: CmsNormalizedComponent[] = [];
    const aliases: Record<string, CmsBuiltinComponent> = { videoss: 'videos', ...(options.aliases || {}) };
    let hasCommerceSection = false;

    if (!Array.isArray(input)) {
        diagnostics.push({ code: 'invalid-component', level: 'error', message: 'pageComponents must be an array.' });
        return { components, diagnostics };
    }

    input.forEach((raw, index) => {
        if (!raw || typeof raw !== 'object' || typeof (raw as CmsComponentConfig).component !== 'string') {
            diagnostics.push({
                code: 'invalid-component',
                level: 'error',
                index,
                message: 'CMS component must contain a string component key.'
            });
            return;
        }

        let item = deepClone(raw as CmsComponentConfig);
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

        // alias 只改变实际渲染组件；originalComponent 保留原始下发键，供 normalizer 与诊断追溯来源。
        const component = aliases[item.component] || item.component;
        const version = item.component.startsWith('v2.') ? 2 : 1;
        const setStyle = item.setStyle && typeof item.setStyle === 'object' ? item.setStyle : {};
        const hasValidV2Props = item.props !== null && typeof item.props === 'object' && !Array.isArray(item.props);
        let componentProps = hasValidV2Props ? item.props || {} : {};
        if (version === 1 && (item.visible === false || setStyle.showComponent === false)) return;
        if (version === 2 && item.active === false) return;

        const builtin = isCmsBuiltinComponent(component);
        if (version === 2 && !hasValidV2Props) {
            diagnostics.push({
                code: 'invalid-component',
                level: 'error',
                index,
                component,
                message: `CMS v2 component "${component}" must contain an object props field.`
            });
        }
        if (builtin && cmsBlocks[component].version !== version) {
            diagnostics.push({
                code: 'invalid-component',
                level: 'error',
                index,
                component,
                message: `CMS component "${component}" has an invalid protocol version.`
            });
        }
        if (builtin && version === 2 && cmsBlocks[component].version === 2) {
            componentProps = normalizeCmsV2Props(component as CmsV2BuiltinComponent, componentProps);
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
