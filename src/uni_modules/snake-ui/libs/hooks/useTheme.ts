import { computed } from 'vue';
import {
    currentTheme,
    initTheme,
    isDarkMode,
    setDarkMode,
    setTheme,
    setThemeColor,
    color,
    cssVars,
    darkMode,
    themes,
    toggleDarkMode
} from '../config/theme';

export function useTheme() {
    return {
        currentTheme: currentTheme,
        themes: themes,
        darkMode: darkMode,
        color: color,
        cssVars: cssVars,
        themeStyle: computed(() => cssVars.value),
        initTheme: initTheme,
        setTheme: setTheme,
        setThemeColor: setThemeColor,
        setDarkMode: setDarkMode,
        toggleDarkMode: toggleDarkMode,
        isInDarkMode: isDarkMode
    };
}
