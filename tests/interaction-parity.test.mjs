import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
const root = new URL('../src/uni_modules/snake-ui/', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');

test('feedback components expose complete states and interactions', async () => {
    const [empty, loadmore, notice] = await Promise.all([
        read('components/snake-empty/types.ts'),
        read('components/snake-loadmore/types.ts'),
        read('components/snake-notice-bar/types.ts')
    ]);
    for (const name of ['mode', 'iconSize', 'fontSize', 'marginTop']) assert.match(empty, new RegExp(`${name}\\?`));
    for (const name of ['iconType', 'isDot', 'loadmore']) assert.match(loadmore, new RegExp(name));
    for (const name of ['autoplay', 'moreIcon', 'closeIcon', 'playState', 'isCircular'])
        assert.match(notice, new RegExp(`${name}\\?`));
});

test('tabs and swiper expose navigation and indicator contracts', async () => {
    const [tabs, tabsSource, swiper] = await Promise.all([
        read('components/snake-tabs/types.ts'),
        read('components/snake-tabs/snake-tabs.vue'),
        read('components/snake-swiper/types.ts')
    ]);
    for (const name of ['barWidth', 'barHeight', 'gutter', 'isDot', 'showBar', 'itemWidth'])
        assert.match(tabs, new RegExp(`${name}\\?`));
    assert.match(tabs, /hidden\?/);
    assert.doesNotMatch(tabs, /disabled\?/);
    assert.match(tabsSource, /height:\s*80,[\s\S]*fontSize:\s*30/);
    assert.match(tabsSource, /barWidth:\s*40,[\s\S]*barHeight:\s*6,[\s\S]*gutter:\s*30/);
    assert.match(tabsSource, /createSelectorQuery\(\)\.in\(instance\?\.proxy/);
    assert.match(tabsSource, /const scrollLeft = ref\(0\)/);
    assert.match(tabsSource, /offsetLeft - \(componentWidth\.value - tabWidth\) \/ 2/);
    assert.match(tabsSource, /left - uni\.upx2px\(Number\(props\.barWidth\)\) \/ 2/);
    assert.match(tabsSource, /defineExpose\(\{ init, clickTab, scrollByIndex \}\)/);
    assert.doesNotMatch(tabsSource, /scroll-into-view/);
    assert.match(tabsSource, /'snake-tabs__scroll-flex': !isScroll/);
    assert.equal((tabsSource.match(/class="snake-tabs__bar"/g) || []).length, 1);
    const listSwitching = await read('components/snake-list-switching/snake-list-switching.vue');
    assert.match(listSwitching, /changeTabs\(index\)\s*{\s*this\.active1 = index/);
    for (const name of ['indicatorPos', 'effect3d', 'animationfinish', 'titleStyle'])
        assert.match(swiper, new RegExp(name));
});

test('tabs follow uView interaction scope while subsection keeps keyboard navigation', async () => {
    const [tabs, subsection] = await Promise.all([
        read('components/snake-tabs/snake-tabs.vue'),
        read('components/snake-subsection/snake-subsection.vue')
    ]);
    for (const marker of ['role="tablist"', 'role="tab"', 'aria-selected', '@keydown.left', '@keydown.right'])
        assert.doesNotMatch(tabs, new RegExp(marker.replace('.', '\\.')));
    for (const marker of [/role="tablist"/, /role="tab"/, /aria-selected/, /@keydown\.left/, /@keydown\.right/])
        assert.match(subsection, marker);
});

test('tabs keep labels on one line like uView', async () => {
    const tabs = await read('components/snake-tabs/snake-tabs.vue');
    assert.match(tabs, /\.snake-tabs__item \{[\s\S]*white-space: nowrap;/);
    assert.match(tabs, /\.snake-tabs__scroll-box \{[^}]*white-space: nowrap;/);
});

test('drop menu performs real measurement and both index list modes handle touch navigation', async () => {
    const [menu, item, list, panel] = await Promise.all([
        read('components/snake-drop-menu/snake-drop-menu.vue'),
        read('components/snake-drop-menu-item/types.ts'),
        read('components/snake-index-list/snake-index-list.vue'),
        read('components/snake-index-list-panel/snake-index-list-panel.vue')
    ]);
    assert.match(menu, /createSelectorQuery/);
    assert.match(menu, /boundingClientRect/);
    for (const name of ['modelValue', 'options', 'disabled']) assert.match(item, new RegExp(`${name}\\?`));
    for (const source of [list, panel]) {
        assert.match(source, /@touchstart\.stop\.prevent="touchSelect"/);
        assert.match(source, /scrollTo/);
        assert.match(source, /emit\('select'/);
    }
    assert.match(list, /uni\.pageScrollTo/);
    assert.doesNotMatch(list, /<scroll-view/);
    assert.match(panel, /<scroll-view/);
    assert.doesNotMatch(panel, /uni\.pageScrollTo/);
});

test('second parity batch remains independent from uView runtime', async () => {
    const names = [
        'empty',
        'loadmore',
        'notice-bar',
        'tabs',
        'swiper',
        'drop-menu',
        'drop-menu-item',
        'index-list',
        'index-list-panel',
        'index-anchor'
    ];
    const source = (await Promise.all(names.map(name => read(`components/snake-${name}/snake-${name}.vue`)))).join(
        '\n'
    );
    assert.doesNotMatch(source, /uni\.\$u|uview-pro|<u-/);
});

test('commerce actions expose keyboard semantics and clean transient timers', async () => {
    const [activities, filters, goods] = await Promise.all([
        read('components/snake-activity-list/snake-activity-list.vue'),
        read('components/snake-filter-sorts/snake-filter-sorts.vue'),
        read('components/snake-goods-list/snake-goods-list.vue')
    ]);
    assert.match(activities, /role="tablist"/);
    assert.match(activities, /@keydown\.left/);
    assert.match(activities, /beforeUnmount\(\)/);
    assert.match(activities, /clearTimeout\(this\.clickTimer\)/);
    for (const source of [filters, goods]) {
        assert.match(source, /tabindex/);
        assert.match(source, /@keydown\.enter/);
        assert.match(source, /@keydown\.space/);
    }
    assert.match(goods, /<snake-lazy-image\s+:src="imageFilter\(item\)"/);
    assert.match(goods, /mode="aspectFill"/);
    assert.match(goods, /height="100%"/);
    assert.doesNotMatch(goods, /<snake-lazy-image\s+:image=/);
});

test('commerce price sort uses legacy triangles while filter uses bundled directional icons', async () => {
    const [sort, dropItem] = await Promise.all([
        read('components/snake-button-sort/snake-button-sort.vue'),
        read('components/snake-drop-menu-item/snake-drop-menu-item.vue')
    ]);
    assert.match(sort, /class="snake-sort__arrow-up"/);
    assert.match(sort, /class="snake-sort__arrow-down"/);
    assert.match(sort, /border-bottom-color: var\(--snake-color-text-muted, #888891\)/);
    assert.match(sort, /border-top-color: var\(--snake-color-text-muted, #888891\)/);
    assert.doesNotMatch(sort, /<snake-icon/);
    assert.match(dropItem, /:name="isOpen \? 'arrow-up' : 'arrow-down'"/);
    assert.match(dropItem, /:size="menu\?\.menuIconSize\.value \|\| 18"/);
});

test('auction actions and active activity retain the legacy blue accent', async () => {
    const [activities, goods] = await Promise.all([
        read('components/snake-activity-list/snake-activity-list.vue'),
        read('components/snake-goods-list/snake-goods-list.vue')
    ]);
    assert.match(goods, /style\.backgroundColor = '#2d57e7'/);
    assert.match(goods, /\.auction__btn[\s\S]*color: #2d57e7;[\s\S]*border: 2rpx solid #2d57e7;/);
    assert.match(activities, /activity-list__item--active[\s\S]*border: 4rpx solid #2d57e7;/);
});

test('commerce filter panel gives percentage-height content a definite containing height', async () => {
    const [filters, filterPage] = await Promise.all([
        read('components/snake-filter-sorts/snake-filter-sorts.vue'),
        read('components/snake-filter-sorts/filter-page.vue')
    ]);
    assert.match(filters, /<snake-drop-menu-item[\s\S]*custom-style="height: 70vh"/);
    assert.match(filterPage, /<snake-index-list-panel/);
    assert.match(filterPage, /class="filter-page__brand-panel"/);
    assert.match(filterPage, /:customStyle="\{ flex: 1, minHeight: 0, height: 'auto' \}"/);
    assert.match(filterPage, /\.list-box \{[\s\S]*height: 100%;[\s\S]*min-height: 0;/);
    assert.match(filterPage, /\.filter-page__brand-panel \{[\s\S]*height: 100%;[\s\S]*min-height: 0;/);
    assert.match(filterPage, /uIndexListRef\?\.update\?\.\(\)/);
    assert.doesNotMatch(filterPage, /:scrollTop="scrollTop"/);
    assert.match(filterPage, /:index="indexList\[index\]"/);
});

test('CMS sticky keeps legacy enable semantics and explicit navigation offset', async () => {
    const [cms, sticky] = await Promise.all([
        read('components/snake-cms/snake-cms.vue'),
        read('components/snake-sticky/snake-sticky.vue')
    ]);
    assert.match(cms, /:disabled="resolveStickyDisabled\(item\.setStyle\.stickyDisabled\)"/);
    assert.match(cms, /function resolveStickyDisabled/);
    assert.match(cms, /:custom-nav-height="stickyCustomNavHeight"/);
    assert.match(sticky, /uni\.upx2px\(number\)/);
    assert.match(sticky, /unitNumber\(props\.customNavHeight\)/);
});

test('lazy goods images accept host-provided loading and error artwork through request states', async () => {
    const [lazyImage, goods] = await Promise.all([
        read('components/snake-lazy-image/snake-lazy-image.vue'),
        read('components/snake-goods-list/snake-goods-list.vue')
    ]);
    assert.match(lazyImage, /v-if="\$slots\.loading \|\| loadingImg"/);
    assert.match(lazyImage, /:src="loadingImg"/);
    assert.match(lazyImage, /:src="errorImg"/);
    assert.match(goods, /:loading-img="assets\.goodsLoading \|\| ''"/);
    assert.match(goods, /:error-img="assets\.goodsError \|\| ''"/);
});
