<template>
  <n-split :default-size="1 / 2" min="300px" max="800px">
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
</template>
<script lang="ts" setup>
import { useMagicKeys, whenever } from "@vueuse/core"
import Editors from "../components/Editors.vue"
import Preview from "../components/Preview.vue"
import Tutorial from "../components/Tutorial.vue"

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
