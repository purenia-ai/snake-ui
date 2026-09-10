import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const root = new URL('../src/uni_modules/snake-ui/', import.meta.url);
const components = [
    'snake-button',
    'snake-loading-icon',
    'snake-skeleton',
    'snake-skeleton-item',
    'snake-transition',
    'snake-empty',
    'snake-icon',
    'snake-image',
    'snake-lazy-image',
    'snake-loadmore',
    'snake-notice-bar',
    'snake-navbar',
    'snake-overlay',
    'snake-popup',
    'snake-sticky',
    'snake-swiper',
    'snake-tabs',
    'snake-upload',
    'snake-button-sort',
    'snake-drop-menu',
    'snake-drop-menu-item',
    'snake-index-list',
    'snake-index-list-panel',
    'snake-index-anchor',
    'snake-cell-group',
    'snake-cell-item',
    'snake-line',
    'snake-line-progress',
    'snake-search',
    'snake-select',
    'snake-read-more',
    'snake-no-network',
    'snake-link',
    'snake-text',
    'snake-calendar',
    'snake-count-down'
];

test('every public component exposes an independent type contract', async () => {
    const componentRoot = new URL('components/', root);
    const directories = (await readdir(componentRoot, { withFileTypes: true }))
        .filter(entry => entry.isDirectory() && entry.name.startsWith('snake-'))
        .map(entry => entry.name)
        .sort();
    const packageEntry = await readFile(new URL('index.ts', root), 'utf8');
    const declarationEntry = await readFile(new URL('types/components.d.ts', root), 'utf8');

    assert.equal(directories.length, 71);
    for (const component of directories) {
        const types = await readFile(new URL(`components/${component}/types.ts`, root), 'utf8');
        assert.match(types, /export (?:interface|type) [A-Z]/, `${component}: missing public contract`);
        assert.match(
            packageEntry,
            new RegExp(`export \\* from './components/${component}/types'`),
            `${component}: missing type export`
        );
        assert.match(
            declarationEntry,
            new RegExp(`export \\* from '../components/${component}/types'`),
            `${component}: missing declaration export`
        );
    }
});

test('every public type contract is documented for IDE consumers', async () => {
    const componentRoot = new URL('components/', root);
    const directories = (await readdir(componentRoot, { withFileTypes: true }))
        .filter(entry => entry.isDirectory() && entry.name.startsWith('snake-'))
        .map(entry => entry.name)
        .sort();

    for (const component of directories) {
        const path = `components/${component}/types.ts`;
        const source = await readFile(new URL(path, root), 'utf8');
        const sourceFile = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
        const hasDocs = node => Boolean(node.jsDoc?.length);

        for (const statement of sourceFile.statements) {
            const exported = statement.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword);
            if (!exported) continue;
            if (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) {
                assert.ok(hasDocs(statement), `${component}: ${statement.name.text} 缺少 JSDoc`);
                if (ts.isInterfaceDeclaration(statement)) {
                    for (const member of statement.members) {
                        assert.ok(
                            hasDocs(member),
                            `${component}: ${statement.name.text}.${member.name?.getText(sourceFile)} 缺少 JSDoc`
                        );
                    }
                }
            }
            if (ts.isVariableStatement(statement)) {
                for (const declaration of statement.declarationList.declarations) {
                    if (!ts.isIdentifier(declaration.name) || !declaration.name.text.endsWith('Props')) continue;
                    assert.ok(hasDocs(statement), `${component}: ${declaration.name.text} 缺少 JSDoc`);
                    const initializer = declaration.initializer;
                    if (
                        initializer &&
                        ts.isAsExpression(initializer) &&
                        ts.isObjectLiteralExpression(initializer.expression)
                    ) {
                        for (const property of initializer.expression.properties) {
                            assert.ok(
                                hasDocs(property),
                                `${component}: ${declaration.name.text}.${property.name?.getText(sourceFile)} 缺少 JSDoc`
                            );
                        }
                    }
                }
            }
        }
    }
});

