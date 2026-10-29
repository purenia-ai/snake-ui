/**
 * 单向同步更新日志：src/uni_modules/snake-ui/changelog.md -> docs/components/changelog.md
 *
 * 包内 changelog 是唯一事实源（随 npm 包发布，npm 包页直接展示）；
 * 文档站（VitePress）的 changelog 页面由本脚本生成，不手工编辑。
 *
 * 用法：pnpm changelog:sync（docs:build 前会自动执行）
 */
import { copyFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'src/uni_modules/snake-ui/changelog.md');
const target = join(root, 'docs/components/changelog.md');

try {
    const { size } = statSync(source);
    if (size < 16) {
        // 防呆：源文件被清空/只剩标题时中止，避免用空文件覆盖文档站
        throw new Error(`source changelog looks empty (${size} bytes): ${source}`);
    }
    copyFileSync(source, target);
    console.log(`changelog synced -> ${target} (${size} bytes)`);
} catch (error) {
    console.error(`[sync-changelog] ${error.message}`);
    process.exit(1);
}
