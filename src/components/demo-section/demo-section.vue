<template>
    <view v-if="!bare" :class="['demo-section', `demo-section--${variant}`]">
        <view v-if="title || description" class="demo-section__head">
            <text class="demo-section__title">{{ title }}</text>
            <text v-if="description" class="demo-section__description">{{ description }}</text>
        </view>
        <view class="demo-section__wrap">
            <slot />
        </view>
    </view>
    <slot v-else />
</template>

<script setup lang="ts">
type DemoSectionVariant = 'default' | 'preview' | 'controls';

withDefaults(defineProps<{ title?: string; description?: string; bare?: boolean; variant?: DemoSectionVariant }>(), {
    title: '',
    bare: false,
    variant: 'default'
});
</script>

<style lang="scss" scoped>
@import '../../common/demo.scss';

.demo-section {
    overflow: hidden;
    margin-bottom: 14px;
    background: var(--snake-color-surface);
}

.demo-section:last-child {
    margin-bottom: 0;
}

.demo-section__head {
    padding: 12px 12px 10px;
    text-align: center;
}

.demo-section__title {
    color: var(--snake-color-text);
    font-size: 15px;
    font-weight: 600;
}
.demo-section__description {
    display: block;
    margin-top: 3px;
    color: var(--snake-color-text-muted);
    font-size: 11px;
}

.demo-section__wrap {
    padding: 16px 14px;
    background: var(--snake-color-surface);
}

.demo-section--default,
.demo-section--preview {
    border: 1px dashed var(--snake-color-divider);
    border-radius: 5px;
}

.demo-section--preview .demo-section__head {
    border-bottom: 1px dashed var(--snake-color-divider);
}

.demo-section--controls {
    background: transparent;
}

.demo-section--controls .demo-section__head {
    padding-top: 8px;
    border-bottom: 1px solid var(--snake-color-divider);
}

.demo-section--controls .demo-section__wrap {
    padding: 0 4px;
    background: transparent;
}
</style>
