import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { addUnit, from375, from750, pxToRpx, unitToPx } from '../src/uni_modules/snake-ui/libs/function/unit.ts';

test('addUnit preserves explicit units and applies a default to numeric values', () => {
    assert.equal(addUnit(12), '12px');
    assert.equal(addUnit('12', 'rpx'), '12rpx');
    assert.equal(addUnit('50%'), '50%');
});

test('addUnit appends the unit to every space-separated segment', () => {
    assert.equal(addUnit('10 20'), '10px 20px');
    assert.equal(addUnit('10 20', 'rpx'), '10rpx 20rpx');
    assert.equal(addUnit('10rpx 20'), '10rpx 20px');
    assert.equal(addUnit('10 auto'), '10px auto');
});

test('from750 restores legacy v1 CMS values as width-proportional rpx', () => {
    assert.equal(from750(30), '30rpx');
    assert.equal(from750('72'), '72rpx');
    assert.equal(from750(188), '188rpx');
    assert.equal(from750(undefined), '0rpx');
    assert.equal(from750('10px'), '10px');
});

test('from375 scales 375-draft px v1 CMS values into rpx', () => {
    assert.equal(from375(15), '30rpx');
    assert.equal(from375('12'), '24rpx');
    assert.equal(from375(94), '188rpx');
    assert.equal(from375(undefined), '0rpx');
    assert.equal(from375('10px'), '10px');
});

test('pxToRpx converts physical pixels using the current viewport width', () => {
    assert.equal(pxToRpx(12, 375), '24rpx');
    assert.equal(pxToRpx('7.5', 375), '15rpx');
});

test('pxToRpx safely handles invalid values and viewport widths', () => {
    assert.equal(pxToRpx(undefined, 375), '0rpx');
    assert.equal(pxToRpx('invalid', 375), '0rpx');
    assert.equal(pxToRpx(12, 0), '0rpx');
});

test('components do not depend on a custom uni.$u.pxTorpx extension', async () => {
    const componentPaths = [
        'src/uni_modules/snake-ui/components/snake-graphic-navigation/snake-graphic-navigation.vue',
        'src/uni_modules/snake-ui/components/snake-magic-cube/snake-magic-cube.vue'
    ];
    const sources = await Promise.all(componentPaths.map(path => readFile(path, 'utf8')));
    assert.equal(
        sources.some(source => source.includes('uni.$u.pxTorpx')),
        false
    );
});

