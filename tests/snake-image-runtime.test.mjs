import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test, { after } from 'node:test';
import { compileScript, parse } from 'vue/compiler-sfc';

// `.vue` 无法直接被 node 载入，这里用仓库自带的 vue 编译器把 SFC 编成临时 `.ts`，
// 再用一个零依赖的自定义渲染器（createRenderer）真正挂载起来跑状态机。
// 目的：用运行期证据守住 `src` 变化 / `reload()` 时「同一 children 数组内 key 唯一」。
// —— 修复前该用例必然失败：`<image>` 的 key 取 imageKey 计数器（0/1/2…），
// 第一次换地址后与加载占位层的编译期 key（1）重复，控制台报
// `Duplicate keys found during update: 1`。

const componentUrl = new URL('../src/uni_modules/snake-ui/components/snake-image/snake-image.vue', import.meta.url);
const unitUrl = new URL('../src/uni_modules/snake-ui/libs/function/unit.ts', import.meta.url);
// 与 `import 'vue'` 落在同一个模块实例上，否则响应式与 currentInstance 会分裂。
const vueUrl = new URL('../node_modules/vue/index.mjs', import.meta.url);

const vue = await import(vueUrl.href);

// node 不对 node_modules 做类型擦除，所以编译产物落在 os.tmpdir，并自带 package.json 声明 ESM。
const tempDir = await mkdtemp(join(tmpdir(), 'snake-ui-image-'));
after(() => rm(tempDir, { recursive: true, force: true }));

