import { deepMerge } from '../function';
import type { CmsOptions } from './types';

const DEFAULT_CMS_OPTIONS: CmsOptions = {
    aliases: { videoss: 'videos' },
    normalizers: {},
    services: {},
    assets: {},
    cachePrefix: 'snake-ui:cms'
};

// 与 runtime/context 同理：dev 下包入口（预打包）与 easycom 组件（源码形态）可能各持一份模块，
// CMS 全局配置挂 globalThis 保证插件注入的 services/normalizers 对所有实例可见。
const CMS_STATE_KEY = '__SNAKE_UI_CMS_OPTIONS__';
const carrier = (typeof globalThis !== 'undefined' ? globalThis : {}) as Record<string, unknown>;

function loadGlobalCmsOptions(): CmsOptions {
    if (!carrier[CMS_STATE_KEY]) carrier[CMS_STATE_KEY] = deepMerge(DEFAULT_CMS_OPTIONS, {});
    return carrier[CMS_STATE_KEY] as CmsOptions;
}

export function configureCms(options?: CmsOptions): CmsOptions {
    const merged = deepMerge(loadGlobalCmsOptions(), options || {});
    carrier[CMS_STATE_KEY] = merged;
    return merged;
}

export function getCmsOptions(instance?: CmsOptions): CmsOptions {
    return deepMerge(loadGlobalCmsOptions(), instance || {});
}

export function resetCmsOptions(): void {
    carrier[CMS_STATE_KEY] = deepMerge(DEFAULT_CMS_OPTIONS, {});
}