test('every Vue component explains its role and documented components expose an entry', async () => {
    const componentRoot = new URL('components/', root);
    const undocumentedCmsComponents = new Set([
        'snake-activity-list',
        'snake-auxiliary-segmentation',
        'snake-commodity-search',
        'snake-coupon',
        'snake-custom-module',
        'snake-filter-sorts',
        'snake-floating-bubble',
        'snake-follow',
        'snake-goods-list',
        'snake-graphic-navigation',
        'snake-images',
        'snake-jump-applet',
        'snake-list-switching',
        'snake-magic-cube',
        'snake-notice',
        'snake-page-popup',
        'snake-picture-ads',
        'snake-rich-text',
        'snake-videos'
    ]);
    const directories = (await readdir(componentRoot, { withFileTypes: true }))
        .filter(entry => entry.isDirectory() && entry.name.startsWith('snake-'))
        .map(entry => entry.name)
        .sort();
    const files = directories.map(component => `components/${component}/${component}.vue`);
    files.push(
        'components/snake-filter-sorts/components/filter-page.vue',
        'components/snake-list-switching/components/tree-select/index.vue'
    );

    for (const path of files) {
        const source = await readFile(new URL(path, root), 'utf8');
        const component = path.split('/')[1];
        assert.match(source, /\/\*\*[\s\S]*@component (?:[A-Z]\w+|FilterPage|TreeSelect)/, `${path}: 缺少组件说明`);
        assert.match(source, /@description \S+/, `${path}: 缺少用途说明`);
        if (undocumentedCmsComponents.has(component)) {
            assert.doesNotMatch(source, /@see \/components\/[\w-]+/, `${path}: 不应链接已删除文档`);
        } else {
            assert.match(source, /@see \/components\/[\w-]+/, `${path}: 缺少文档入口`);
        }
    }
});

test('public foundation components use independent type contracts', async () => {
    for (const component of components) {
        const types = await readFile(new URL(`components/${component}/types.ts`, root), 'utf8');
        const source = await readFile(new URL(`components/${component}/${component}.vue`, root), 'utf8');
        assert.match(types, /export (?:interface|type) [A-Z]/);
        assert.match(source, /from '\.\/types'/);
    }
});