test('Options API exposes px helpers to the graphic navigation template', async () => {
    const source = await readFile(
        'src/uni_modules/snake-ui/components/snake-graphic-navigation/snake-graphic-navigation.vue',
        'utf8'
    );
    assert.match(source, /methods:\s*{\s*addUnit\b/);
    assert.match(source, /from750\b/);
});

test('bare px helper calls in templates are reachable on the render context', async () => {
    const { readdir } = await import('node:fs/promises');
    const { join } = await import('node:path');
    const root = 'src/uni_modules/snake-ui/components';
    const bareCall = /(^|[^.\w$])(from750|from375|addUnit)\(/g;
    const offenders = [];
    const walk = async dir => {
        for (const entry of await readdir(dir, { withFileTypes: true })) {
            const full = join(dir, entry.name);
            if (entry.isDirectory()) {
                await walk(full);
            } else if (entry.name.endsWith('.vue')) {
                const source = await readFile(full, 'utf8');
                // Template = everything before the first <script block.
                const scriptStart = source.indexOf('<script');
                const template = scriptStart === -1 ? source : source.slice(0, scriptStart);
                const names = new Set();
                for (const match of template.matchAll(bareCall)) names.add(match[2]);
                if (names.size === 0) continue;
                // <script setup> exposes imports to the template automatically.
                if (/^<script[^>]*\bsetup\b/m.test(source)) continue;
                // Options API must register the helper (e.g. `from750,` shorthand in methods).
                for (const name of names) {
                    const registered = new RegExp(`^\\s*${name}\\s*,\\s*$`, 'm').test(source);
                    if (!registered) offenders.push(`${full.replaceAll('\\', '/')}: ${name}`);
                }
            }
        }
    };
    await walk(root);
    assert.deepEqual(offenders, []);
});

test('v1 CMS pictureads swiper bindings follow the 375-draft px contract', async () => {
    const source = await readFile(
        'src/uni_modules/snake-ui/components/snake-picture-ads/snake-picture-ads.vue',
        'utf8'
    );
    // Stored height is a 375-draft px value: render via from375 (width-proportional rpx).
    assert.doesNotMatch(source, /datas\.height\s*\*\s*2/);
    assert.match(source, /:height="\$snake\.from375\(datas\.height\)"/);
    // Stored borderRadius is a 750-draft value rendered through the swiper radius prop.
    assert.match(source, /:radius="\$snake\.from750\(datas\.borderRadius\)"/);
});

test('component templates never concatenate rpx unit literals', async () => {
    const { readdir } = await import('node:fs/promises');
    const { join } = await import('node:path');
    const root = 'src/uni_modules/snake-ui/components';
    const offenders = [];
    const walk = async dir => {
        for (const entry of await readdir(dir, { withFileTypes: true })) {
            const full = join(dir, entry.name);
            if (entry.isDirectory()) {
                await walk(full);
            } else if (entry.name.endsWith('.vue')) {
                const source = await readFile(full, 'utf8');
                if (/['"]rpx['"]/.test(source)) offenders.push(full.replaceAll('\\', '/'));
            }
        }
    };
    await walk(root);
    assert.deepEqual(offenders, []);
});

test('library no longer uses numeric rpx values (375-draft px only)', async () => {
    const { readdir, readFile } = await import('node:fs/promises');
    const { join } = await import('node:path');
    const root = 'src/uni_modules/snake-ui';
    const offenders = [];
    const walk = async dir => {
        for (const entry of await readdir(dir, { withFileTypes: true })) {
            const full = join(dir, entry.name);
            if (entry.isDirectory()) {
                await walk(full);
            } else if (/\.(vue|scss|ts)$/.test(entry.name)) {
                if (full.replaceAll('\\', '/').endsWith('libs/function/unit.ts')) continue;
                const source = await readFile(full, 'utf8');
                if (/\d+(?:\.\d+)?rpx/.test(source)) offenders.push(full.replaceAll('\\', '/'));
            }
        }
    };
    await walk(root);
    assert.deepEqual(offenders, []);
});

test('demo pages and shared demo components use px literals, not rpx', async () => {
    const { readdir } = await import('node:fs/promises');
    const { join } = await import('node:path');
    const roots = ['src/pages', 'src/components'];
    const offenders = [];
    const walk = async dir => {
        for (const entry of await readdir(dir, { withFileTypes: true })) {
            const full = join(dir, entry.name);
            if (entry.isDirectory()) {
                await walk(full);
            } else if (entry.name.endsWith('.vue')) {
                const source = await readFile(full, 'utf8');
                if (/\d+(?:\.\d+)?rpx/.test(source)) offenders.push(full.replaceAll('\\', '/'));
            }
        }
    };
    for (const root of roots) await walk(root);
    assert.deepEqual(offenders, []);
});

test('native component demos (componentsA) declare slider units in px, not rpx', async () => {
    const { readdir } = await import('node:fs/promises');
    const { join } = await import('node:path');
    // componentsA 演示原生组件，数值经 addUnit 按 px 解释；rpx 单位属于 componentsB 的
    // v1 CMS 页（datas 数据经 from750 渲染为 rpx）。
    const root = 'src/pages/componentsA';
    const offenders = [];
    const walk = async dir => {
        for (const entry of await readdir(dir, { withFileTypes: true })) {
            const full = join(dir, entry.name);
            if (entry.isDirectory()) {
                await walk(full);
            } else if (entry.name.endsWith('.vue')) {
                const source = await readFile(full, 'utf8');
                if (source.includes("unit: 'rpx'")) offenders.push(full.replaceAll('\\', '/'));
            }
        }
    };
    await walk(root);
    assert.deepEqual(offenders, []);
});

test('unitToPx keeps geometry arithmetic safe for unit-bearing size props', () => {
    // 裸数字按库口径（375 稿 px）取数值本身
    assert.equal(unitToPx(50), 50);
    assert.equal(unitToPx('50'), 50);
    assert.equal(unitToPx('12px'), 12);
    // rpx 后缀在无 uni 的 node 环境按 1rpx = 0.5px 折算，不再产生 NaN
    assert.equal(unitToPx('50rpx'), 25);
    assert.equal(unitToPx('10RPX'), 5);
    // 空值与非法值归 0
    assert.equal(unitToPx(undefined), 0);
    assert.equal(unitToPx(''), 0);
    assert.equal(unitToPx('auto'), 0);
});
