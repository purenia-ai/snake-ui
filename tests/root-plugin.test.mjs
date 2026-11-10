import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';

import { registerRootApp } from '../src/uni_modules/snake-ui/plugins/root/root.ts';
import {
    loadPagesJson,
    parseSFC,
    stripJsonComments,
    wrapPageTemplate
} from '../src/uni_modules/snake-ui/plugins/root/utils.ts';
import { transformPage as builtTransformPage } from '../src/uni_modules/snake-ui/plugins/root/dist/page.mjs';
import * as builtUtils from '../src/uni_modules/snake-ui/plugins/root/dist/utils.mjs';

const root = resolve(import.meta.dirname, '..');
const distBase = join(root, 'src/uni_modules/snake-ui/plugins/root/dist');

const PAGE_SFC = `<template>
    <page-meta :page-style="'overflow: hidden'" />
    <view class="page">
        <template #header>
            <text>header</text>
        </template>
        <text>body</text>
    </view>
</template>

<script setup lang="ts">
const title = 'https://demo.puresnake.com';
</script>
`;

test('stripJsonComments 保留字符串里的 // 与 /* */（URL 不再被截断）', () => {
    const jsonc = `{
        // 导航标题里有 URL，旧实现会把 // 之后整行删掉
        "navigationBarTitleText": "https://demo.puresnake.com/a//b",
        "note": "见 /* 文档 */ 与 // 注释"
    }`;
    const parsed = JSON.parse(stripJsonComments(jsonc));

    assert.equal(parsed.navigationBarTitleText, 'https://demo.puresnake.com/a//b');
    assert.equal(parsed.note, '见 /* 文档 */ 与 // 注释');
});

test('stripJsonComments 处理块注释、转义引号与行尾注释', () => {
    const jsonc = '{ /* 块注释 */ "a": "/* 不是注释 */", "b": "// 也不是", "c": "say \\"hi\\" // tail" } // 行尾注释';
    const parsed = JSON.parse(stripJsonComments(jsonc));

    assert.deepEqual(parsed, { a: '/* 不是注释 */', b: '// 也不是', c: 'say "hi" // tail' });
});

test('stripJsonComments 不会把注释后面的内容一起吃掉', () => {
    const stripped = stripJsonComments('{\n  // 注释行\n  "a": 1\n}');

    assert.equal(JSON.parse(stripped).a, 1);
    assert.equal(stripped.split('\n').length, 4, '行注释只替换自身，保留换行');
});

test('loadPagesJson 支持注释、字符串内 URL 与分包', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'snake-root-'));
    try {
        const pages = `{
            // 主包
            "pages": [
                {
                    "path": "pages/index/index",
                    "style": { "navigationBarTitleText": "https://demo.puresnake.com" }
                }
            ],
            "subPackages": [
                /* 分包 */
                { "root": "pages-sub", "pages": [{ "path": "detail/index" }] }
            ]
        }`;
        await writeFile(join(dir, 'pages.json'), pages, 'utf8');

        const list = loadPagesJson(join(dir, 'pages.json'), dir);
        const normalized = list.map(item => item.toLowerCase());

        assert.equal(normalized.length, 2);
        assert.ok(normalized[0].endsWith('/pages/index/index.vue'), normalized[0]);
        assert.ok(normalized[1].endsWith('/pages-sub/detail/index.vue'), normalized[1]);
    } finally {
        await rm(dir, { recursive: true, force: true });
    }
});

test('wrapPageTemplate 用正则回退时把 page-meta 提到包裹层外', () => {
    const result = wrapPageTemplate(PAGE_SFC, null);

    assert.ok(result);
    const metaIndex = result.code.indexOf('<page-meta');
    const wrapperIndex = result.code.indexOf('<global-root-view>');
    assert.ok(metaIndex >= 0 && metaIndex < wrapperIndex, 'page-meta 必须在包裹层之前');
    assert.ok(result.code.includes('</global-root-view>'));

    const inside = result.code.slice(wrapperIndex, result.code.indexOf('</global-root-view>'));
    assert.ok(inside.includes('<template #header>'), '具名插槽内容不应被拆开');
    assert.ok(inside.includes('<text>body</text>'));
    assert.ok(!inside.includes('<page-meta'));
    assert.ok(result.code.includes("const title = 'https://demo.puresnake.com';"), 'script 必须保持原样');
});

