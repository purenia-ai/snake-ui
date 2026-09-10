import { deepMerge } from '../function';
import type { CmsOptions } from './types';

const DEFAULT_CMS_OPTIONS: CmsOptions = {
    aliases: { videoss: 'videos' },
    normalizers: {},
    services: {},
    assets: {},
    cachePrefix: 'snake-ui:cms',
    legacy: 'auto'
};

let globalCmsOptions: CmsOptions = deepMerge(DEFAULT_CMS_OPTIONS, {});

export function configureCms(options?: CmsOptions): CmsOptions {
    globalCmsOptions = deepMerge(globalCmsOptions, options || {});
    return globalCmsOptions;
}

export function getCmsOptions(instance?: CmsOptions): CmsOptions {
    return deepMerge(globalCmsOptions, instance || {});
}

export function resetCmsOptions(): void {
    globalCmsOptions = deepMerge(DEFAULT_CMS_OPTIONS, {});
}
