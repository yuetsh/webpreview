<template>
  <iframe class="iframe" ref="iframe"></iframe>
</template>

<script lang="ts" setup>
import { watchDebounced } from "@vueuse/core"
import { html, css, js } from "../store.ts"
import { onMounted, useTemplateRef } from "vue"

const iframe = useTemplateRef<HTMLIFrameElement>("iframe")

function preview() {
  if (!iframe.value) return
  const doc = iframe.value.contentDocument!
  doc.open()
  doc.write(`<!DOCTYPE html>
<html lang="zh-Hans-CN">
  <head>
    <meta charset="UTF-8" />
    <title>预览</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${css.value}</style>
    <link rel="stylesheet" href="/normalize.min.css" />
  </head>
  <body>
    ${html.value}
    <script type="module">${js.value}<\/script>
  </body>
</html>`)
  doc.close()
}
watchDebounced([html, css, js], preview, { debounce: 500, maxWait: 1000 })
onMounted(preview)
</script>
<style scoped>
.iframe {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
}
</style>
