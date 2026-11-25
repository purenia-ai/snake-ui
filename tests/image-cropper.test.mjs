import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
    clampPosition,
    clampScale,
    computeCutRect,
    parseAspectRatio,
    resolveInitialPlacement,
    rotatedSize,
    touchDistance
} from '../src/uni_modules/snake-ui/components/snake-image-cropper/geometry.ts';

const root = new URL('../src/uni_modules/snake-ui/', import.meta.url);
const workspaceRoot = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const readWorkspace = path => readFile(new URL(path, workspaceRoot), 'utf8');

const closeTo = (actual, expected, label) =>
    assert.ok(Math.abs(actual - expected) < 1e-6, `${label}: expected ${expected}, received ${actual}`);

// ---------------------------------------------------------------- 几何层单测

test('parseAspectRatio accepts both separators and refuses anything unusable', () => {
    assert.equal(parseAspectRatio('1:1'), 1);
    closeTo(parseAspectRatio('16:9'), 16 / 9, '16:9');
    closeTo(parseAspectRatio('4/3'), 4 / 3, '4/3');
    closeTo(parseAspectRatio(' 16 : 9 '), 16 / 9, 'padded 16:9');

    // 非法输入必须回退正方形，否则 NaN 会顺着裁剪框尺寸把整层撑没
    for (const invalid of ['', 'abc', '0:1', '1:0', '-1:1', '16', undefined, null]) {
        assert.equal(parseAspectRatio(invalid), 1, `invalid aspect ratio: ${String(invalid)}`);
    }
});

test('computeCutRect takes the largest centred rect that fits the stage', () => {
    assert.deepEqual(computeCutRect({ width: 375, height: 375, gap: 20, aspectRatio: '1:1' }), {
        width: 335,
        height: 335,
        left: 20,
        top: 20
    });

    const wide = computeCutRect({ width: 375, height: 500, gap: 20, aspectRatio: '16:9' });
    closeTo(wide.width, 335, 'wide width');
    closeTo(wide.height, 335 * (9 / 16), 'wide height');
    closeTo(wide.left, 20, 'wide left');
    closeTo(wide.top, (500 - wide.height) / 2, 'wide top');

    // 舞台太扁时按高度收缩，宽度跟着比例缩
    const flat = computeCutRect({ width: 375, height: 100, gap: 20, aspectRatio: '1:1' });
    closeTo(flat.width, 60, 'flat width');
    closeTo(flat.height, 60, 'flat height');
    closeTo(flat.left, 157.5, 'flat left');
    closeTo(flat.top, 20, 'flat top');
});

test('computeCutRect returns an empty rect when the gap eats the stage', () => {
    assert.deepEqual(computeCutRect({ width: 30, height: 30, gap: 20, aspectRatio: '1:1' }), {
        width: 0,
        height: 0,
        left: 0,
        top: 0
    });
});

