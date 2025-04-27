<template>
  <n-split
    :size="tutorialSize"
    @update-size="changeSize"
    min="400px"
    max="900px"
  >
    <template #1>
      <Task @hide="hide" />
    </template>
    <template #2>
      <n-split direction="vertical" min="200px">
        <template #1>
          <Editors />
        </template>
        <template #2>
          <Preview :html="html" :css="css" :js="js" />
        </template>
      </n-split>
    </template>
  </n-split>
</template>
<script lang="ts" setup>
import { useMagicKeys, whenever } from "@vueuse/core"
import Editors from "../components/Editors.vue"
import Preview from "../components/Preview.vue"
import Task from "../components/Task.vue"
import { show, tutorialSize } from "../store/tutorial"
import { html, css, js } from "../store/editors"

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

function changeSize(n: number) {
  tutorialSize.value = n
  if (n > 0) show.value = true
}

function hide() {
  tutorialSize.value = 0
  show.value = false
}

whenever(ctrl_s, () => {})
whenever(ctrl_r, () => {})
</script>
