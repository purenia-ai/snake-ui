/*
 * 平台工具兼容入口：实现已按「一文件一函数」拆分，
 * 本文件长期保留为 re-export barrel，钉住三方旧路径——
 * 组件/宿主对 libs/function/platform 的导入、runtime.ts 的 import 字面量、
 * 以及 tests/runtime.test.mjs 的路径重写。
 */

export { sleep } from './sleep';
export { guid } from './guid';
export type { SelectorRect } from './getRect';
export { getRect } from './getRect';
export { toast } from './toast';
export { getSystemInfo, sys, os } from './system';
export type {
    RouteOptions,
    RouteParamValue,
    RouteParams,
    RouteType
} from './route';
export { navTo, route } from './route';
export { getQueryParams } from './queryParams';
export { formatTime } from './timeFormat';
