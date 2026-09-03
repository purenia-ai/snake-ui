import { computed } from 'vue';
import {
    currentSnakeTheme,
    initSnakeTheme,
    isSnakeDarkMode,
    setSnakeDarkMode,
    setSnakeTheme,
    setSnakeThemeColor,
    snakeColor,
    snakeCssVars,
    snakeDarkMode,
    snakeThemes,
    toggleSnakeDarkMode
} from '../config/theme';

export function useTheme() {
    return {
        currentTheme: currentSnakeTheme,
        themes: snakeThemes,
        darkMode: snakeDarkMode,
        color: snakeColor,
        cssVars: snakeCssVars,
        themeStyle: computed(() => snakeCssVars.value),
        initTheme: initSnakeTheme,
        setTheme: setSnakeTheme,
        setThemeColor: setSnakeThemeColor,
        setDarkMode: setSnakeDarkMode,
        toggleDarkMode: toggleSnakeDarkMode,
        isInDarkMode: isSnakeDarkMode
    };
}
