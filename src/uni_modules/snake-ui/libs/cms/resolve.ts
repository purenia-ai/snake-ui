import { deepMerge } from '../function';
import { isDebugMode } from '../config/state';
import { getRuntimeOptions } from '../runtime';
import type { CmsDiagnostic, CmsOptions } from './types';
import { getCmsOptions } from './config';
import { createLegacyJokerCmsOptions } from './legacy-joker';

let legacyWarningShown = false;

export function reportCmsDiagnostic(options: CmsOptions, diagnostic: CmsDiagnostic): void {
    options.onDiagnostic?.(diagnostic);
    if (isDebugMode('warn')) console.warn(`[Snake UI CMS] ${diagnostic.message}`, diagnostic);
}

export function resolveCmsOptions(instance?: CmsOptions): CmsOptions {
    const configured = getCmsOptions(instance);
    const runtime = getRuntimeOptions();
    const hasNewServices = Boolean(
        configured.services?.commerce || configured.services?.coupon || configured.services?.link
    );
    const useLegacy =
        configured.legacy === true || (configured.legacy === 'auto' && !hasNewServices && Boolean(runtime.request));
    if (!useLegacy) return configured;

    const resolved = deepMerge(createLegacyJokerCmsOptions(runtime), configured);
    if (!legacyWarningShown && isDebugMode('warn')) {
        legacyWarningShown = true;
        reportCmsDiagnostic(resolved, {
            code: 'legacy-adapter',
            level: 'warn',
            message: 'Legacy Joker CMS services were enabled automatically. Configure cms.services to migrate.'
        });
    }
    return resolved;
}

export function resetCmsLegacyWarning(): void {
    legacyWarningShown = false;
}
