/**
 * 编译 vite 插件源码：src/uni_modules/snake-ui/plugins/root/*.ts -> root/dist/*.{mjs,cjs}
 *
 * 为什么需要：`plugins` 入口是给 Node 加载的——消费端在 `vite.config.ts` 里
 * `import { UniRoot } from '@puresnake/snake-ui/plugins'`，而 vite 打包配置时会把裸包名外部化，
 * 运行期交给 Node。Node 不转译 `node_modules` 里的 .ts（ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING），
 * 所以必须随包发布 ESM / CJS 双份 JS，由 package.json 的 exports 条件分别指向；`types` 仍指向源码。
 *
 * 产物（与 uview-pro 的 plugins 布局一致，随包提交，发布时无需再装依赖）：
 *   plugins/index.mjs / index.cjs     —— 两个再导出入口
 *   plugins/root/dist/*.mjs / *.cjs   —— 编译后的实现
 *
 * 用法：pnpm build:plugins（改了 plugins/ 下的源码后必须重跑，否则发出去的是旧插件）
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const pluginsDir = path.join(root, 'src/uni_modules/snake-ui/plugins');
const sourceDir = path.join(pluginsDir, 'root');
const outDir = path.join(sourceDir, 'dist');

/**
 * esbuild 在本仓库只是 vite 的间接依赖，pnpm 隔离布局下顶层 require 取不到，
 * 所以回落到 node_modules/.pnpm 里挑版本最高的一个。
 */
function resolveEsbuild() {
    try {
        return require('esbuild');
    } catch {
        const store = path.join(root, 'node_modules/.pnpm');
        const candidates = fs.existsSync(store)
            ? fs
                  .readdirSync(store)
                  .filter(name => name.startsWith('esbuild@'))
                  .sort()
                  .reverse()
            : [];
        for (const name of candidates) {
            try {
                return require(path.join(store, name, 'node_modules/esbuild'));
            } catch {
                // 该版本不可用就试下一个
            }
        }
        throw new Error('找不到 esbuild，请先在本仓库执行 pnpm install');
    }
}

function listSourceFiles(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return listSourceFiles(full);
        if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) return [full];
        return [];
    });
}

/**
 * esbuild 只做转译（不打包），相对说明符原样保留、不带扩展名；Node 要求显式扩展名，这里补齐。
 *
 * 只能匹配「真正的 import / export-from / require 语句」：
 * 源码里存在模板字符串 `import GlobalRootView from "./${fileName}.vue"`，
 * 若用宽泛的 `from\s*"\./..."` 正则，会把它一并改成 `.vue.cjs`，
 * 注入进 main.ts 后就成了不存在的文件（0.0.18 的故障就是这么来的）。
 */
function fillExtensions(dir, ext, format) {
    const patterns =
        format === 'esm'
            ? [
                  /^([ \t]*(?:import|export)\b[^'"]*?\bfrom[ \t]*)(['"])(\.\/[^'"\/.]+)\2/gm,
                  /^([ \t]*import[ \t]*)(['"])(\.\/[^'"\/.]+)\2/gm
              ]
            : [/(\brequire\(\s*)(['"])(\.\/[^'"\/.]+)\2/g];

    for (const name of fs.readdirSync(dir)) {
        if (!name.endsWith(ext)) continue;
        const file = path.join(dir, name);
        const before = fs.readFileSync(file, 'utf8');
        const after = patterns.reduce(
            (code, pattern) =>
                code.replace(pattern, (match, lead, quote, spec) =>
                    spec.endsWith(ext) ? match : `${lead}${quote}${spec}${ext}${quote}`
                ),
            before
        );
        if (after !== before) fs.writeFileSync(file, after);
    }
}

/**
 * 防呆：注入到 main.ts 的 import 必须保持 "./{fileName}.vue"，
 * 一旦被扩展名补齐误伤（出现 .vue.cjs / .vue.mjs）就中止构建。
 */
function assertVueImportIntact(dir, ext) {
    for (const name of fs.readdirSync(dir)) {
        if (!name.endsWith(ext)) continue;
        const file = path.join(dir, name);
        const code = fs.readFileSync(file, 'utf8');
        if (code.includes(`.vue.${ext.slice(1)}`)) {
            throw new Error(`${path.join('plugins/root/dist', name)} 里的 App.root.vue 注入字符串被误改成 .vue.${ext.slice(1)}`);
        }
        if (name === `root${ext}` && !code.includes('"./${fileName}.vue"')) {
            throw new Error(`${path.join('plugins/root/dist', name)} 里找不到预期的 "./\${fileName}.vue" 注入字符串`);
        }
    }
}

const esbuild = resolveEsbuild();
const entryPoints = listSourceFiles(sourceDir);

if (entryPoints.length === 0) {
    console.error(`[build-plugins] 没有找到插件源码：${sourceDir}`);
    process.exit(1);
}

fs.rmSync(outDir, { recursive: true, force: true });

for (const [format, ext] of [
    ['esm', '.mjs'],
    ['cjs', '.cjs']
]) {
    await esbuild.build({
        entryPoints,
        outdir: outDir,
        outExtension: { '.js': ext },
        format,
        platform: 'node',
        target: 'node18',
        logLevel: 'warning'
    });
    fillExtensions(outDir, ext, format);
    assertVueImportIntact(outDir, ext);
}

fs.writeFileSync(path.join(pluginsDir, 'index.mjs'), "export * from './root/dist/index.mjs';\n");
fs.writeFileSync(path.join(pluginsDir, 'index.cjs'), "module.exports = require('./root/dist/index.cjs');\n");

const outputs = fs
    .readdirSync(outDir)
    .sort()
    .map(name => `plugins/root/dist/${name}  ${fs.statSync(path.join(outDir, name)).size}B`);

console.log(`[build-plugins] 已生成 ${outputs.length + 2} 个文件：`);
console.log('  plugins/index.mjs  plugins/index.cjs');
for (const line of outputs) console.log(`  ${line}`);
