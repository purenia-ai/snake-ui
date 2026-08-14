<template>
  <view v-if="filters.topFilter" id="filtersId" class="filter-sorts" :style="[$snakeThemeStyle, { backgroundColor: bgColor }, customStyle]">
    <view class="flex-1 flex-items-center">
      <template v-for="(item, index) in filters.topFilter" :key="index">
        <view
          v-if="item.type === 'click'"
          class="flex-1 flex-center text-26rpx"
          :class="{
            'snake-green snake-font-medium fw-500': filterParams['sort'] === item.value,
          }"
          @click="sortSelectHandle('sort', item.value)">
          {{ item.name }}
        </view>
        <internal-button-sort
          v-if="item.type === 'sort'"
          :title="item.name"
          @change="(e: any) => sortSelectHandle('price', e.value)"></internal-button-sort>
      </template>
      <internal-drop-menu ref="dropMenuRef" custom-style="flex: 1; min-width: 0">
        <internal-drop-menu-item title="筛选" :before-toggle="handleBeforeToggle" @close="dropMenuClose">
          <filterPage
            :show="showDrawer"
            :filters="filters"
            :scrollTop="scrollTop"
            :defaultParams="filterParams"
            @confirm="filterConfirm"></filterPage>
        </internal-drop-menu-item>
      </internal-drop-menu>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { getCurrentInstance, onMounted, ref } from 'vue';
import filterPage from './filter-page.vue';
import InternalButtonSort from '../snake-button-sort/snake-button-sort.vue';
import InternalDropMenu from '../snake-drop-menu/snake-drop-menu.vue';
import InternalDropMenuItem from '../snake-drop-menu-item/snake-drop-menu-item.vue';

defineOptions({
  name: 'filter-sorts',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
});

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({}),
  },
  defaultFilter: {
    type: Object,
    default: () => ({}),
  },
  bgColor: {
    type: String,
    default: 'transparent',
  },
  sort: {
    type: String,
    default: '',
  },
  showTabs: {
    type: Boolean,
    default: true,
  },
  goodsListLength: {
    type: Number,
    default: 0,
  },
  customStyle: {
    type: Object,
    default: () => ({}),
  },
  // 页面滚动
  scrollTop: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['change']);

const instance = getCurrentInstance();

const dropMenuRef = ref<{ updateDropMenuRect: () => void; colseAll: () => void } | null>(null);

const showDrawer = ref(false);
const filterParams = ref<Record<string, string | number | boolean>>({
  sort: 'auto',
  price: '',
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

  uni
    .createSelectorQuery()
    .in(instance)
    .selectViewport()
    .scrollOffset((res) => {
      scrollTop = (res as UniApp.NodeInfo).scrollTop || 0;
    })
    .exec();

  const query = uni.createSelectorQuery().in(instance);
  query.select('#filtersId').boundingClientRect();
  query.exec((res) => {
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
        },
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
    ...e,
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
</style>
