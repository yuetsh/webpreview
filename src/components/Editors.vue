<template>
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="null"
  >
    <n-tabs pane-class="pane" default-value="html" type="segment">
      <n-tab-pane name="html" tab="HTML">
        <Editor language="html" :font-size="size" v-model:value="html" />
      </n-tab-pane>
      <n-tab-pane name="css" tab="CSS">
        <Editor language="css" :font-size="size" v-model:value="css" />
      </n-tab-pane>
      <n-tab-pane name="js" tab="JS">
        <Editor language="js" :font-size="size" v-model:value="js" />
      </n-tab-pane>
      <n-tab-pane name="actions" tab="选项">
        <n-flex vertical class="wrapper">
          <!-- <n-flex align="center">
            <span class="label">主题</span>
            <n-button @click="toggleDark()">
              {{ isDark ? "浅色" : "深色" }}
            </n-button>
          </n-flex> -->
          <n-flex align="center">
            <span class="label">重置</span>
            <n-button @click="reset('html')">HTML</n-button>
            <n-button @click="reset('css')">CSS</n-button>
            <n-button @click="reset('js')">JS</n-button>
          </n-flex>
          <n-flex align="center">
            <span class="label">字号</span>
            <n-flex align="center">
              <span :style="{ 'font-size': size + 'px' }">{{ size }}</span>
              <n-button @click="changeSize(size - 2)" :disabled="size === 20">
                调小
              </n-button>
              <n-button @click="changeSize(size + 2)" :disabled="size === 40">
                调大
              </n-button>
            </n-flex>
          </n-flex>
        </n-flex>
      </n-tab-pane>
    </n-tabs>
  </n-config-provider>
</template>
<script lang="ts" setup>
import { darkTheme, dateZhCN, zhCN } from "naive-ui"
import { useDark, useToggle } from "@vueuse/core"
import Editor from "./Editor.vue"
import { html, css, js, reset, size, changeSize } from "../store.ts"

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>
<style scoped>
.pane {
  height: calc(100vh - 52px);
}
.wrapper {
  padding: 12px;
}
.label {
  font-size: 16px;
}
</style>