test('resolveInitialPlacement covers the cut box for every image shape', () => {
    const wide = resolveInitialPlacement({
        imageWidth: 1000,
        imageHeight: 500,
        cutWidth: 335,
        cutHeight: 335,
        viewportWidth: 375,
        viewportHeight: 667
    });
    closeTo(wide.width, 670, 'wide width');
    closeTo(wide.height, 335, 'wide height');
    closeTo(wide.scale, 1, 'wide scale');

    const tall = resolveInitialPlacement({
        imageWidth: 500,
        imageHeight: 1000,
        cutWidth: 335,
        cutHeight: 335,
        viewportWidth: 375,
        viewportHeight: 667
    });
    closeTo(tall.width, 335, 'tall width');
    closeTo(tall.height, 670, 'tall height');

    // 显式 imgWidth 优先，缺的那一边按原图比例补
    const explicit = resolveInitialPlacement({
        imageWidth: 200,
        imageHeight: 100,
        cutWidth: 335,
        cutHeight: 335,
        imgWidth: 100,
        viewportWidth: 375,
        viewportHeight: 667
    });
    closeTo(explicit.width, 100, 'explicit width');
    closeTo(explicit.height, 50, 'explicit height');
    closeTo(explicit.scale, 6.7, 'explicit scale');

    // 百分比按视口宽度折算
    const percent = resolveInitialPlacement({
        imageWidth: 200,
        imageHeight: 200,
        cutWidth: 335,
        cutHeight: 335,
        imgWidth: '50%',
        viewportWidth: 375,
        viewportHeight: 667
    });
    closeTo(percent.width, 187.5, 'percent width');

    // 任何形状都必须满足「铺满裁剪框」，这是后续手势夹取的下限
    for (const imageWidth of [4000, 1200, 800, 640, 375, 200, 60]) {
        for (const imageHeight of [4000, 900, 800, 500, 375, 240, 60]) {
            const placement = resolveInitialPlacement({
                imageWidth,
                imageHeight,
                cutWidth: 335,
                cutHeight: 188.4375,
                viewportWidth: 375,
                viewportHeight: 667
            });
            const label = `${imageWidth}x${imageHeight}`;
            assert.ok(placement.width * placement.scale >= 335 - 1e-6, `${label}: must cover cut width`);
            assert.ok(placement.height * placement.scale >= 188.4375 - 1e-6, `${label}: must cover cut height`);
        }
    }

    // 拿不到原图尺寸时退回 0，由组件把确认按钮置灰
    assert.deepEqual(
        resolveInitialPlacement({
            imageWidth: 0,
            imageHeight: 0,
            cutWidth: 335,
            cutHeight: 335,
            viewportWidth: 375,
            viewportHeight: 667
        }),
        { width: 0, height: 0, scale: 1 }
    );
});

test('rotatedSize swaps the axes on quarter turns only', () => {
    assert.deepEqual(rotatedSize({ width: 100, height: 200, angle: 0 }), { width: 100, height: 200 });
    assert.deepEqual(rotatedSize({ width: 100, height: 200, angle: 90 }), { width: 200, height: 100 });
    assert.deepEqual(rotatedSize({ width: 100, height: 200, angle: 180 }), { width: 100, height: 200 });
    assert.deepEqual(rotatedSize({ width: 100, height: 200, angle: 270 }), { width: 200, height: 100 });
    assert.deepEqual(rotatedSize({ width: 100, height: 200, angle: -90 }), { width: 200, height: 100 });
    assert.deepEqual(rotatedSize({ width: 100, height: 200, angle: 360 }), { width: 100, height: 200 });
});

test('clampScale never lets the image shrink below the cut box', () => {
    closeTo(
        clampScale({ width: 100, height: 100, scale: 0.5, cutWidth: 335, cutHeight: 335, angle: 0 }),
        3.35,
        'small image'
    );
    closeTo(
        clampScale({ width: 1000, height: 1000, scale: 0.1, cutWidth: 335, cutHeight: 335, angle: 0 }),
        0.335,
        'large image'
    );
    // 旋转 90 度后按交换过的宽高判断覆盖率
    closeTo(
        clampScale({ width: 100, height: 200, scale: 0.5, cutWidth: 335, cutHeight: 335, angle: 90 }),
        3.35,
        'rotated image'
    );
    assert.equal(
        clampScale({ width: 100, height: 100, scale: 10, cutWidth: 335, cutHeight: 335, angle: 0 }),
        10,
        'zoom-in is preserved'
    );
    // 非法缩放按 1 处理，绝不返回 NaN
    closeTo(clampScale({ width: 100, height: 100, scale: NaN, cutWidth: 335, cutHeight: 335, angle: 0 }), 3.35, 'NaN');
});

