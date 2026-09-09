<template>
    <view
        v-if="filters.topFilter"
        id="filtersId"
        class="filter-sorts"
        :style="[{ backgroundColor: bgColor }, customStyle]"
    >
        <view class="filter-sorts__toolbar" role="toolbar" aria-label="商品排序与筛选">
            <template v-for="(item, index) in filters.topFilter" :key="index">
                <view
                    v-if="item.type === 'click'"
                    class="filter-sorts__item"
                    :class="{
                        'filter-sorts__item--active': filterParams['sort'] === item.value
                    }"
                    role="button"
                    tabindex="0"
                    :aria-pressed="filterParams['sort'] === item.value"
                    @click="sortSelectHandle('sort', item.value ?? '')"
                    @keydown.enter.prevent="sortSelectHandle('sort', item.value ?? '')"
                    @keydown.space.prevent="sortSelectHandle('sort', item.value ?? '')"
                >
                    {{ item.name }}
                </view>
                <snake-button-sort
                    v-if="item.type === 'sort'"
                    :title="item.name"
                    @change="(e: any) => sortSelectHandle('price', e.value)"
                ></snake-button-sort>
            </template>
            <snake-drop-menu ref="dropMenuRef" custom-style="flex: 1; min-width: 0; background: transparent;">
                <snake-drop-menu-item
                    title="筛选"
                    custom-style="height: 70vh"
                    :before-toggle="handleBeforeToggle"
                    @close="dropMenuClose"
                >
                    <filterPage
                        :show="showDrawer"
                        :filters="filters"
                        :defaultParams="filterParams"
                        @confirm="filterConfirm"
                    ></filterPage>
                </snake-drop-menu-item>
            </snake-drop-menu>
        </view>
    </view>
</template>
<script lang="ts" setup>
/**
 * @component SnakeFilterSorts
 * @description 组合顶部快捷排序、价格排序和多维筛选面板，并向父级输出统一查询参数。
 */

import { getCurrentInstance, onMounted, ref } from 'vue';
import filterPage from './components/filter-page.vue';
import SnakeButtonSort from '../snake-button-sort/snake-button-sort.vue';
import SnakeDropMenu from '../snake-drop-menu/snake-drop-menu.vue';
import SnakeDropMenuItem from '../snake-drop-menu-item/snake-drop-menu-item.vue';
import type { SnakeFilterSortsEmits, SnakeFilterSortsProps } from './types';

defineOptions({
    name: 'filter-sorts',
    options: {
        virtualHost: true,
        addGlobalClass: true,
        styleIsolation: 'shared'
    }
});

const props = withDefaults(defineProps<SnakeFilterSortsProps>(), {
    filters: () => ({}),
    defaultFilter: () => ({}),
    bgColor: 'transparent',
    sort: '',
    showTabs: true,
    goodsListLength: 0,
    customStyle: () => ({}),
    // @deprecated 弹层索引列表已使用独立的容器滚动，不再依赖页面 scrollTop。
    scrollTop: 0
});

const emit = defineEmits<SnakeFilterSortsEmits>();

const instance = getCurrentInstance();

const dropMenuRef = ref<{ updateDropMenuRect: () => void; colseAll: () => void } | null>(null);

const showDrawer = ref(false);
const filterParams = ref<Record<string, string | number | boolean>>({
    sort: 'auto',
    price: ''
});

const dropMenuOpen = () => {
    showDrawer.value = true;
};
const dropMenuClose = async () => {
    showDrawer.value = false;
};
// 异步打开
const handleBeforeToggle = async ({ resolve }: { resolve: (value: boolean) => void }) => {
    let scrollTop = 0;

    uni.createSelectorQuery()
        .in(instance)
        .selectViewport()
        .scrollOffset(res => {
            scrollTop = (res as UniApp.NodeInfo).scrollTop || 0;
        })
        .exec();

    const query = uni.createSelectorQuery().in(instance);
    query.select('#filtersId').boundingClientRect();
    query.exec(res => {
        const navbarHeight = 44;
        const tabsHeight = props.showTabs ? 42 : 0;
        scrollTop = scrollTop + (res[0]?.top || 0) - navbarHeight - tabsHeight;
        // #ifndef H5
        scrollTop = scrollTop - (uni.$snake.sys().statusBarHeight || 0);
        // #endif
        if (scrollTop > 0) {
            uni.pageScrollTo({
                scrollTop,
                duration: 0,
                success: () => {
                    dropMenuRef.value?.updateDropMenuRect();
                    dropMenuOpen();
                    resolve(true);
                }
            });
        } else {
            dropMenuRef.value?.updateDropMenuRect();
            dropMenuOpen();
            resolve(true);
        }
    });
};

// 排序选择
const sortSelectHandle = (propName: string | number, value: string) => {
    filterParams.value[propName] = value;
    dropMenuRef.value?.colseAll();
    emitChange();
};

// 确认筛选
const filterConfirm = (e: Record<string, string | number | boolean>) => {
    filterParams.value = {
        sort: filterParams.value.sort,
        price: filterParams.value.price,
        ...e
    };
    dropMenuRef.value?.colseAll();
    emitChange();
};
const emitChange = () => {
    emit('change', filterParams.value);
};

onMounted(async () => {
    await uni.$snake.sleep();
    filterParams.value.sort = props.sort;
});
</script>

<style lang="scss" scoped>
::v-deep .u-drawer-content {
    height: 100% !important;
}

.filter-sorts__toolbar {
    display: flex;
    flex: 1;
    align-items: center;
}

.filter-sorts__item {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    font-size: 26rpx;
}

.filter-sorts__item--active {
    color: var(--snake-color-primary, #06d290);
    font-weight: 500;
}
</style>
