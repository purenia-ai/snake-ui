import assert from 'node:assert/strict';
import test from 'node:test';

import { registerTsResolve } from './helpers/ts-resolve.mjs';

registerTsResolve();

const contextUrl = new URL('../src/uni_modules/snake-ui/libs/runtime/context.ts', import.meta.url);
const cmsConfigUrl = new URL('../src/uni_modules/snake-ui/libs/cms/config.ts', import.meta.url);

// 模拟 dev 场景的双模块实例：vite 预打包入口与 easycom 源码组件各持一份模块。
// 通过 query 让 node 以独立模块实例加载同一文件。
const runtimeA = await import(contextUrl.href);
const runtimeB = await import(`${contextUrl.href}?instance=b`);

test('runtime state is shared across duplicated module instances', () => {
    runtimeA.configureRuntime({ request: { get: () => {}, post: () => {} } });
    assert.equal(typeof runtimeB.getRuntimeOptions().request, 'object');
    assert.equal(runtimeB.getRuntimeOptions().request, runtimeA.getRuntimeOptions().request);
    runtimeA.resetRuntime();
    assert.equal(runtimeB.getRuntimeOptions().request, undefined);
});

test('cms options are shared across duplicated module instances', async () => {
    const cmsA = await import(cmsConfigUrl.href);
    const cmsB = await import(`${cmsConfigUrl.href}?instance=b`);
    cmsA.configureCms({ services: { commerce: { getGoods: async () => ({ items: [] }) } } });
    assert.equal(typeof cmsB.getCmsOptions().services.commerce, 'object');
    cmsB.resetCmsOptions();
    assert.equal(cmsA.getCmsOptions().services.commerce, undefined);
});
