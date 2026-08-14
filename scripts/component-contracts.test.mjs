import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../src/uni_modules/snake-ui/', import.meta.url);
const components = [
  'snake-button',
  'snake-empty',
  'snake-icon',
  'snake-image',
  'snake-lazy-image',
  'snake-loadmore',
  'snake-notice-bar',
  'snake-overlay',
  'snake-popup',
  'snake-sticky',
  'snake-swiper',
  'snake-tabs',
  'snake-button-sort',
  'snake-drop-menu',
  'snake-drop-menu-item',
  'snake-index-list',
  'snake-index-anchor',
];

test('public foundation components use independent type contracts', async () => {
  for (const component of components) {
    const types = await readFile(new URL(`components/${component}/types.ts`, root), 'utf8');
    const source = await readFile(new URL(`components/${component}/${component}.vue`, root), 'utf8');
    assert.match(types, /export (?:interface|type) Snake/);
    assert.match(source, /from '\.\/types'/);
  }
});

test('package entry exposes precise foundation component props', async () => {
  const declarations = await readFile(new URL('index.d.ts', root), 'utf8');
  for (const component of [
    'Button', 'Empty', 'Icon', 'Image', 'LazyImage', 'Loadmore',
    'NoticeBar', 'Overlay', 'Popup', 'Sticky', 'Swiper', 'Tabs',
    'ButtonSort', 'DropMenu', 'DropMenuItem', 'IndexList', 'IndexAnchor',
  ]) {
    assert.match(declarations, new RegExp(`Snake${component}: SnakeComponent<Snake${component}Props`));
  }
});

test('theme stylesheet is published as an optional package entry', async () => {
  const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
  const theme = await readFile(new URL('theme.scss', root), 'utf8');
  assert.equal(manifest.exports['./theme.scss'], './theme.scss');
  assert.ok(manifest.files.includes('theme.scss'));
  assert.match(theme, /--snake-color-primary:/);
});