test('clampPosition keeps the cut box filled and centres an undersized image', () => {
    const full = { width: 670, height: 670, scale: 1, cutWidth: 335, cutHeight: 335, angle: 0 };
    closeTo(clampPosition({ ...full, left: 167.5, top: 167.5 }).left, 167.5, 'inside');
    // 图片正好铺满时，中心点只能在裁剪框中心
    closeTo(clampPosition({ ...full, left: -100, top: -100 }).left, 0, 'left edge');
    closeTo(clampPosition({ ...full, left: 999, top: 999 }).top, 335, 'bottom edge');
    closeTo(clampPosition({ ...full, left: 100, top: 120 }).top, 120, 'kept as is');

    // 图片不足以覆盖时退化为居中，而不是产生反向区间
    const small = { width: 100, height: 100, scale: 1, cutWidth: 335, cutHeight: 335, angle: 0 };
    const centred = clampPosition({ ...small, left: 0, top: 0 });
    closeTo(centred.left, 167.5, 'degenerate left');
    closeTo(centred.top, 167.5, 'degenerate top');

    // 200x100 转过 90 度后是 100x200，放大 3.35 倍后刚好横向铺满、纵向更长
    const rotated = clampPosition({
        width: 200,
        height: 100,
        scale: 3.35,
        cutWidth: 335,
        cutHeight: 335,
        angle: 90,
        left: 0,
        top: 0
    });
    closeTo(rotated.left, 167.5, 'rotated left');
    closeTo(rotated.top, 0, 'rotated top');
});

