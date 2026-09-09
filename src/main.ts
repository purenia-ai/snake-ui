import { createSSRApp } from 'vue';
import App from './App.vue';
import SnakeUI from './uni_modules/snake-ui';
import { mockSnakeUIOptions } from './common/mock-adapters';
import { migrateSnakeThemePresetStorage } from './snake-ui.theme';

export function createApp() {
    migrateSnakeThemePresetStorage();
    const app = createSSRApp(App);
    app.use(SnakeUI, mockSnakeUIOptions);
    return {
        app
    };
}
