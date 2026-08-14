import { createSSRApp } from "vue";
import App from "./App.vue";
import SnakeUI from "./uni_modules/snake-ui";
import { mockSnakeUIOptions } from "./demo/mock-adapters";

export function createApp() {
  const app = createSSRApp(App);
  app.use(SnakeUI, mockSnakeUIOptions);
  return {
    app,
  };
}
