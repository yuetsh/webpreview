<script setup lang="ts">
import { dateZhCN, zhCN } from "naive-ui"
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
  <n-config-provider
    class="myContainer"
    :locale="zhCN"
    :date-locale="dateZhCN"
  >
    <router-view></router-view>
  </n-config-provider>
</template>
<style scoped>
.myContainer {
  height: 100vh;
  width: 100vw;
}
</style>
