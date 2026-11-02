import { register } from 'node:module';

/**
 * 让 node 直载 snake-ui 源码（vite 风格的无后缀/目录导入）的解析钩子：
 * 常规解析失败时依次尝试补 `.ts` 与 `/index.ts`。
 * 仅测试环境使用；发布产物由宿主 vite 解析，无需此钩子。
 */
const HOOK_SOURCE = `
export async function resolve(specifier, context, next) {
    try {
        return await next(specifier, context);
    } catch (error) {
        if (error && (error.code === 'ERR_MODULE_NOT_FOUND' || error.code === 'ERR_UNSUPPORTED_DIR_IMPORT')) {
            for (const candidate of [specifier + '.ts', specifier + '/index.ts']) {
                try {
                    return await next(candidate, context);
                } catch {
                    /* 尝试下一个候选 */
                }
            }
        }
        throw error;
    }
}
`;

export function registerTsResolve() {
    register(new URL('data:text/javascript,' + encodeURIComponent(HOOK_SOURCE)), import.meta.url);
}
