<script lang="ts" setup>
import { onMounted, useTemplateRef } from "vue"
import { Submission } from "../api"
import type { SubmissionAll } from "../utils/type"

interface Props {
  id: string
}
const props = defineProps<Props>()

const iframe = useTemplateRef<HTMLIFrameElement>("iframe")

async function init() {
  const submission: SubmissionAll = await Submission.get(props.id)

  if (!iframe.value) return
  const doc = iframe.value.contentDocument
  if (doc) {
    doc.open()
    doc.write(`<!DOCTYPE html>
<html lang="zh-Hans-CN">
  <head>
    <meta charset="UTF-8" />
    <title>预览</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${submission.css}</style>
    <link rel="stylesheet" href="/normalize.min.css" />
    <script src="/jquery.min.js"><\/script>
  </head>
  <body>
    ${submission.html}
    <script type="module">${submission.js}<\/script>
  </body>
</html>`)
    doc.close()
  }
}

onMounted(init)
</script>
<template>
  <iframe class="iframe" ref="iframe"></iframe>
</template>
<style scoped>
.iframe {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
}
</style>
