import { deepMerge } from '../function';
import { isSnakeDebugMode } from '../config/state';
import { getSnakeUIOptions } from '../runtime';
import type { SnakeCmsDiagnostic, SnakeCmsOptions } from '../../components/snake-cms/types';
import { getSnakeCmsOptions } from './config';
import { createLegacyJokerCmsOptions } from './legacy-joker';

let legacyWarningShown = false;

export function reportSnakeCmsDiagnostic(options: SnakeCmsOptions, diagnostic: SnakeCmsDiagnostic): void {
    options.onDiagnostic?.(diagnostic);
    if (isSnakeDebugMode('warn')) console.warn(`[Snake UI CMS] ${diagnostic.message}`, diagnostic);
}

export function resolveSnakeCmsOptions(instance?: SnakeCmsOptions): SnakeCmsOptions {
    const configured = getSnakeCmsOptions(instance);
    const runtime = getSnakeUIOptions();
    const hasNewServices = Boolean(
        configured.services?.commerce || configured.services?.coupon || configured.services?.link
    );
    const useLegacy =
        configured.legacy === true || (configured.legacy === 'auto' && !hasNewServices && Boolean(runtime.request));
    if (!useLegacy) return configured;

    const resolved = deepMerge(createLegacyJokerCmsOptions(runtime), configured);
    if (!legacyWarningShown && isSnakeDebugMode('warn')) {
        legacyWarningShown = true;
        reportSnakeCmsDiagnostic(resolved, {
            code: 'legacy-adapter',
            level: 'warn',
            message: 'Legacy Joker CMS services were enabled automatically. Configure cms.services to migrate.'
        });
    }
    return resolved;
}

export function resetSnakeCmsLegacyWarning(): void {
    legacyWarningShown = false;
}
