<script setup lang="ts">
import { computed, ref } from 'vue';
import DemoPage from '../../components/demo-page/demo-page.vue';
import { demoText, useDemoLocale } from '../../common/demo-i18n';
import rawGroups from './components.config';

defineOptions({ name: 'ExampleComponents' });
import { currentTheme, isDarkMode, setTheme, themes, toggleDarkMode } from '../../uni_modules/snake-ui';

const groups = ref(rawGroups);
const searchText = ref('');
const activeGroup = ref('all');
const groupFilters = computed(() => [
    { key: 'all', label: '全部', count: groups.value.reduce((sum, group) => sum + group.list.length, 0) },
    ...groups.value.map(group => ({ key: group.groupNameEn, label: group.groupName, count: group.list.length }))
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
const { localeName, nextLocaleLabel, switchLocale, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const themeLabel = computed(() => text(isDarkMode() ? '浅色' : '深色'));
const chineseTitle = (title: string, titleEn: string) => title.replace(titleEn, '').trim();
const openComponent = (path: string) => uni.navigateTo({ url: path });
const clearSearch = () => {
    searchText.value = '';
};
</script>

<template>
    <DemoPage
        tabbar
        current-tab="components"
        title="Snake UI"
        :desc="text('面向 uni-app 商城与 CMS 场景的组件库')"
        :nav-back="false"
        :nav-home="false"
    >
        <view class="overview">
            <view class="components-hero">
                <view class="components-hero__content"
                    ><text class="components-hero__eyebrow">SNAKE / COMPONENTS</text
                    ><text class="components-hero__title">为跨端业务而生的组件</text
                    ><text class="components-hero__desc"
                        >从基础交互到 CMS 营销模块，打开一个页面就能看到真实用法。</text
                    ></view
                >
                <view class="components-hero__metric"
                    ><text>{{ resultCount }}</text
                    ><text>{{ text('个组件') }}</text></view
                >
            </view>
            <view class="theme-switcher">
                <view
                    v-for="theme in themes"
                    :key="theme.name"
                    :class="['theme-dot', { 'theme-dot--active': currentTheme?.name === theme.name }]"
                    @click="setTheme(theme.name)"
                >
                    <view class="theme-dot__color" :style="{ background: theme.color?.primary }" />
                    <text class="theme-dot__label">{{ text(theme.label || theme.name) }}</text>
                </view>
            </view>
            <view class="foundation-actions">
                <text class="foundation-actions__hint">{{ text('主题与语言') }}</text>
                <button class="foundation-actions__button" @click="toggleDarkMode">{{ themeLabel }}</button>
                <button class="foundation-actions__button" @click="switchLocale">{{ nextLocaleLabel }}</button>
            </view>
            <scroll-view class="group-filters" scroll-x :show-scrollbar="false">
                <view
                    v-for="filter in groupFilters"
                    :key="filter.key"
                    :class="['group-filter', { 'group-filter--active': activeGroup === filter.key }]"
                    @click="activeGroup = filter.key"
                    ><text>{{ text(filter.label) }}</text
                    ><text class="group-filter__count">{{ filter.count }}</text></view
                >
            </scroll-view>
            <view class="search-box">
                <text class="search-box__icon">⌕</text>
                <input
                    v-model="searchText"
                    class="search-box__input"
                    :placeholder="text('搜索组件')"
                    placeholder-class="search-box__placeholder"
                    confirm-type="search"
                />
                <text v-if="searchText" class="search-box__clear" @click="clearSearch">×</text>
            </view>
            <view v-if="searchText" class="search-result">
                <text>{{ text('找到') }} {{ resultCount }} {{ text('个组件') }}</text
                ><text @click="clearSearch">{{ text('清空') }}</text>
            </view>

            <view v-if="searchText && resultCount === 0" class="overview__empty">
                <view class="empty-icon">⌕</view><view class="empty-title">{{ text('没有找到相关组件') }}</view
                ><view class="empty-desc">{{ text('换个关键词试试') }}</view>
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
                        :class="['card', { 'card--cms': item.cms }]"
                        hover-class="card--hover"
                        @click="openComponent(item.path)"
                    >
                        <view class="card__body">
                            <view class="card__title-row"
                                ><text class="card__title">{{ item.titleEn }}</text
                                ><text v-if="item.cms" class="card__cms">CMS</text></view
                            >
                            <text class="card__desc">{{
                                isEnglish ? demoText(item.desc) : chineseTitle(item.title, item.titleEn) || item.desc
                            }}</text>
                        </view>
                        <text class="card__arrow">›</text>
                    </view>
                </view>
            </view>
        </view>
    </DemoPage>
</template>

<style lang="scss" scoped>
@import '../../common/demo.scss';

.overview {
    padding: 0 4px 28px;
}
.components-hero {
    display: flex;
    position: relative;
    overflow: hidden;
    min-height: 180rpx;
    margin: 0 0 20rpx;
    padding: 30rpx;
    align-items: flex-end;
    justify-content: space-between;
    border-radius: 22rpx;
    color: #effff8;
    background: linear-gradient(135deg, var(--snake-color-primary-deeper), var(--snake-color-primary-deep));
}
.components-hero::after {
    position: absolute;
    width: 260rpx;
    height: 260rpx;
    right: -80rpx;
    top: -120rpx;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 50%;
    content: '';
    box-shadow:
        0 0 0 34rpx rgba(255, 255, 255, 0.05),
        0 0 0 68rpx rgba(255, 255, 255, 0.04);
}
.components-hero__content {
    position: relative;
    z-index: 1;
    max-width: 76%;
}
.components-hero__eyebrow,
.components-hero__title,
.components-hero__desc {
    display: block;
}
.components-hero__eyebrow {
    color: rgba(239, 255, 248, 0.7);
    font-size: 19rpx;
    letter-spacing: 4rpx;
}
.components-hero__title {
    margin-top: 10rpx;
    font-size: 38rpx;
    font-weight: 750;
    line-height: 1.25;
}
.components-hero__desc {
    margin-top: 10rpx;
    color: rgba(239, 255, 248, 0.78);
    font-size: 23rpx;
    line-height: 1.5;
}
.components-hero__metric {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    color: rgba(239, 255, 248, 0.75);
    font-size: 21rpx;
}
.components-hero__metric text:first-child {
    color: #fff;
    font-size: 46rpx;
    font-weight: 750;
    line-height: 1;
}
.group-filters {
    display: flex;
    width: 100%;
    margin-bottom: 20rpx;
    white-space: nowrap;
}
.group-filter {
    display: inline-flex;
    margin-right: 10rpx;
    padding: 12rpx 18rpx;
    align-items: center;
    gap: 8rpx;
    border: 1px solid var(--snake-color-divider);
    border-radius: 999rpx;
    color: var(--snake-color-text-secondary);
    background: var(--snake-color-surface);
    font-size: 23rpx;
}
.group-filter--active {
    border-color: var(--snake-color-primary);
    color: var(--snake-color-primary-deep);
    background: var(--snake-color-primary-light);
    font-weight: 650;
}
.group-filter__count {
    color: var(--snake-color-text-muted);
    font-size: 19rpx;
}
.theme-switcher {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 12px;
}
.theme-dot {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px 6px 8px;
    border: 1px solid var(--snake-color-divider);
    border-radius: 999px;
    background: var(--snake-color-surface);
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        background-color 0.2s ease;
}
.theme-dot--active {
    border-color: var(--snake-color-primary);
    background: var(--snake-color-primary-light);
    box-shadow: 0 0 0 3px rgba(var(--snake-color-primary-rgb), 0.16);
}
.theme-dot__color {
    width: 16px;
    height: 16px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 50%;
}
.theme-dot__label {
    color: var(--snake-color-text-secondary);
    font-size: 13px;
}
.theme-dot--active .theme-dot__label {
    color: var(--snake-demo-accent-text);
    font-weight: 600;
}
.foundation-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
}
.foundation-actions__hint {
    margin-right: auto;
    color: var(--snake-color-text-muted);
    font-size: 13px;
}
.foundation-actions__button {
    min-width: 52px;
    margin: 0;
    padding: 0 10px;
    color: var(--snake-demo-accent-text);
    font-size: 13px;
    font-weight: 600;
    line-height: 28px;
    background: var(--snake-color-primary-light);
    border: 1px solid rgba(var(--snake-color-primary-rgb), 0.4);
    border-radius: 5px;
}
.foundation-actions__button::after {
    display: none;
}
.search-box {
    display: flex;
    align-items: center;
    height: 44px;
    margin-bottom: 22px;
    padding: 0 14px;
    border: 1px solid var(--snake-color-border);
    border-radius: 6px;
    background: var(--snake-color-surface);
    transition:
        border-color 0.18s ease,
        box-shadow 0.18s ease;
}
.search-box:focus-within {
    border-color: var(--snake-color-primary);
    box-shadow: 0 0 0 4rpx rgba(var(--snake-color-primary-rgb), 0.16);
}
.search-box__icon {
    margin-right: 9px;
    color: var(--snake-color-text-muted);
    font-size: 17px;
}
.search-box__input {
    flex: 1;
    height: 100%;
    color: var(--snake-color-text);
    font-size: 14px;
}
.search-box__placeholder {
    color: var(--snake-color-text-muted);
}
.search-box__clear {
    display: flex;
    width: 28px;
    height: 28px;
    align-items: center;
    justify-content: center;
    color: var(--snake-color-text-muted);
    font-size: 17px;
}
.search-result {
    display: flex;
    justify-content: space-between;
    margin: -12px 2px 20px;
    color: var(--snake-color-text-muted);
    font-size: 13px;
}
.search-result text:last-child {
    color: var(--snake-color-primary);
}
.overview__empty {
    padding: 64px 0;
    text-align: center;
}
.empty-icon {
    display: flex;
    width: 48px;
    height: 48px;
    margin: 0 auto 14px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--snake-color-primary-light);
    color: var(--snake-color-primary);
    font-size: 23px;
}
.empty-title {
    color: var(--snake-color-text);
    font-size: 15px;
    font-weight: 600;
}
.empty-desc {
    margin-top: 6px;
    color: var(--snake-color-text-muted);
    font-size: 13px;
}
.group-section {
    margin-bottom: 26px;
}
.group-title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--snake-color-divider);
}
.group-title__name {
    color: var(--snake-color-text);
    font-size: 16px;
    font-weight: 600;
}
.group-title__en {
    margin-left: 8px;
    color: var(--snake-color-text-muted);
    font-size: 12px;
    text-transform: uppercase;
}
.group-title__count {
    margin-left: auto;
    color: var(--snake-color-text-muted);
    font-size: 12px;
}
.cards {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
.card {
    display: flex;
    box-sizing: border-box;
    width: calc((100% - 10px) / 2);
    min-height: 72px;
    padding: 13px 12px;
    align-items: center;
    border: 1px solid var(--snake-color-divider);
    border-radius: 7px;
    background: var(--snake-color-surface);
    transition:
        border-color 0.18s ease,
        background-color 0.18s ease;
}
.card--hover {
    border-color: var(--snake-color-primary);
    background: var(--snake-color-primary-light);
}
.card--cms {
    border-left: 2px solid var(--snake-color-primary);
}
.card__body {
    min-width: 0;
    flex: 1;
}
.card__title-row {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 5px;
}
.card__title {
    overflow: hidden;
    color: var(--snake-color-text);
    font-size: 14px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.card__cms {
    flex: none;
    padding: 1px 4px;
    border: 1px solid rgba(var(--snake-color-primary-rgb), 0.35);
    border-radius: 3px;
    color: var(--snake-color-primary);
    font-size: 10px;
    line-height: 15px;
}
.card__desc {
    display: block;
    overflow: hidden;
    margin-top: 6px;
    color: var(--snake-color-text-secondary);
    font-size: 13px;
    line-height: 1.4;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.card__arrow {
    flex: none;
    margin-left: 7px;
    color: var(--snake-color-text-muted);
    font-size: 18px;
}

@media (max-width: 340px) {
    .card {
        width: 100%;
    }
}
@media (prefers-reduced-motion: reduce) {
    .card,
    .search-box {
        transition: none;
    }
}
</style>
