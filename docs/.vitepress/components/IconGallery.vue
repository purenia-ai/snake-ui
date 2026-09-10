<script setup lang="ts">
import { ref } from 'vue';
import '../../../src/uni_modules/snake-ui/iconfont.css';
import { iconNames } from '../../../src/uni_modules/snake-ui/components/snake-icon/icon-names';

const copiedIcon = ref('');
let resetTimer: ReturnType<typeof setTimeout> | undefined;

async function copyIcon(name: string) {
    try {
        await navigator.clipboard.writeText(name);
        copiedIcon.value = name;
        if (resetTimer) clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
            copiedIcon.value = '';
        }, 1600);
    } catch {
        copiedIcon.value = '';
    }
}
</script>

<template>
    <div class="icon-gallery">
        <div class="icon-gallery__meta">
            <span>点击图标复制名称</span>
            <span>{{ iconNames.length }} 个</span>
        </div>
        <div class="icon-gallery__grid">
            <button
                v-for="name in iconNames"
                :key="name"
                class="icon-gallery__item"
                type="button"
                :aria-label="copiedIcon === name ? `已复制 ${name}` : `复制图标名称 ${name}`"
                @click="copyIcon(name)"
            >
                <i :class="['snake-iconfont', `sicon-${name}`]" aria-hidden="true"></i>
                <span>{{ name }}</span>
                <small :class="{ 'is-visible': copiedIcon === name }">已复制</small>
            </button>
        </div>
        <p class="icon-gallery__status" aria-live="polite">
            {{ copiedIcon ? `已复制：${copiedIcon}` : '' }}
        </p>
    </div>
</template>

<style scoped>
.icon-gallery {
    margin: 20px 0 32px;
}

.icon-gallery__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    color: var(--vp-c-text-2);
    font-size: 13px;
}

.icon-gallery__grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    border: 1px solid var(--vp-c-divider);
    border-radius: 10px;
    background: var(--vp-c-divider);
    gap: 1px;
}

.icon-gallery__item {
    position: relative;
    display: flex;
    min-width: 0;
    min-height: 116px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 16px 8px;
    border: 0;
    border-radius: 0;
    color: var(--vp-c-text-2);
    background: var(--vp-c-bg);
    cursor: pointer;
    transition:
        color 160ms ease,
        background-color 160ms ease;
}

.icon-gallery__item:hover,
.icon-gallery__item:focus-visible {
    color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
}

.icon-gallery__item:focus-visible {
    z-index: 1;
    outline: 2px solid var(--vp-c-brand-1);
    outline-offset: -2px;
}

.icon-gallery__item i {
    font-size: 28px;
    line-height: 1;
}

.icon-gallery__item span {
    width: 100%;
    font-family: var(--vp-font-family-mono);
    font-size: 11px;
    line-height: 1.35;
    text-align: center;
    white-space: nowrap;
}

.icon-gallery__item small {
    position: absolute;
    top: 7px;
    right: 7px;
    color: var(--vp-c-brand-1);
    font-size: 10px;
    line-height: 1;
    opacity: 0;
}

.icon-gallery__item small.is-visible {
    opacity: 1;
}

.icon-gallery__status {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

@media (max-width: 720px) {
    .icon-gallery__grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .icon-gallery__item {
        min-height: 104px;
    }
}
</style>
