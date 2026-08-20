<script setup lang="ts">
import { computed, ref } from 'vue';
import { componentCount, componentGroups, type ComponentGroup, type ComponentItem } from '../component-groups';

interface FilteredGroup extends ComponentGroup {
    items: ComponentItem[];
}

const query = ref('');

const normalizedQuery = computed(() => query.value.trim().toLocaleLowerCase());
const filteredGroups = computed<FilteredGroup[]>(() => {
    if (!normalizedQuery.value) return componentGroups;

    return componentGroups
        .map(group => ({
            ...group,
            items: group.items.filter(item => {
                const pathName = item.link.slice('/components/'.length);
                const searchText = `${item.name} ${item.title} ${pathName}`.toLocaleLowerCase();
                return searchText.includes(normalizedQuery.value);
            })
        }))
        .filter(group => group.items.length > 0);
});
const resultCount = computed(() => filteredGroups.value.reduce((total, group) => total + group.items.length, 0));

function clearQuery() {
    query.value = '';
}
</script>

<template>
    <div class="component-overview">
        <div class="component-search">
            <label class="component-search__label" for="component-search-input">搜索全部组件</label>
            <div class="component-search__control">
                <svg aria-hidden="true" viewBox="0 0 24 24">
                    <path d="m21 21-4.35-4.35m2.35-5.15a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
                </svg>
                <input
                    id="component-search-input"
                    v-model="query"
                    type="search"
                    placeholder="搜索 Button、按钮或 button-sort"
                    autocomplete="off"
                />
                <button v-if="query" type="button" aria-label="清空组件搜索" @click="clearQuery">清空</button>
            </div>
            <p class="component-search__meta" aria-live="polite">
                <template v-if="normalizedQuery">找到 {{ resultCount }} 个组件</template>
                <template v-else>共 {{ componentCount }} 个组件，包含商城与 CMS 业务模块</template>
            </p>
        </div>

        <div v-if="filteredGroups.length" class="component-groups">
            <section v-for="group in filteredGroups" :key="group.title" class="component-group">
                <header class="component-group__header">
                    <h2>{{ group.title }}</h2>
                    <span>{{ group.items.length }}</span>
                </header>
                <div class="component-grid">
                    <a v-for="item in group.items" :key="item.link" class="component-card" :href="item.link">
                        <span class="component-card__copy">
                            <strong>{{ item.name }}</strong>
                            <span>{{ item.title }}</span>
                        </span>
                        <span v-if="item.cms" class="component-card__badge">CMS</span>
                        <svg aria-hidden="true" viewBox="0 0 20 20">
                            <path d="m7.5 5 5 5-5 5" />
                        </svg>
                    </a>
                </div>
            </section>
        </div>

        <div v-else class="component-empty" role="status">
            <span>没有找到“{{ query.trim() }}”相关的组件</span>
            <button type="button" @click="clearQuery">清空搜索</button>
        </div>
    </div>
</template>

<style scoped>
.component-overview {
    margin-top: 28px;
}

.component-search {
    padding: 22px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    background: var(--vp-c-bg-soft);
}

.component-search__label {
    display: block;
    margin-bottom: 10px;
    color: var(--vp-c-text-1);
    font-size: 14px;
    font-weight: 650;
}

.component-search__control {
    display: flex;
    align-items: center;
    min-height: 46px;
    padding: 0 13px;
    border: 1px solid var(--vp-c-border);
    border-radius: 8px;
    background: var(--vp-c-bg);
    transition:
        border-color 160ms ease,
        box-shadow 160ms ease;
}

.component-search__control:focus-within {
    border-color: var(--vp-c-brand-1);
    box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.component-search__control svg {
    flex: 0 0 auto;
    width: 19px;
    margin-right: 10px;
    fill: none;
    stroke: var(--vp-c-text-3);
    stroke-linecap: round;
    stroke-width: 1.7;
}

.component-search__control input {
    min-width: 0;
    flex: 1;
    border: 0;
    outline: 0;
    color: var(--vp-c-text-1);
    background: transparent;
    font: inherit;
    font-size: 14px;
}

.component-search__control input::placeholder {
    color: var(--vp-c-text-3);
}

.component-search__control input::-webkit-search-cancel-button {
    display: none;
}

.component-search__control button,
.component-empty button {
    border: 0;
    color: var(--vp-c-brand-1);
    background: transparent;
    cursor: pointer;
    font: inherit;
    font-size: 13px;
    font-weight: 600;
}

.component-search__control button:focus-visible,
.component-empty button:focus-visible,
.component-card:focus-visible {
    outline: 2px solid var(--vp-c-brand-1);
    outline-offset: 3px;
}

.component-search__meta {
    min-height: 21px;
    margin: 9px 0 0;
    color: var(--vp-c-text-3);
    font-size: 12px;
}

.component-group {
    margin-top: 36px;
}

.component-group__header {
    display: flex;
    align-items: center;
    gap: 9px;
    margin-bottom: 14px;
}

.component-group__header h2 {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 20px;
    line-height: 1.4;
}

.component-group__header span {
    display: grid;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    place-items: center;
    border-radius: 99px;
    color: var(--vp-c-text-3);
    background: var(--vp-c-bg-soft);
    font-size: 11px;
}

.component-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
}

.component-card {
    display: flex;
    align-items: center;
    min-width: 0;
    min-height: 66px;
    padding: 12px 14px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    color: var(--vp-c-text-1);
    background: var(--vp-c-bg);
    text-decoration: none;
    transition:
        border-color 160ms ease,
        background-color 160ms ease,
        transform 160ms ease;
}

.component-card:hover {
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
    transform: translateY(-1px);
}

.component-card__copy {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    gap: 2px;
}

.component-card__copy strong {
    overflow: hidden;
    font-size: 14px;
    font-weight: 650;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.component-card__copy > span {
    overflow: hidden;
    color: var(--vp-c-text-3);
    font-size: 12px;
    line-height: 18px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.component-card__badge {
    flex: 0 0 auto;
    margin-left: 8px;
    padding: 1px 5px;
    border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 38%, transparent);
    border-radius: 4px;
    color: var(--vp-c-brand-1);
    font-size: 9px;
    font-weight: 700;
    line-height: 15px;
}

.component-card > svg {
    flex: 0 0 auto;
    width: 17px;
    margin-left: 5px;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.5;
}

.component-empty {
    display: grid;
    min-height: 220px;
    margin-top: 28px;
    place-content: center;
    gap: 12px;
    border: 1px dashed var(--vp-c-divider);
    border-radius: 10px;
    color: var(--vp-c-text-3);
    text-align: center;
}

@media (max-width: 640px) {
    .component-search {
        padding: 16px;
    }

    .component-grid {
        grid-template-columns: 1fr;
    }

    .component-group {
        margin-top: 30px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .component-card,
    .component-search__control {
        transition: none;
    }
}
</style>
