<template>
    <view
        :class="['snake-config-provider', `snake-theme-${mode}`, customClass]"
        :data-snake-theme-mode="mode"
        :style="[$snakeThemeStyle, customStyle]"
    >
        <slot />
    </view>
</template>

<script setup lang="ts">
/**
 * snake-config-provider 全局主题配置入口(对齐 uView 生态的 config-provider 设计)
 *
 * 把主题引擎的 CSS 变量内联到页面根部并携带暗色 class:
 * - uni-app H5 会把 `page` 选择器编译为 uni-page-body,自定义属性在声明处
 *   完成 var() 代换后按字面值继承,仅挂在 html 上的暗色覆写无法穿透页面内容;
 * - 本组件经 vite-plugin-snake-root 包裹到每个页面根部后,主题变量对全页生效,
 *   小程序端(无 document)同样可用。
 *
 * 可选 bootstrap:传入 currentTheme / darkMode 时,挂载及变化时同步到主题引擎
 * (含 storage 持久化),便于在 App.root.vue 中声明式固定初始主题。
 */
import { computed, onMounted, watch } from 'vue';
import { currentSnakeTheme, setSnakeDarkMode, setSnakeTheme, snakeDarkMode, snakeSystemDark } from '../../libs/config/theme';
import type { SnakeConfigProviderEmits, SnakeConfigProviderProps } from './types';

defineOptions({ name: 'SnakeConfigProvider', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<SnakeConfigProviderProps>(), {
    darkMode: undefined,
    currentTheme: '',
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<SnakeConfigProviderEmits>();

const mode = computed<'light' | 'dark'>(() =>
    snakeDarkMode.value === 'auto' ? (snakeSystemDark.value ? 'dark' : 'light') : snakeDarkMode.value
);

function bootstrap() {
    if (props.currentTheme && props.currentTheme !== currentSnakeTheme.value.name) {
        if (setSnakeTheme(props.currentTheme)) emit('theme-change', props.currentTheme);
    }
    if (props.darkMode && props.darkMode !== snakeDarkMode.value) {
        setSnakeDarkMode(props.darkMode);
        emit('mode-change', mode.value);
    }
}

onMounted(bootstrap);
watch(() => [props.currentTheme, props.darkMode], bootstrap);
</script>

<style lang="scss" scoped></style>
