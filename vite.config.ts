import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import * as path from "path";
// @ts-ignore
import nodePolyfills from "vite-plugin-node-stdlib-browser";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [vue(), UnoCSS(), nodePolyfills()],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    "process.env": {},
  },
  resolve: {
    alias: {
      "@": path.join(__dirname, ""),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
    },
  },
  build: {
    sourcemap: false,
    target: "es2020",
  },
});
