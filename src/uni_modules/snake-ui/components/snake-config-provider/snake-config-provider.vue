<template>
    <view
        :class="['snake-config-provider', `snake-theme-${mode}`, customClass]"
        :data-snake-theme-mode="mode"
        :style="[$themeStyle, customStyle]"
    >
        <slot />
    </view>
</template>

<script setup lang="ts">
/**
 * @component ConfigProvider
 * @description `snake-config-provider` 是 Snake UI 主题系统的页面入口组件，负责把当前主题的 CSS 变量注入页面，并根据主题模式附加明亮或暗黑类名。将它与 `Root` 插件配合使用，可以让主题配置自动作用于每个页面，无需逐页添加组件。
 * @see /components/config-provider
 */

/**
 * snake-config-provider 全局主题配置入口
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
import { currentTheme, setDarkMode, setTheme, darkMode, systemDark } from '../../libs/config/theme';
import type { ConfigProviderEmits, ConfigProviderProps } from './types';

defineOptions({ name: 'ConfigProvider', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<ConfigProviderProps>(), {
    darkMode: undefined,
    currentTheme: '',
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<ConfigProviderEmits>();

const mode = computed<'light' | 'dark'>(() =>
    darkMode.value === 'auto' ? (systemDark.value ? 'dark' : 'light') : darkMode.value
);

function bootstrap() {
    if (props.currentTheme && props.currentTheme !== currentTheme.value.name) {
        if (setTheme(props.currentTheme)) emit('theme-change', props.currentTheme);
    }
    if (props.darkMode && props.darkMode !== darkMode.value) {
        setDarkMode(props.darkMode);
        emit('mode-change', mode.value);
    }
}

onMounted(bootstrap);
watch(() => [props.currentTheme, props.darkMode], bootstrap);
</script>

<style lang="scss" scoped></style>
