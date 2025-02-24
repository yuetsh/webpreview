<script setup lang="ts">
import { dateZhCN, zhCN } from "naive-ui"
import Editors from "./components/Editors.vue"
import Preview from "./components/Preview.vue"
import { useMagicKeys, whenever } from "@vueuse/core"

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
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-split direction="horizontal">
      <template #1>
        <Editors />
      </template>
      <template #2>
        <Preview />
      </template>
    </n-split>
  </n-config-provider>
</template>
