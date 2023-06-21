import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import * as path from "path";

import Icons from "unplugin-icons/vite";
// @ts-ignore
import Components from "unplugin-vue-components/vite";
import IconsResolver from "unplugin-icons/resolver";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import nodePolyfills from "rollup-plugin-node-polyfills";

// https://vitejs.dev/config/
// @ts-ignore
// @ts-ignore
// @ts-ignore
export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    UnoCSS(),
    Components({
      resolvers: [IconsResolver()],
    }),
    Icons({
      autoInstall: true,
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    "process.env": process.env ?? {},
  },
  resolve: {
    alias: {
      "@": path.join(__dirname, ""),
      stream: "rollup-plugin-node-polyfills/polyfills/stream",
      events: "rollup-plugin-node-polyfills/polyfills/events",
      assert: "assert",
      crypto: "crypto-browserify",
      util: "util",
    },
  },
  build: {
    target: "es2020",
    rollupOptions: {
      plugins: [nodePolyfills({ crypto: true })],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [NodeGlobalsPolyfillPlugin({ buffer: true })],
      target: "es2020",
    },
  },
});
