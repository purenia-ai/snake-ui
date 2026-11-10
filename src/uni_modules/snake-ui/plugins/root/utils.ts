import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { normalizePath } from 'vite';

/**
 * Parse Vue SFC file, return descriptor
 *
 * When vue/compiler-sfc is not available (e.g. HBuilderX projects where
 * vue is not in node_modules), returns null instead of throwing.
 * Callers should fall back to regex-based matching.
 */
export async function parseSFC(code: string) {
    try {
        const { parse } = await import('vue/compiler-sfc');
        return parse(code, { pad: 'space' }).descriptor;
    } catch {
        return null;
    }
}

/**
 * 剔除 JSONC 注释（单行与多行），只处理字符串之外的字符。
 *
 * 不能对整段文本做正则替换：`"navigationBarTitleText": "https://example.com"`
 * 会被 `//.*$` 截断成 `"https:`，随后 JSON.parse 抛错，插件在启动阶段直接崩溃。
 * pages.json 里写 URL 或带 `/*` 的文案都很常见，所以逐字符扫描：
 * 字符串内容（含转义）原样保留，行注释替换为一个换行，避免与下一行粘连。
 */
export function stripJsonComments(str: string): string {
    let out = '';
    let quote = '';
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (quote) {
            out += char;
            if (char === '\\') {
                out += str[++i] ?? '';
                continue;
            }
            if (char === quote) quote = '';
            continue;
        }
        if (char === '"') {
            quote = char;
            out += char;
            continue;
        }
        if (char === '/' && str[i + 1] === '/') {
            while (i < str.length && str[i] !== '\n') i++;
            out += '\n';
            continue;
        }
        if (char === '/' && str[i + 1] === '*') {
            i += 2;
            while (i < str.length && !(str[i] === '*' && str[i + 1] === '/')) i++;
            i += 1;
            out += ' ';
            continue;
        }
        out += char;
    }
    return out;
}

/**
 * Convert pages.json path to absolute file path
 */
export function formatPagePath(root: string, path: string) {
    return normalizePath(`${join(root, path)}.vue`).replace(/^[A-Z]:/, match => match.toLowerCase());
}

/**
 * Load pages.json and resolve all page paths (main + subPackages)
 */
export function loadPagesJson(path: string, rootPath: string): string[] {
    const raw = readFileSync(path, 'utf-8');
    const { pages = [], subPackages = [] } = JSON.parse(stripJsonComments(raw));

    return [
        ...pages.map((page: any) => formatPagePath(rootPath, page.path)),
        ...subPackages
            .map(({ pages: subPages = [], root = '' }: any) => {
                return subPages.map((page: any) => formatPagePath(join(rootPath, root), page.path));
            })
            .flat()
    ];
}

/**
 * camelCase to kebab-case: PageMeta -> page-meta
 */
export function toKebabCase(str: string) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[_\s]+/g, '-')
        .toLowerCase();
}

/**
 * kebab-case to PascalCase: page-meta -> PageMeta
 */
export function toPascalCase(str: string) {
    return str.replace(/(^\w|-+\w)/g, match => match.toUpperCase().replace(/-/g, ''));
}

interface TagNode {
    loc: {
        source: string;
        start: { offset: number };
        end: { offset: number };
    };
}

/**
 * Find a tag node in SFC template AST by tag name
 * Supports both kebab-case and PascalCase
 */
export function findNode(sfc: any, rawTagName: string): TagNode | undefined {
    const templateSource = sfc.template?.content;
    if (!templateSource) return;

    let tagName = '';
    if (templateSource.includes(`<${toKebabCase(rawTagName)}`)) {
        tagName = toKebabCase(rawTagName);
    } else if (templateSource.includes(`<${toPascalCase(rawTagName)}`)) {
        tagName = toPascalCase(rawTagName);
    }

    if (!tagName) return;

    const nodeAst = sfc.template?.ast;
    if (!nodeAst) return;

    // Recursively traverse AST to find the target node
    const traverse = (nodes: any): TagNode | undefined => {
        for (const node of nodes) {
            if (node.type === 1) {
                if (node.tag === tagName) return node;
                if (node.children?.length) {
                    const found = traverse(node.children);
                    if (found) return found;
                }
            }
        }
        return undefined;
    };

    return traverse(nodeAst.children);
}

/**
 * 把页面模板包裹进 `<global-root-view>`，页面内容通过根组件的 `<slot />` 渲染。
 *
 * `<page-meta>` 必须提到包裹层外侧，否则小程序端会因节点层级不符而失效。
 * `sfc` 为 null 时（HBuilderX 等取不到 vue/compiler-sfc 的场景）回退为正则匹配。
 */
export function wrapPageTemplate(code: string, sfc: any) {
    // 用正则定位 <template> 开头标签
    const openMatch = code.match(/<template\b[^>]*>/);
    if (!openMatch) return null;

    // 使用 lastIndexOf 定位最后一个 </template>，即根 <template> 的闭合标签
    // 避免匹配到模板内具名插槽 <template #slot> 的闭合标签
    const closeTagStart = code.lastIndexOf('</template>');
    if (closeTagStart === -1) return null;

    const openTagEnd = openMatch.index! + openMatch[0].length;
    const content = code.slice(openTagEnd, closeTagStart);

    let pageMetaSource = '';
    let newContent = content;

    if (sfc?.template) {
        // AST 模式：通过 vue/compiler-sfc 解析，精确定位 PageMeta 节点
        const pageMetaNode = findNode(sfc, 'PageMeta');
        if (pageMetaNode) {
            pageMetaSource = pageMetaNode.loc.source;
            const metaStart = pageMetaNode.loc.start.offset;
            const metaEnd = pageMetaNode.loc.end.offset;

            // pageMetaNode.loc 的 offset 是相对于整个文件的，转换为相对于 content 的位置
            const metaStartInContent = metaStart - openTagEnd;
            const metaEndInContent = metaEnd - openTagEnd;

            newContent = content.slice(0, metaStartInContent) + content.slice(metaEndInContent);
        }
    } else {
        // 降级模式：vue/compiler-sfc 不可用，用正则匹配 <page-meta> 标签
        const pageMetaMatch = content.match(/<page-meta\b[^>]*>[\s\S]*?<\/page-meta>/);
        if (pageMetaMatch) {
            pageMetaSource = pageMetaMatch[0];
            newContent = content.replace(pageMetaMatch[0], '');
        } else {
            // 也匹配自闭合的 <page-meta ... />
            const selfClosingMatch = content.match(/<page-meta\b[^>]*\/>/);
            if (selfClosingMatch) {
                pageMetaSource = selfClosingMatch[0];
                newContent = content.replace(selfClosingMatch[0], '');
            }
        }
    }

    // page-meta 放在包裹层外部，内容包裹在 <global-root-view> 中
    const wrappedContent = `\n${pageMetaSource}\n<global-root-view>${newContent}</global-root-view>\n`;

    return {
        code: code.slice(0, openTagEnd) + wrappedContent + code.slice(closeTagStart),
        map: {
            version: 3 as const,
            sources: [] as string[],
            names: [] as string[],
            mappings: ''
        }
    };
}

/**
 * Normalize platform-specific page paths (.mp-weixin.vue -> .vue)
 */
export function normalizePlatformPath(id: string) {
    const platform = process.env.UNI_PLATFORM;
    if (!platform) return id;

    const regex = new RegExp(`\\.${platform}\\.vue$`);
    if (regex.test(id)) {
        return id.replace(`.${platform}.`, '.');
    }
    return id;
}

/**
 * Debounce utility
 */
export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<T>) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}
