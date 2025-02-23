<script setup lang="ts">
import { darkTheme, dateZhCN, zhCN } from "naive-ui"
import { useDark, useMagicKeys, whenever } from "@vueuse/core"
import Editor from "./components/Editor.vue"
import Preview from "./components/Preview.vue"
import { html, css } from "./store.ts"

const isDark = useDark()

const { ctrl_s } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === "s" && e.type === "keydown") e.preventDefault()
  },
})

const { ctrl_r } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === "r" && e.type === "keydown") e.preventDefault()
  },
})
whenever(ctrl_s, () => {})
whenever(ctrl_r, () => {})
</script>

<template>
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="isDark ? darkTheme : null"
  >
    <n-split :max="0.75" :min="0.25">
      <template #1>
        <n-tabs default-value="html" type="segment">
          <n-tab-pane name="html" tab="HTML">
            <Editor language="html" v-model:value="html" />
          </n-tab-pane>
          <n-tab-pane name="css" tab="CSS">
            <Editor language="css" v-model:value="css" />
          </n-tab-pane>
          <!-- <n-tab-pane name="js" tab="JS">
            <Editor language="js" v-model:value="js" />
          </n-tab-pane> -->
        </n-tabs>
      </template>
      <template #2>
        <Preview />
      </template>
    </n-split>
  </n-config-provider>
</template>

<style scoped></style>