test('migrated controls use runtime props as the defaults source of truth', async () => {
    for (const [component, exportName] of [
        ['snake-button', 'buttonProps'],
        ['snake-checkbox', 'checkboxProps'],
        ['snake-radio', 'radioProps'],
        ['snake-cell-group', 'cellGroupProps'],
        ['snake-cell-item', 'cellItemProps'],
        ['snake-line', 'lineProps'],
        ['snake-line-progress', 'lineProgressProps'],
        ['snake-search', 'searchProps'],
        ['snake-select', 'selectProps'],
        ['snake-read-more', 'readMoreProps'],
        ['snake-no-network', 'noNetworkProps'],
        ['snake-link', 'linkProps'],
        ['snake-text', 'textProps'],
        ['snake-calendar', 'calendarProps'],
        ['snake-count-down', 'countDownProps']
    ]) {
        const types = await readFile(new URL(`components/${component}/types.ts`, root), 'utf8');
        const source = await readFile(new URL(`components/${component}/${component}.vue`, root), 'utf8');
        assert.match(types, new RegExp(`export const ${exportName} =`));
        assert.match(types, /ExtractPropTypes<typeof [a-z]\w+Props>/);
        assert.match(source, new RegExp(`defineProps\\(${exportName}\\)`));
        assert.doesNotMatch(source, /withDefaults\(defineProps/);
    }
});

test('button ripple follows the uView longest-edge wave model', async () => {
    const source = await readFile(new URL('components/snake-button/snake-button.vue', root), 'utf8');

    assert.match(source, /createSelectorQuery\(\)/);
    assert.match(source, /changedTouches|touches/);
    assert.match(source, /Math\.max\(rect\.height, rect\.width\)/);
    assert.match(source, /transform: scale\(2\)/);
});

test('package entry exposes precise foundation component props', async () => {
    const declarations = await readFile(new URL('types/components.d.ts', root), 'utf8');
    for (const component of [
        'Button',
        'LoadingIcon',
        'Transition',
        'Empty',
        'Icon',
        'Image',
        'LazyImage',
        'Loadmore',
        'NoticeBar',
        'Navbar',
        'Overlay',
        'Popup',
        'Sticky',
        'Swiper',
        'Tabs',
        'ButtonSort',
        'DropMenu',
        'DropMenuItem',
        'IndexList',
        'IndexListPanel',
        'IndexAnchor',
        'CellGroup',
        'CellItem',
        'Line',
        'LineProgress',
        'Search',
        'Select',
        'ReadMore',
        'NoNetwork',
        'Link',
        'Text',
        'Calendar'
    ]) {
        assert.match(declarations, new RegExp(`Snake${component}: Component<${component}Props`));
    }
});

test('theme stylesheet is published as an optional package entry', async () => {
    const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
    const theme = await readFile(new URL('theme.scss', root), 'utf8');
    assert.equal(manifest.exports['./theme.scss'], './theme.scss');
    assert.ok(manifest.files.includes('theme.scss'));
    assert.match(theme, /--snake-color-primary:/);
});

test('popup and overlay resolve visibility from the actually bound channel', async () => {
    // 回归：Vue 3 对未传递的 Boolean prop 做 boolean casting（false 而非 undefined），
    // `props.show ?? props.modelValue` 会让未绑定 show 的 v-model 通道被 false 短路，弹层永远打不开。
    for (const component of ['snake-overlay', 'snake-popup']) {
        const source = await readFile(new URL(`components/${component}/${component}.vue`, root), 'utf8');
        assert.doesNotMatch(
            source,
            /props\.show\s*\?\?\s*props\.modelValue/,
            `${component} 不能用 ?? 在 show 与 modelValue 间穿透（Boolean casting 下失效）`
        );
        assert.match(
            source,
            /'show' in \(getCurrentInstance\(\)\?\.vnode\?\.props/,
            `${component} 需检测父组件实际绑定的通道`
        );
    }
});

test('published styles avoid wxss-unsupported universal selectors', async () => {
    // 回归：微信小程序 WXSS 不支持通配选择器 `*`，上传时编译报
    // 「error at token `*`」（错误码 80058）。命中无 class 的包装容器时应补语义 class。
    const componentRoot = new URL('components/', root);
    const directories = (await readdir(componentRoot, { withFileTypes: true }))
        .filter(entry => entry.isDirectory() && entry.name.startsWith('snake-'))
        .map(entry => entry.name)
        .sort();
    const files = directories.map(component => `components/${component}/${component}.vue`);
    files.push(
        'components/snake-filter-sorts/components/filter-page.vue',
        'components/snake-list-switching/components/tree-select/index.vue'
    );

    for (const path of files) {
        const source = await readFile(new URL(path, root), 'utf8');
        const styles = [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(match => match[1]);
        for (const style of styles) {
            const clean = style
                .replace(/\/\*[\s\S]*?\*\//g, '')
                .replace(/\/\/[^\n]*/g, '')
                .replace(/(["'])(?:\\.|(?!\1).)*\1/g, '""');
            assert.doesNotMatch(clean, />\s*\*/, `${path}: WXSS 不支持通配选择器 *，请为子元素补显式 class`);
        }
    }
});

test('icon loads the complete bundled glyph set globally', async () => {
    const source = await readFile(new URL('components/snake-icon/snake-icon.vue', root), 'utf8');
    const namesSource = await readFile(new URL('components/snake-icon/icon-names.ts', root), 'utf8');
    const types = await readFile(new URL('components/snake-icon/types.ts', root), 'utf8');
    const stylesheet = await readFile(new URL('iconfont.css', root), 'utf8');
    const app = await readFile(new URL('../src/App.vue', import.meta.url), 'utf8');
    assert.ok(app.includes("@import './uni_modules/snake-ui/iconfont.css'"));
    assert.ok(!source.includes("@import '../../iconfont.css'"));
    assert.ok(source.includes("props.name.includes('/')"));
    assert.ok(source.includes("emit('click', props.index || event)"));
    assert.ok(source.includes("emit('touchstart', props.index || event)"));
    assert.ok(source.includes('showDecimalIcon'));
    assert.doesNotMatch(source, /glyphs|iconfontAliases|\bstop\b/);
    assert.match(stylesheet, /font-family: ["']snake-iconfont["']/);
    assert.match(stylesheet, /\.sicon-checkbox-mark::?before/);
    assert.match(stylesheet, /x-font-woff2/);
    const fontNames = [...stylesheet.matchAll(/\.sicon-([\w-]+):before/g)].map(([, name]) => name);
    const listedNames = [...namesSource.matchAll(/'([\w-]+)'/g)].map(([, name]) => name);
    assert.deepEqual(listedNames, fontNames, 'icon names stay in sync with iconfont.css');
    assert.ok(types.includes("'left' | 'right' | 'top' | 'bottom'"));
    assert.ok(types.includes("default: 'sicon'"));
    assert.ok(types.includes('showDecimalIcon'));
    assert.ok(types.includes('marginBottom'));
    for (const icon of ['search', 'checkmark-circle', 'warning', 'eye-off-outline', 'arrow-right']) {
        assert.match(stylesheet, new RegExp(`\\.sicon-${icon}::?before`), `${icon}: missing bundled glyph`);
    }
});