test('touchDistance measures the hypotenuse between two fingers', () => {
    assert.equal(touchDistance({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
    assert.equal(touchDistance({ x: 10, y: 10 }, { x: 10, y: 10 }), 0);
    assert.equal(touchDistance({}, {}), 0);
});

// ------------------------------------------------------------ 源码契约单测

test('export canvas pairs save with restore so repeated exports do not accumulate transforms', async () => {
    const source = await read('components/snake-image-cropper/snake-image-cropper.vue');

    const save = source.indexOf('ctx.save()');
    const translate = source.indexOf('ctx.translate(');
    const rotate = source.indexOf('ctx.rotate(');
    const drawImage = source.indexOf('ctx.drawImage(');
    const restore = source.indexOf('ctx.restore()');

    for (const [label, position] of [
        ['save', save],
        ['translate', translate],
        ['rotate', rotate],
        ['drawImage', drawImage],
        ['restore', restore]
    ]) {
        assert.ok(position > -1, `${label}: missing`);
    }
    assert.ok(save < translate, 'save must come before translate');
    assert.ok(rotate < drawImage, 'rotate must come before drawImage');
    assert.ok(restore > drawImage, 'restore must come after drawImage');
    assert.equal(source.match(/ctx\.save\(\)/g).length, 1, 'exactly one save');
    assert.equal(source.match(/ctx\.restore\(\)/g).length, 1, 'exactly one restore');
});

test('drawImage uses the local path from getImageInfo instead of the network url', async () => {
    const source = await read('components/snake-image-cropper/snake-image-cropper.vue');

    // 小程序端网络图片必须先落成本地路径，直接传 URL 画出来是空白
    assert.match(source, /ctx\.drawImage\(\s*localPath\.value/);
    assert.doesNotMatch(source, /drawImage\(props\.src/);
    assert.doesNotMatch(source, /drawImage\(props\.src,/);
    assert.match(source, /localPath\.value = res\.path \|\| props\.src/);
    assert.match(source, /uni\.getImageInfo\(\{/);
});

test('geometry is imported rather than reimplemented inside the component', async () => {
    const source = await read('components/snake-image-cropper/snake-image-cropper.vue');

    assert.match(source, /from '\.\/geometry'/);
    for (const name of ['computeCutRect', 'clampPosition', 'clampScale', 'resolveInitialPlacement', 'touchDistance']) {
        assert.match(source, new RegExp(`(?:import[\\s\\S]{0,600})?\\b${name}\\(`), `${name}: not called`);
    }
    // 宽高比解析只能有一份，组件里不该再出现切分逻辑
    assert.doesNotMatch(source, /split\(\s*\/\[:\/\]/);
});

test('wheel-house dead code from the reference implementation stays out', async () => {
    const source = await read('components/snake-image-cropper/snake-image-cropper.vue');

    // wot-ui 里 throttle() / isThrottleActive / moveThrottleTimer 从未被调用
    assert.doesNotMatch(source, /isThrottleActive/);
    assert.doesNotMatch(source, /moveThrottleTimer/);
    assert.doesNotMatch(source, /function throttle\s*\(/);
});

test('scale clamping caps maxScale first and then floors at the cover scale', async () => {
    const source = await read('components/snake-image-cropper/snake-image-cropper.vue');

    // 顺序反了的话，max-scale 传小于 1 的值会把图片缩到露白
    assert.match(
        source,
        /const nextScale = Math\.min\(scale\.value \* \(distance \/ lastFingerDistance\), maxScaleValue\.value\);[\s\S]{0,120}?applyClamp\(nextScale\);/
    );
    assert.match(source, /Number\.isFinite\(value\) && value > 1 \? value : 1/);
});

test('rotation is normalised inside setRotate instead of a self-watching ref', async () => {
    const source = await read('components/snake-image-cropper/snake-image-cropper.vue');

    assert.match(source, /const turns = Math\.round\(numeric \/ 90\) % 4/);
    assert.match(source, /function setRotate\(value: number\)[\s\S]{0,200}?const next = normalizeAngle\(value\)/);
    assert.doesNotMatch(source, /watch\(\s*\(\) => angle\.value/);
});

test('confirm is gated on a loaded image and a usable cut box', async () => {
    const source = await read('components/snake-image-cropper/snake-image-cropper.vue');

    assert.match(
        source,
        /const canConfirm = computed\(\(\) => loaded\.value && !exporting\.value && cutRect\.value\.width > 0\)/
    );
    assert.match(source, /:disabled="!canConfirm"/);
    assert.match(source, /function draw\(\) \{\s*if \(!loaded\.value \|\| !localPath\.value\) return;/);
    assert.match(source, /v-if="!loaded" class="snake-image-cropper__status"/);
});

test('the cropper owns a full-screen layer instead of nesting inside a popup', async () => {
    const source = await read('components/snake-image-cropper/snake-image-cropper.vue');

    assert.match(source, /v-if="visible"[\s\S]{0,80}class="snake-image-cropper"/);
    assert.match(
        source,
        /const visible = computed\(\(\) => Boolean\(props\.modelValue \?\? props\.show \?\? false\)\)/
    );
    assert.match(source, /\.snake-image-cropper \{[\s\S]{0,200}?position: fixed;/);
    assert.match(source, /@touchmove\.stop="onRootTouchMove"/);
    assert.doesNotMatch(source, /<snake-popup|<SnakePopup/);
    assert.match(
        source,
        /defineOptions\(\{ name: 'SnakeImageCropper', options: \{ virtualHost: true, styleIsolation: 'shared' \} \}\)/
    );
    assert.match(source, /defineExpose<ImageCropperExpose>\(\{ setRotate, reset \}\)/);
});

test('the export canvas stays offscreen and uses the legacy canvas api', async () => {
    const source = await read('components/snake-image-cropper/snake-image-cropper.vue');

    assert.match(source, /<canvas[\s\S]{0,200}:canvas-id="canvasId"/);
    assert.match(source, /uni\.createCanvasContext\(canvasId/);
    assert.match(source, /uni\.canvasToTempFilePath\(/);
    // 离屏坐标取负自身尺寸；用 top: -200% 在宽屏下会盖住裁剪界面
    assert.match(source, /left: addUnit\(-canvasWidth\.value\)/);
    assert.match(source, /top: addUnit\(-canvasHeight\.value\)/);
    assert.match(source, /Math\.round\(Number\(props\.exportScale\)\)/);
});

test('types pin the visibility defaults and expose contract', async () => {
    const types = await read('components/snake-image-cropper/types.ts');

    // 默认 undefined 才能区分「没绑」和「绑了 false」
    assert.match(types, /modelValue: \{ type: Boolean, default: undefined \}/);
    assert.match(types, /show: \{ type: Boolean, default: undefined \}/);
    assert.match(types, /aspectRatio: \{ type: String, default: '1:1' \}/);
    assert.match(types, /maxScale: \{ type: Number, default: 3 \}/);
    assert.match(types, /exportScale: \{ type: Number, default: 2 \}/);
    assert.match(types, /export interface ImageCropperExpose \{/);
    assert.match(types, /setRotate\(angle: number\): void;/);
    assert.match(types, /reset\(\): void;/);
    assert.match(
        types,
        /export type ImageCropperInstance = ComponentPublicInstance<ImageCropperProps, ImageCropperExpose>/
    );
    assert.match(types, /export type ImageCropperEmits = \{[\s\S]{0,400}?confirm: \[result: ImageCropperResult\]/);
});

test('image cropper is registered across every entry point', async () => {
    const [packageEntry, componentTypes, pages, config, groupsAuthor] = await Promise.all([
        read('index.ts'),
        read('types/components.d.ts'),
        readWorkspace('src/pages.json'),
        readWorkspace('src/pages/example/components.config.ts'),
        readWorkspace('docs/.vitepress/component-groups.ts')
    ]);

    assert.match(packageEntry, /export \* from '\.\/components\/snake-image-cropper\/types'/);
    assert.match(componentTypes, /SnakeImageCropper/);
    assert.match(componentTypes, /ImageCropperEmits, ImageCropperProps/);
    assert.match(pages, /"path":\s*"imageCropper\/index"/);
    assert.match(config, /item\(\s*'\/pages\/componentsA\/imageCropper\/index'/);
    assert.match(groupsAuthor, /'\/components\/image-cropper':/);
    assert.match(groupsAuthor, /\{ name: 'ImageCropper', title: '图片裁剪', link: '\/components\/image-cropper' \}/);
});

test('footer keeps a base bottom gap and a locked button row height', async () => {
    const source = await read('components/snake-image-cropper/snake-image-cropper.vue');

    // 行内 paddingBottom 会覆盖样式里的 padding 简写：只写 safeBottom 的话，
    // H5（safeBottom 为 0）上按钮会直接贴住屏幕底边
    assert.match(source, /const FOOTER_PADDING = 16/);
    assert.match(source, /paddingBottom: addUnit\(FOOTER_PADDING \+ viewport\.value\.safeBottom\)/);
    assert.match(source, /\.snake-image-cropper__footer \{[\s\S]{0,260}?padding: 16px;/);

    // 按钮行按 snake-button size="large" 的 46px 算，JS 预留高度必须与样式行高同源
    assert.match(source, /const FOOTER_HEIGHT = FOOTER_PADDING \* 2 \+ TOOLBAR_HEIGHT \+ 12 \+ 46/);
    assert.match(source, /const TOOLBAR_HEIGHT = 40/);
    assert.match(source, /\.snake-image-cropper__tools \{[\s\S]{0,140}?height: 40px;/);
    assert.match(source, /\.snake-image-cropper__buttons \{[\s\S]{0,140}?height: 46px;/);

    // 工具行居中放在按钮行上方，而不是贴在左下角；图标不能小到看不清或点不中
    assert.match(source, /class="snake-image-cropper__tools"/);
    assert.match(source, /\.snake-image-cropper__tools \{[\s\S]{0,140}?justify-content: center;/);
    assert.match(source, /const ROTATE_ICON_SIZE = 28/);
    assert.match(source, /:size="ROTATE_ICON_SIZE"/);
    assert.match(source, /\.snake-image-cropper__rotate \{[\s\S]{0,140}?height: 40px;/);
});

test('demo page and documentation follow the house shape', async () => {
    const [demo, markdown] = await Promise.all([
        readWorkspace('src/pages/componentsA/imageCropper/index.vue'),
        readWorkspace('docs/components/image-cropper.md')
    ]);

    assert.match(demo, /<DemoPage/);
    assert.match(demo, /<DemoControlPanel/);
    assert.match(demo, /satisfies readonly DemoControl\[\]/);
    assert.match(demo, /const cropperRef = ref<ImageCropperExpose \| null>\(null\)/);

    assert.match(markdown, /^preview:\s*\/pages\/componentsA\/imageCropper\/index$/m);
    assert.match(markdown, /\|\s*H5\s*\|\s*App\s*\|\s*微信小程序\s*\|\s*支付宝小程序\s*\|/);
    assert.match(markdown, /\|\s*(?:√|—)\s*\|\s*(?:√|—)\s*\|\s*(?:√|—)\s*\|\s*(?:√|—)\s*\|/);
    assert.match(markdown, /^## 基础用法$/m);
    assert.match(markdown, /^## API$/m);
    assert.match(markdown, /^#{3,4} Props$/m);
    assert.match(markdown, /^## 主题变量$/m);
});
