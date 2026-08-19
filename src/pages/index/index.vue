<script setup lang="ts">
import { computed, ref } from 'vue';
import DemoPage from '../../demo/DemoPage.vue';
import rawGroups from './components.config';
import {
    currentSnakeLocale,
    currentSnakeTheme,
    isSnakeDarkMode,
    setSnakeLocale,
    setSnakeTheme,
    snakeThemes,
    toggleSnakeDarkMode
} from '../../uni_modules/snake-ui';

const groups = ref(rawGroups);
const searchText = ref('');

const filteredGroups = computed(() => {
    const keyword = searchText.value.trim().toLowerCase();
    if (!keyword) return groups.value;
    return groups.value
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
const themeLabel = computed(() => (isSnakeDarkMode() ? '浅色' : '深色'));
const localeLabel = computed(() => (currentSnakeLocale.value.name === 'zh-CN' ? 'EN' : '中文'));
const chineseTitle = (title: string, titleEn: string) => title.replace(titleEn, '').trim();
const openComponent = (path: string) => uni.navigateTo({ url: path });
const clearSearch = () => {
    searchText.value = '';
};
const switchLocale = () => {
    setSnakeLocale(currentSnakeLocale.value.name === 'zh-CN' ? 'en-US' : 'zh-CN');
};
</script>

<template>
    <DemoPage title="Snake UI" desc="面向 uni-app 商城与 CMS 场景的组件库" :nav-back="false" :nav-home="false">
        <view class="overview">
            <view class="theme-switcher">
                <view
                    v-for="theme in snakeThemes"
                    :key="theme.name"
                    :class="['theme-dot', { 'theme-dot--active': currentSnakeTheme?.name === theme.name }]"
                    @click="setSnakeTheme(theme.name)"
                >
                    <view class="theme-dot__color" :style="{ background: theme.color?.primary }" />
                    <text class="theme-dot__label">{{ theme.label || theme.name }}</text>
                </view>
            </view>
            <view class="foundation-actions">
                <text class="foundation-actions__hint">主题与语言</text>
                <button class="foundation-actions__button" @click="toggleSnakeDarkMode">{{ themeLabel }}</button>
                <button class="foundation-actions__button" @click="switchLocale">{{ localeLabel }}</button>
            </view>
            <view class="search-box">
                <text class="search-box__icon">⌕</text>
                <input
                    v-model="searchText"
                    class="search-box__input"
                    placeholder="搜索组件"
                    placeholder-class="search-box__placeholder"
                    confirm-type="search"
                />
                <text v-if="searchText" class="search-box__clear" @click="clearSearch">×</text>
            </view>
            <view v-if="searchText" class="search-result">
                <text>找到 {{ resultCount }} 个组件</text><text @click="clearSearch">清空</text>
            </view>

            <view v-if="searchText && resultCount === 0" class="overview__empty">
                <view class="empty-icon">⌕</view><view class="empty-title">没有找到相关组件</view
                ><view class="empty-desc">换个关键词试试</view>
            </view>

            <view v-for="group in filteredGroups" :key="group.groupName" class="group-section">
                <view class="group-title">
                    <text class="group-title__name">{{ group.groupName }}</text>
                    <text class="group-title__en">{{ group.groupNameEn }}</text>
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
                            <text class="card__desc">{{ chineseTitle(item.title, item.titleEn) || item.desc }}</text>
                        </view>
                        <text class="card__arrow">›</text>
                    </view>
                </view>
            </view>
        </view>
    </DemoPage>
</template>

<style lang="scss" scoped>
@import '../../demo/theme.scss';

.overview {
    padding: 0 4px 28px;
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
    font-size: 12px;
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
    font-size: 12px;
}
.foundation-actions__button {
    min-width: 52px;
    margin: 0;
    padding: 0 10px;
    color: var(--snake-demo-accent-text);
    font-size: 12px;
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
    font-size: 12px;
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
    font-size: 12px;
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
    font-size: 11px;
    text-transform: uppercase;
}
.group-title__count {
    margin-left: auto;
    color: var(--snake-color-text-muted);
    font-size: 11px;
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
    font-size: 8px;
    line-height: 13px;
}
.card__desc {
    display: block;
    overflow: hidden;
    margin-top: 6px;
    color: var(--snake-color-text-secondary);
    font-size: 12px;
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
