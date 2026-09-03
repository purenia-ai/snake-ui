<script setup lang="ts">
import { computed } from 'vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import { useDemoLocale } from '../../../common/demo-i18n';
import { useLocale, useTheme } from '../../../uni_modules/snake-ui';

const { currentTheme, darkMode, color, toggleDarkMode } = useTheme();
const { currentLocale, t, setLocale } = useLocale();
const nextLocale = computed(() => (currentLocale.value.name === 'zh-CN' ? 'en-US' : 'zh-CN'));
const { text } = useDemoLocale();
</script>

<template>
    <DemoPage :title="text('主题与语言')" :desc="text('响应式 Hooks 实时切换')">
        <view class="card">
            <view class="swatch" :style="{ backgroundColor: color.primary }" />
            <view class="body"
                ><text class="title">{{ text(currentTheme.label || currentTheme.name) }}</text
                ><text class="meta">darkMode: {{ darkMode }}</text></view
            >
            <snake-button size="mini" @click="toggleDarkMode">{{ text('切换明暗') }}</snake-button>
        </view>
        <view class="card">
            <view class="locale">{{ currentLocale.name.slice(0, 2).toUpperCase() }}</view>
            <view class="body"
                ><text class="title">{{ t('common.confirm') }}</text
                ><text class="meta">{{ currentLocale.label }}</text></view
            >
            <snake-button size="mini" plain @click="setLocale(nextLocale)">{{ text('切换语言') }}</snake-button>
        </view>
    </DemoPage>
</template>

<style scoped>
.card {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 8px 4px 14px;
    padding: 16px;
    border: 1px solid var(--snake-color-divider);
    border-radius: 9px;
    background: var(--snake-color-surface);
}
.swatch,
.locale {
    width: 42px;
    height: 42px;
    flex: none;
    border-radius: 50%;
}
.locale {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--snake-color-primary);
    background: var(--snake-color-primary-light);
    font-size: 12px;
    font-weight: 750;
}
.body {
    min-width: 0;
    flex: 1;
}
.title,
.meta {
    display: block;
}
.title {
    color: var(--snake-color-text);
    font-weight: 650;
}
.meta {
    margin-top: 4px;
    color: var(--snake-color-text-muted);
    font-size: 12px;
}
</style>
