import { isDebugMode } from '../config/state';
import type { CmsDiagnostic, CmsOptions } from './types';
import { getCmsOptions } from './config';

export function reportCmsDiagnostic(options: CmsOptions, diagnostic: CmsDiagnostic): void {
    options.onDiagnostic?.(diagnostic);
    if (isDebugMode('warn')) console.warn(`[Snake UI CMS] ${diagnostic.message}`, diagnostic);
}

export function resolveCmsOptions(instance?: CmsOptions): CmsOptions {
    return getCmsOptions(instance);
}
