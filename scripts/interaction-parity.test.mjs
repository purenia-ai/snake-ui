import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
const root = new URL('../src/uni_modules/snake-ui/', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');

test('feedback components expose complete states and interactions', async () => {
  const [empty, loadmore, notice] = await Promise.all([read('components/snake-empty/types.ts'), read('components/snake-loadmore/types.ts'), read('components/snake-notice-bar/types.ts')]);
  for (const name of ['mode', 'iconSize', 'fontSize', 'marginTop']) assert.match(empty, new RegExp(`${name}\\?`));
  for (const name of ['iconType', 'isDot', 'loadmore']) assert.match(loadmore, new RegExp(name));
  for (const name of ['autoplay', 'moreIcon', 'closeIcon', 'playState', 'isCircular']) assert.match(notice, new RegExp(`${name}\\?`));
});

test('tabs and swiper expose navigation and indicator contracts', async () => {
  const [tabs, swiper] = await Promise.all([read('components/snake-tabs/types.ts'), read('components/snake-swiper/types.ts')]);
  for (const name of ['barWidth', 'barHeight', 'gutter', 'isDot', 'showBar', 'itemWidth']) assert.match(tabs, new RegExp(`${name}\\?`));
  for (const name of ['indicatorPos', 'effect3d', 'animationfinish', 'titleStyle']) assert.match(swiper, new RegExp(name));
});

test('drop menu performs real measurement and index list handles touch navigation', async () => {
  const [menu, item, list] = await Promise.all([read('components/snake-drop-menu/snake-drop-menu.vue'), read('components/snake-drop-menu-item/types.ts'), read('components/snake-index-list/snake-index-list.vue')]);
  assert.match(menu, /createSelectorQuery/);
  assert.match(menu, /boundingClientRect/);
  for (const name of ['modelValue', 'options', 'disabled']) assert.match(item, new RegExp(`${name}\\?`));
  assert.match(list, /@touchstart\.stop\.prevent="touchSelect"/);
  assert.match(list, /scrollTo/);
  assert.match(list, /emit\('select'/);
});

test('second parity batch remains independent from uView runtime', async () => {
  const names = ['empty', 'loadmore', 'notice-bar', 'tabs', 'swiper', 'drop-menu', 'drop-menu-item', 'index-list', 'index-anchor'];
  const source = (await Promise.all(names.map(name => read(`components/snake-${name}/snake-${name}.vue`)))).join('\n');
  assert.doesNotMatch(source, /uni\.\$u|uview-pro|<u-/);
});
