import { defineConfig } from "@rsbuild/core"
import { pluginVue } from "@rsbuild/plugin-vue"
import { NaiveUiResolver } from "unplugin-vue-components/resolvers"
import Components from "unplugin-vue-components/rspack"

export default defineConfig({
  plugins: [pluginVue()],
  html: {
    template: "./index.html",
  },
  source: {
    include: [/node_modules[\\/]marked[\\/]/],
    entry: {
      index: "./src/main.ts",
    },
  },
  output: {
    polyfill: "usage",
  },
  tools: {
    rspack: {
      plugins: [
        Components({
          resolvers: [NaiveUiResolver()],
        }),
      ],
    },
  },
  server: {
    proxy: {
      "/media": {
        target: process.env.PUBLIC_WEB_URL,
        changeOrigin: true,
      },
    },
  },
  performance: {
    chunkSplit: {
      // strategy: "split-by-experience",
      strategy: "split-by-module",
      // forceSplitting: {
      //   "lib-ui": /node_modules[\\/]naive-ui[\\/]/,
      //   "lib-cm": /node_modules[\\/]@codemirror[\\/]/,
      //   "lib-marked": /node_modules[\\/]marked[\\/]/,
      //   "lib-hljs": /node_modules[\\/]highlight\.js[\\/]/,
      // },
    },
  },
})
