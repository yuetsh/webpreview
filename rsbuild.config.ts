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
    entry: {
      index: "./src/main.ts",
    },
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
  performance: {
    chunkSplit: {
      strategy: "split-by-experience",
      forceSplitting: {
        "lib-ui": /node_modules[\\/]naive-ui/,
        "lib-cm": /node_modules[\\/]@codemirror/,
      },
    },
  },
})
