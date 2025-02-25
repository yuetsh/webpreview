<script setup lang="ts">
import { dateZhCN, zhCN } from "naive-ui"
import Editors from "./components/Editors.vue"
import Preview from "./components/Preview.vue"
import Tutorial from "./components/Tutorial.vue"
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
    inline-theme-disabled
  >
    <n-split :default-size="1 / 3" min="300px" max="800px">
      <template #1>
        <Tutorial />
      </template>
      <template #2>
        <n-split direction="vertical" min="200px">
          <template #1>
            <Editors />
          </template>
          <template #2>
            <Preview />
          </template>
        </n-split>
      </template>
    </n-split>
  </n-config-provider>
</template>
<style scoped>
.myContainer {
  height: 100vh;
  width: 100vw;
}
</style>
