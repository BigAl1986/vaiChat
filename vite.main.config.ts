import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    rollupOptions: {
      external: ["src/utils/helper"], // 添加需要外部化的模块
    },
  },
});
