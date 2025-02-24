<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-tabs size="large" pane-class="pane" default-value="html" type="segment">
      <n-tab-pane name="html" tab="HTML">
        <template #tab>
          <n-flex align="center">
            <Icon icon="skill-icons:html" :width="20" :height="20"></Icon>
            <span>HTML</span>
          </n-flex>
        </template>
        <Editor language="html" :font-size="size" v-model:value="html" />
      </n-tab-pane>
      <n-tab-pane name="css" tab="CSS">
        <template #tab>
          <n-flex align="center">
            <Icon icon="skill-icons:css" :width="20" :height="20"></Icon>
            <span>CSS</span>
          </n-flex>
        </template>
        <Editor language="css" :font-size="size" v-model:value="css" />
      </n-tab-pane>
      <n-tab-pane name="js" tab="JavaScript">
        <template #tab>
          <n-flex align="center">
            <Icon icon="skill-icons:javascript" :width="20" :height="20"></Icon>
            <span>JS</span>
          </n-flex>
        </template>
        <Editor language="js" :font-size="size" v-model:value="js" />
      </n-tab-pane>
      <n-tab-pane name="actions" tab="选项">
        <template #tab>
          <n-flex align="center">
            <Icon icon="solar:settings-bold" :width="20" :height="20"></Icon>
            <span>选项</span>
          </n-flex>
        </template>
        <n-flex vertical class="wrapper">
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
import { dateZhCN, zhCN } from "naive-ui"
import { Icon } from "@iconify/vue"
import Editor from "./Editor.vue"
import { html, css, js, reset, size, changeSize } from "../store.ts"
</script>
<style scoped>
.pane {
  height: calc(100vh - 62px);
}
.wrapper {
  padding-left: 16px;
}
.label {
  font-size: 16px;
}
</style>
