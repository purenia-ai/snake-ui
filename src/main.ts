import { createSSRApp } from 'vue';
import App from './App.vue';
import SnakeUI from './uni_modules/snake-ui';
import { mockUIOptions } from './common/mock-adapters';
import { migrateThemePresetStorage } from './snake-ui.theme';

export function createApp() {
    migrateThemePresetStorage();
    const app = createSSRApp(App);
    app.use(SnakeUI, mockUIOptions);
    return {
        app
    };
}