const component = await (async () => {
    const source = await readFile(componentUrl, 'utf8');
    // 必须是绝对路径：compiler-sfc 靠它解析 `./types` 里的 props 类型。
    const filename = fileURLToPath(componentUrl);
    const { descriptor, errors } = parse(source, { filename });
    assert.deepEqual(errors, [], 'snake-image.vue should parse without SFC errors');

    const { content } = compileScript(descriptor, {
        id: 'snake-image',
        inlineTemplate: true,
        templateOptions: { compilerOptions: { mode: 'module' } }
    });
    const code = content
        .replace(/from ["']vue["']/g, `from ${JSON.stringify(vueUrl.href)}`)
        .replace(/from ["']\.\.\/\.\.\/libs\/function\/unit["']/g, `from ${JSON.stringify(unitUrl.href)}`);

    await writeFile(join(tempDir, 'package.json'), '{"type":"module"}');
    await writeFile(join(tempDir, 'snake-image.ts'), code);
    return (await import(pathToFileURL(join(tempDir, 'snake-image.ts')).href)).default;
})();

const makeNode = tag => ({ tag, children: [], props: {}, parent: null });

/** 最小渲染器节点操作：只保留 patch / 移动 / 卸载所需的语义，无 DOM 依赖。 */
function createHostRenderer() {
    return vue.createRenderer({
        createElement: makeNode,
        createText: text => ({ tag: '#text', text, children: [], parent: null }),
        createComment: text => ({ tag: '#comment', text, children: [], parent: null }),
        setText: (node, text) => {
            node.text = text;
        },
        setElementText: (el, text) => {
            el.children = [];
            el.text = text;
        },
        insert: (child, parent, anchor) => {
            child.parent = parent;
            const index = anchor ? parent.children.indexOf(anchor) : -1;
            if (index >= 0) parent.children.splice(index, 0, child);
            else parent.children.push(child);
        },
        remove: child => {
            const siblings = child.parent?.children ?? [];
            const index = siblings.indexOf(child);
            if (index >= 0) siblings.splice(index, 1);
            child.parent = null;
        },
        parentNode: node => node.parent,
        nextSibling: node => {
            const siblings = node.parent?.children ?? [];
            return siblings[siblings.indexOf(node) + 1] ?? null;
        },
        querySelector: () => null,
        setScopeId: (el, id) => {
            el.scopeId = id;
        },
        cloneNode: node => ({ ...node, children: [] }),
        insertStaticContent: () => [makeNode('#static'), null],
        patchProp: (el, key, previous, next) => {
            el.props[key] = next;
        }
    });
}

const iconStub = { name: 'SnakeIcon', props: ['name', 'size'], render: () => vue.h('icon-stub', {}) };

/**
 * 挂载 snake-image 并暴露：改 props、读当前 vnode、读渲染出的节点。
 * 外层包一个持有 reactive props 的壳组件，这样始终是同一个 snake-image 实例在更新
 * （直接 render 一个裸 vnode 会另起实例，丢掉 appContext 的组件注册）。
 */
function createHarness() {
    const state = vue.reactive({ src: '', height: '100px' });
    const renderer = createHostRenderer();
    const container = makeNode('#root');
    const app = renderer.createApp({
        name: 'Harness',
        setup: () => () => vue.h(component, { ...state })
    });
    app.component('snake-icon', iconStub);
    app.mount(container);

    const setProps = async next => {
        Object.assign(state, next);
        await vue.nextTick();
    };
    const instance = () => container._vnode.component.subTree.component;
    const subtree = () => instance().subTree;
    const elements = () => container.children[0].children.filter(node => node.tag !== '#comment');
    const findElement = tag => elements().find(node => node.tag === tag);
    const classNameOf = node => String(node?.props?.class ?? '');
    const keysOfChildren = () =>
        (subtree().children ?? [])
            .filter(child => child && typeof child === 'object' && child.key != null)
            .map(child => child.key);

    return { setProps, instance, subtree, elements, findElement, classNameOf, keysOfChildren };
}

/** 同一 children 数组里出现重复 key 就是本次修复要根除的问题，这里直接遍历 vnode 断言。 */
function assertUniqueKeys(vnode, path, seen = new Set()) {
    if (!vnode || typeof vnode !== 'object' || seen.has(vnode)) return;
    seen.add(vnode);

    const children = Array.isArray(vnode.children) ? vnode.children : [];
    const keys = new Set();
    for (const child of children) {
        if (!child || typeof child !== 'object' || child.key == null) continue;
        assert.ok(!keys.has(child.key), `${path}: duplicate key ${String(child.key)}`);
        keys.add(child.key);
    }
    for (const child of children) assertUniqueKeys(child, `${path}/${String(vnode.type?.name ?? vnode.type)}`, seen);
    if (vnode.component)
        assertUniqueKeys(vnode.component.subTree, `${path}/<${vnode.component.type?.name ?? ''}>`, seen);
}

/** 断言一段操作期间控制台没有出现重复 key 警告（dev 版 Vue 的对应报错）。 */
async function captureWarnings(run) {
    const warnings = [];
    const original = console.warn;
    console.warn = (...args) => {
        warnings.push(args.map(String).join(' '));
    };
    try {
        await run();
    } finally {
        console.warn = original;
    }
    return warnings.filter(message => /Duplicate keys/i.test(message));
}

test('snake-image never produces duplicate keys when src changes', async () => {
    const harness = createHarness();

    const warnings = await captureWarnings(async () => {
        for (const [index, src] of ['/first.png', '/second.png', '/third.png', '/fourth.png'].entries()) {
            await harness.setProps({ src, height: '100px' });
            assertUniqueKeys(harness.subtree(), `render${index}`);
            // 图片节点与加载占位层同时存在，正是历史上撞 key 的现场。
            assert.equal(
                harness.findElement('image')?.tag,
                'image',
                'the image node should stay mounted while loading'
            );
        }
    });

    assert.deepEqual(warnings, [], 'no duplicate-key warning may be emitted');
    assert.deepEqual(harness.keysOfChildren(), [0, 1], 'keys stay compiler-owned across src changes');
});

test('snake-image keeps the image node when only src changes', async () => {
    const harness = createHarness();
    await harness.setProps({ src: '/first.png', height: '100px' });
    const image = harness.findElement('image');

    await harness.setProps({ src: '/second.png', height: '100px' });

    // 换地址由原生 image 自己重新请求，不再销毁重建（否则淡入被打断、多一次闪烁）。
    assert.equal(harness.findElement('image'), image, 'the same image node should be patched in place');
});

test('snake-image remounts the image through reload() without a key swap', async () => {
    const harness = createHarness();
    await harness.setProps({ src: '/first.png', height: '100px' });
    const before = harness.findElement('image');
    assert.ok(before, 'image should be mounted before reload');

    const warnings = await captureWarnings(async () => {
        await harness.instance().exposed.reload();
        await harness.setProps({});
        assertUniqueKeys(harness.subtree(), 'afterReload');
    });

    const after = harness.findElement('image');
    assert.deepEqual(warnings, []);
    assert.ok(after, 'image should be mounted again after reload');
    assert.notEqual(after, before, 'reload must mount a fresh node so the same URL is requested again');
    assert.match(harness.classNameOf(harness.findElement('view')), /snake-image__status/, 'status returns to loading');
});

test('snake-image drops the image on failure and floors auto height', async () => {
    const harness = createHarness();
    await harness.setProps({ src: '/broken.png', height: 'auto' });

    const image = harness.findElement('image');
    assert.ok(image, 'image should be mounted before the error');
    image.props.onError({});

    await harness.setProps({});
    assert.equal(
        harness.findElement('image'),
        undefined,
        'a failed image is unmounted (aligned with wot-ui / uView-Pro)'
    );

    const placeholder = harness.findElement('view');
    assert.match(harness.classNameOf(placeholder), /snake-image__status--error/);
    // `height="auto"` 时图片已卸载，占位层必须参与布局，容器高度才不会塌成 0。
    assert.match(harness.classNameOf(placeholder), /snake-image__status--flow/);

    const recovered = await captureWarnings(async () => {
        await harness.instance().exposed.reload();
        await harness.setProps({});
    });
    assert.deepEqual(recovered, []);
    assert.ok(harness.findElement('image'), 'reload() re-mounts the image after a failure');
});
