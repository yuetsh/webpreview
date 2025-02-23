<script setup lang="ts">
import { darkTheme, dateZhCN, zhCN } from "naive-ui"
import { useDark, useMagicKeys, whenever } from "@vueuse/core"
import Editors from "./components/Editors.vue"
import Preview from "./components/Preview.vue"

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
        <Editors />
      </template>
      <template #2>
        <Preview />
      </template>
    </n-split>
  </n-config-provider>
</template>
