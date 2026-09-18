<template>
    <DemoPage tabbar current-tab="components" title="Snake UI" :nav-back="false" :nav-home="false">
        <view class="overview">
            <view class="catalog-header">
                <view class="catalog-header__main">
                    <view class="catalog-header__heading">
                        <text class="catalog-header__title">{{ text('组件目录') }}</text>
                        <text class="catalog-header__count">{{ totalCount }} {{ text('个组件') }}</text>
                    </view>
                    <text class="catalog-header__desc">{{ text('面向 uni-app 商城与 CMS 场景的组件库') }}</text>
                </view>
            </view>
            <view class="appearance-panel">
                <view class="appearance-panel__row">
                    <text class="appearance-panel__label">{{ text('主题') }}</text>
                    <view class="theme-options">
                        <button
                            v-for="theme in themes"
                            :key="theme.name"
                            class="theme-option"
                            :class="{ 'theme-option--active': currentTheme?.name === theme.name }"
                            @click="setTheme(theme.name)"
                        >
                            <view class="theme-option__color" :style="{ backgroundColor: theme.color.primary }" />
                            <text>{{ text(theme.label || theme.name) }}</text>
                        </button>
                    </view>
                </view>
                <view class="appearance-panel__row">
                    <text class="appearance-panel__label">{{ text('显示模式') }}</text>
                    <view class="mode-options">
                        <button
                            v-for="mode in displayModes"
                            :key="mode.value"
                            class="mode-button"
                            :class="{ 'mode-button--active': darkMode === mode.value }"
                            @click="setDarkMode(mode.value)"
                        >
                            {{ text(mode.label) }}
                        </button>
                    </view>
                </view>
            </view>
            <snake-sticky :custom-nav-height="navbarOffset" bg-color="var(--snake-color-surface)" :z-index="20">
                <view class="search-sticky">
                    <view class="search-box">
                        <snake-icon name="search" :size="38" />
                        <input
                            v-model="searchText"
                            class="search-box__input"
                            :aria-label="text('搜索组件')"
                            :placeholder="text('搜索组件')"
                            placeholder-class="search-box__placeholder"
                            confirm-type="search"
                        />
                        <button
                            v-if="searchText"
                            class="search-box__clear"
                            :aria-label="text('清空')"
                            @click="clearSearch"
                        >
                            <snake-icon name="close" :size="32" />
                        </button>
                    </view>
                </view>
            </snake-sticky>
            <scroll-view class="group-filters" scroll-x :show-scrollbar="false">
                <view class="group-filters__track">
                    <button
                        v-for="filter in groupFilters"
                        :key="filter.key"
                        class="group-filter"
                        :class="{ 'group-filter--active': activeGroup === filter.key }"
                        @click="activeGroup = filter.key"
                    >
                        <text>{{ isEnglish ? filter.labelEn : filter.label }}</text>
                        <text class="group-filter__count">{{ filter.count }}</text>
                    </button>
                </view>
            </scroll-view>
            <view v-if="searchText || activeGroup !== 'all'" class="search-result">
                <text>{{ text('找到') }} {{ resultCount }} {{ text('个组件') }}</text>
            </view>

            <view v-if="resultCount === 0" class="overview__empty">
                <view class="empty-icon"><snake-icon name="empty-search" :size="56" /></view>
                <text class="empty-title">{{ text('没有找到相关组件') }}</text>
                <text class="empty-desc">{{ text('换个关键词试试') }}</text>
                <button class="empty-reset" @click="resetFilters">{{ text('重置筛选') }}</button>
            </view>

            <view v-for="group in filteredGroups" :key="group.groupName" class="group-section">
                <view class="group-title">
                    <text class="group-title__name">{{ isEnglish ? group.groupNameEn : group.groupName }}</text>
                    <text class="group-title__en">{{ isEnglish ? group.groupName : group.groupNameEn }}</text>
                    <text class="group-title__count">{{ group.list.length }}</text>
                </view>
                <view class="cards">
                    <view
                        v-for="item in group.list"
                        :key="item.path"
                        class="card"
                        hover-class="card--hover"
                        role="button"
                        tabindex="0"
                        @click="openComponent(item.path)"
                        @keydown.enter="openComponent(item.path)"
                    >
                        <view class="card__body">
                            <view class="card__title-row">
                                <text class="card__title">{{ isEnglish ? item.titleEn : item.title }}</text>
                                <text v-if="item.cms" class="card__cms">CMS</text>
                            </view>
                            <text class="card__desc">{{ isEnglish ? item.descEn : item.desc }}</text>
                        </view>
                        <snake-icon name="arrow-right" class="card__arrow" :size="36" />
                    </view>
                </view>
            </view>
            <button v-if="scrollTop > 600" class="back-to-top" :aria-label="text('返回顶部')" @click="backToTop">
                <snake-icon name="arrow-up" :size="32" />
            </button>
        </view>
    </DemoPage>
</template>

<script setup lang="ts">
import { onPageScroll } from '@dcloudio/uni-app';
import { computed, ref } from 'vue';
import DemoPage from '../../components/demo-page/demo-page.vue';
import { useDemoLocale } from '../../common/demo-i18n';
import rawGroups from './components.config';

defineOptions({ name: 'ExampleComponents' });
import { useTheme, type DarkMode } from '../../uni_modules/snake-ui';

const { currentTheme, darkMode, setDarkMode, setTheme, themes } = useTheme();
const displayModes: { value: DarkMode; label: string }[] = [
    { value: 'auto', label: '跟随系统' },
    { value: 'light', label: '浅色' },
    { value: 'dark', label: '深色' }
];

const groups = ref(rawGroups);
const searchText = ref('');
const activeGroup = ref('all');
const scrollTop = ref(0);
onPageScroll(event => {
    scrollTop.value = event.scrollTop;
});
const totalCount = groups.value.reduce((sum, group) => sum + group.list.length, 0);
const navbarOffset = (() => {
    try {
        return `${44 + Number(uni.getSystemInfoSync().statusBarHeight || 0)}px`;
    } catch {
        return '44px';
    }
})();
const groupFilters = computed(() => [
    { key: 'all', label: '全部', labelEn: 'All', count: totalCount },
    ...groups.value.map(group => ({
        key: group.groupNameEn,
        label: group.groupName,
        labelEn: group.groupNameEn,
        count: group.list.length
    }))
]);

const filteredGroups = computed(() => {
    const keyword = searchText.value.trim().toLowerCase();
    return groups.value
        .filter(group => activeGroup.value === 'all' || group.groupNameEn === activeGroup.value)
        .map(group => ({
            ...group,
            list: group.list.filter(item => {
                const searchSource = [
                    item.title,
                    item.titleEn,
                    item.desc,
                    item.descEn,
                    item.path,
                    group.groupName,
                    group.groupNameEn,
                    item.cms ? 'cms 内容管理' : ''
                ]
                    .join(' ')
                    .toLowerCase();
                return searchSource.includes(keyword);
            })
        }))
        .filter(group => group.list.length > 0);
});

const resultCount = computed(() => filteredGroups.value.reduce((sum, group) => sum + group.list.length, 0));
const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const openComponent = (path: string) => uni.navigateTo({ url: path });
const clearSearch = () => {
    searchText.value = '';
};
const resetFilters = () => {
    clearSearch();
    activeGroup.value = 'all';
};
const backToTop = () => uni.pageScrollTo({ scrollTop: 0, duration: 250 });
</script>

<style lang="scss" scoped>
@import '../../common/demo.scss';
@import './components.catalog.scss';
</style>
