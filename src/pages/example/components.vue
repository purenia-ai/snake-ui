<template>
    <DemoPage tabbar current-tab="components" title="Snake UI" :nav-back="false" :nav-home="false">
        <view class="catalog">
            <view class="catalog-head">
                <view class="catalog-head__heading">
                    <text class="catalog-head__title">{{ text('组件目录') }}</text>
                    <text class="catalog-head__count">{{ totalCount }} {{ text('个组件') }}</text>
                </view>
                <text class="catalog-head__desc">{{ text('面向 uni-app 商城与 CMS 场景的组件库') }}</text>
            </view>

            <view class="appearance">
                <text class="appearance__label">{{ text('主题') }}</text>
                <view class="appearance__themes">
                    <view class="swatches">
                        <view
                            v-for="theme in themes"
                            :key="theme.name"
                            class="swatch"
                            :class="{ 'swatch--active': currentTheme?.name === theme.name }"
                            :style="{
                                borderColor:
                                    currentTheme?.name === theme.name
                                        ? theme.color.primary || 'var(--snake-color-primary)'
                                        : 'transparent'
                            }"
                            role="button"
                            tabindex="0"
                            :aria-label="text(theme.label || theme.name)"
                            :aria-pressed="currentTheme?.name === theme.name"
                            @click="setTheme(theme.name)"
                            @keydown.enter="setTheme(theme.name)"
                        >
                            <view
                                class="swatch__dot"
                                :style="{ backgroundColor: theme.color.primary || 'var(--snake-color-primary)' }"
                            >
                                <snake-icon
                                    v-if="currentTheme?.name === theme.name"
                                    name="checkmark"
                                    :size="11"
                                    color="#ffffff"
                                />
                            </view>
                        </view>
                    </view>
                    <text class="appearance__value">{{ currentThemeLabel }}</text>
                </view>
                <text class="appearance__label">{{ text('显示模式') }}</text>
                <view class="appearance__modes">
                    <snake-subsection
                        :list="modeLabels"
                        :current="modeIndex"
                        :height="30"
                        :font-size="12"
                        :button-color="modeThumbColor"
                        @change="handleModeChange"
                    />
                </view>
            </view>

            <snake-sticky
                :custom-nav-height="navbarOffset"
                bg-color="var(--snake-color-surface)"
                :z-index="20"
                @change="handleStickyChange"
            >
                <view class="catalog-search" :class="{ 'catalog-search--stuck': searchStuck }">
                    <view class="catalog-search__field">
                        <snake-icon name="search" :size="17" />
                        <input
                            v-model="searchText"
                            class="catalog-search__input"
                            :aria-label="text('搜索组件')"
                            :placeholder="text('搜索组件')"
                            placeholder-class="catalog-search__placeholder"
                            confirm-type="search"
                        />
                        <button
                            v-if="searchText"
                            class="catalog-search__clear"
                            :aria-label="text('清空')"
                            @click="clearSearch"
                        >
                            <snake-icon name="close" :size="14" />
                        </button>
                    </view>
                </view>
            </snake-sticky>

            <scroll-view class="filters" scroll-x :show-scrollbar="false">
                <view class="filters__track">
                    <button
                        v-for="filter in groupFilters"
                        :key="filter.key"
                        class="filter"
                        :class="{ 'filter--active': activeGroup === filter.key }"
                        @click="selectGroup(filter.key)"
                    >
                        <text>{{ isEnglish ? filter.labelEn : filter.label }}</text>
                        <text class="filter__count">{{ filter.count }}</text>
                    </button>
                </view>
            </scroll-view>

            <view v-if="(searchText || activeGroup !== 'all') && resultCount > 0" class="catalog-result">
                <text class="catalog-result__text">{{ text('找到') }} {{ resultCount }} {{ text('个组件') }}</text>
                <view
                    class="catalog-result__reset"
                    role="button"
                    tabindex="0"
                    @click="resetFilters"
                    @keydown.enter="resetFilters"
                >
                    {{ text('重置筛选') }}
                </view>
            </view>

            <snake-empty
                v-if="resultCount === 0"
                class="catalog-empty"
                mode="search"
                :icon-size="76"
                :text="text('没有找到相关组件')"
            >
                <template #bottom>
                    <view class="catalog-empty__actions">
                        <text class="catalog-empty__desc">{{ text('换个关键词试试') }}</text>
                        <button class="catalog-empty__reset" @click="resetFilters">{{ text('重置筛选') }}</button>
                    </view>
                </template>
            </snake-empty>

            <view v-for="group in filteredGroups" :key="group.groupName" class="group">
                <view v-if="activeGroup === 'all'" class="group__head">
                    <text class="group__name">{{ isEnglish ? group.groupNameEn : group.groupName }}</text>
                    <text class="group__alias">{{ isEnglish ? group.groupName : group.groupNameEn }}</text>
                    <text class="group__count">{{ group.list.length }}</text>
                </view>
                <view class="group__list">
                    <view
                        v-for="item in group.list"
                        :key="item.path"
                        class="row"
                        hover-class="row--hover"
                        role="button"
                        tabindex="0"
                        @click="openComponent(item.path)"
                        @keydown.enter="openComponent(item.path)"
                    >
                        <view class="row__main">
                            <view class="row__headline">
                                <text class="row__title">{{ isEnglish ? item.titleEn : item.title }}</text>
                                <text v-if="item.cms" class="row__tag">CMS</text>
                            </view>
                            <text class="row__desc">{{ isEnglish ? item.descEn : item.desc }}</text>
                        </view>
                        <snake-icon name="arrow-right" class="row__arrow" :size="16" />
                    </view>
                </view>
            </view>

            <snake-backtop :scroll-top="scrollTop" :top="600" :bottom="96" :right="16" :duration="260" />
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

const { currentTheme, darkMode, isInDarkMode, setDarkMode, setTheme, themes } = useTheme();
const { localeName, text } = useDemoLocale();
const displayModes: { value: DarkMode; label: string }[] = [
    { value: 'auto', label: '系统' },
    { value: 'light', label: '浅色' },
    { value: 'dark', label: '深色' }
];

const groups = ref(rawGroups);
const searchText = ref('');
const activeGroup = ref('all');
const scrollTop = ref(0);
const searchStuck = ref(false);
const handleStickyChange = (detail: { isFixed: boolean }) => {
    searchStuck.value = Boolean(detail?.isFixed);
};
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
const isEnglish = computed(() => localeName.value === 'en-US');
const isDark = computed(() => isInDarkMode());
// 暗色下白色滑块会变成「黑洞」，改用更亮的描边色让选中项浮起来。
const modeThumbColor = computed(() => (isDark.value ? 'var(--snake-color-border)' : 'var(--snake-color-surface)'));
const currentThemeLabel = computed(() => {
    const theme = currentTheme.value;
    return text(theme?.label || theme?.name || '');
});
const modeLabels = computed(() => displayModes.map(mode => text(mode.label)));
const modeIndex = computed(() =>
    Math.max(
        0,
        displayModes.findIndex(mode => mode.value === darkMode.value)
    )
);

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
const openComponent = (path: string) => uni.navigateTo({ url: path });
const selectGroup = (key: string) => {
    activeGroup.value = key;
};
const handleModeChange = (index: number) => {
    const mode = displayModes[index];
    if (mode && mode.value !== darkMode.value) setDarkMode(mode.value);
};
const clearSearch = () => {
    searchText.value = '';
};
const resetFilters = () => {
    clearSearch();
    activeGroup.value = 'all';
};
</script>

<style lang="scss" scoped>
@import '../../common/demo.scss';
@import './components.catalog.scss';
</style>