test('wrapPageTemplate 在 AST 模式下同样提取 page-meta', async () => {
    const descriptor = await parseSFC(PAGE_SFC);
    assert.ok(descriptor, '需要 vue/compiler-sfc 才能覆盖 AST 分支');

    const result = wrapPageTemplate(PAGE_SFC, descriptor);
    assert.ok(result);
    assert.ok(result.code.indexOf('<page-meta') < result.code.indexOf('<global-root-view>'));
    assert.ok(!result.code.slice(result.code.indexOf('<global-root-view>')).includes('<page-meta'));
});

test('wrapPageTemplate 对没有 template 的文件返回 null', () => {
    assert.equal(wrapPageTemplate('<script setup lang="ts">\nconst a = 1;\n</script>\n', null), null);
    assert.equal(wrapPageTemplate('<template><view /></template>\n', null)?.code.includes('<global-root-view>'), true);
});

test('registerRootApp 注入根组件导入并在 createSSRApp 之后注册', () => {
    const code = `import { createSSRApp } from 'vue';
import App from './App.vue';
export function createApp() {
    const app = createSSRApp(App);
    return { app };
}
`;
    const result = registerRootApp(code, 'App.root');

    assert.ok(result.code.startsWith('import GlobalRootView from "./App.root.vue";'));
    assert.ok(result.code.includes('app.component("global-root-view", GlobalRootView);'));
    assert.ok(!result.code.includes('.vue.cjs') && !result.code.includes('.vue.mjs'), '不能误补扩展名');
    assert.ok(
        result.code.indexOf('app.component("global-root-view"') > result.code.indexOf('const app = createSSRApp(App);'),
        '注册必须在 app 创建之后'
    );
    assert.equal(result.map.version, 3);
});

test('registerRootApp 在非 createSSRApp 写法下仍能注册', () => {
    const code = `import { createApp } from 'vue';
const app = createApp(App);
return { app };
`;
    const result = registerRootApp(code);

    assert.ok(result.code.includes('app.component("global-root-view", GlobalRootView);'));
    assert.ok(result.code.indexOf('app.component("global-root-view"') < result.code.indexOf('return { app }'));
    assert.ok(result.code.startsWith('import GlobalRootView from "./App.root.vue";'), '默认文件名为 App.root');
});

test('plugins 入口导出 UniRoot，且 dist 产物与源码行为一致', async () => {
    const entry = await import('../src/uni_modules/snake-ui/plugins/index.mjs');
    assert.equal(typeof entry.UniRoot, 'function');

    const samples = [
        '{}',
        '{\n  // 单行\n  "a": "https://example.com//x"\n}',
        '{ /* 块 */ "a": "say \\"// hi\\"" }',
        '{\n  "pages": [{ "path": "pages/index/index" }]\n} // 末尾注释'
    ];
    for (const sample of samples) {
        assert.equal(
            builtUtils.stripJsonComments(sample),
            stripJsonComments(sample),
            'src 与 dist 的 JSONC 结果必须一致'
        );
    }

    const built = await builtTransformPage(PAGE_SFC);
    const source = wrapPageTemplate(PAGE_SFC, await parseSFC(PAGE_SFC));
    assert.ok(existsSync(join(distBase, 'utils.mjs')), 'dist 产物缺失：请执行 pnpm build:plugins');
    assert.deepEqual(built, source, 'dist/plugins 未重新构建：请执行 pnpm build:plugins');
    assert.ok(built.code.includes('<global-root-view>'));
});
