import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { SnakeRoot } from "./src/uni_modules/snake-ui/plugins";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/snake-ui/h5/",
  plugins: [SnakeRoot(), uni()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
});
