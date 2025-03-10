<template>
  <n-flex align="center" justify="space-between" class="title">
    <n-flex align="center">
      <Icon icon="noto:eyes" :width="20"></Icon>
      <n-text class="titleText">预览</n-text>
    </n-flex>
    <n-flex>
      <n-button quaternary @click="download" :disabled="!showDL">下载</n-button>
      <n-button quaternary @click="open">展示</n-button>
    </n-flex>
  </n-flex>
  <iframe class="iframe" ref="iframe"></iframe>
</template>

<script lang="ts" setup>
import { watchDebounced } from "@vueuse/core"
import { html, css, js } from "../store/editors"
import { computed, onMounted, useTemplateRef } from "vue"
import { Icon } from "@iconify/vue"

const iframe = useTemplateRef<HTMLIFrameElement>("iframe")
const showDL = computed(() => html.value || css.value || js.value)

function getContent() {
  return `<!DOCTYPE html>
<html lang="zh-Hans-CN">
  <head>
    <meta charset="UTF-8" />
    <title>预览</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${css.value}</style>
    <link rel="stylesheet" href="/normalize.min.css" />
    <script src="/jquery.min.js"><\/script>
  </head>
  <body>
    ${html.value}
    <script type="module">${js.value}<\/script>
  </body>
</html>`
}

function preview() {
  if (!iframe.value) return
  const doc = iframe.value.contentDocument
  if (doc) {
    doc.open()
    doc.write(getContent())
    doc.close()
  }
}

function download() {
  const content = getContent()
  const blob = new Blob([content], { type: "text/html" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "index.html"
  a.click()
  URL.revokeObjectURL(url)
}

function open() {
  const newTab = window.open("/usercontent.html")
  if (!newTab) return
  newTab.document.open()
  newTab.document.write(getContent())
  newTab.document.close()
}

watchDebounced([html, css, js], preview, { debounce: 500, maxWait: 1000 })
onMounted(preview)
</script>
<style scoped>
.title {
  height: 43px;
  padding: 0 20px;
  border-bottom: 1px solid rgb(239, 239, 245);
  box-sizing: border-box;
}

.titleText {
  font-size: 16px;
}

.iframe {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
}
</style>
