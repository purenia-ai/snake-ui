import { deepMerge } from '../functions';
import type { SnakeCmsOptions } from '../../components/snake-cms/types';

const DEFAULT_CMS_OPTIONS: SnakeCmsOptions = {
    aliases: { videoss: 'videos' },
    normalizers: {},
    services: {},
    assets: {},
    cachePrefix: 'snake-ui:cms',
    legacy: 'auto'
};

let globalCmsOptions: SnakeCmsOptions = deepMerge(DEFAULT_CMS_OPTIONS, {});

export function configureSnakeCms(options?: SnakeCmsOptions): SnakeCmsOptions {
    globalCmsOptions = deepMerge(globalCmsOptions, options || {});
    return globalCmsOptions;
}

export function getSnakeCmsOptions(instance?: SnakeCmsOptions): SnakeCmsOptions {
    return deepMerge(globalCmsOptions, instance || {});
}

export function resetSnakeCmsOptions(): void {
    globalCmsOptions = deepMerge(DEFAULT_CMS_OPTIONS, {});
}
