<template>
  <n-flex align="center" justify="space-between" class="title">
    <n-text class="titleText">预览</n-text>
    <n-flex>
      <n-button quaternary @click="download" :disabled="!showDL">下载</n-button>
      <n-button quaternary @click="open">全屏</n-button>
      <n-button quaternary v-if="props.submissionId" @click="copyLink">
        复制链接
      </n-button>
      <n-flex v-if="!!submission.id">
        <n-button quaternary @click="emits('showCode')">查看代码</n-button>
        <n-popover v-if="submission.my_score === 0">
          <template #trigger>
            <n-button secondary type="primary">手动打分</n-button>
          </template>
          <n-rate :size="30" @update:value="updateScore" />
        </n-popover>
        <!-- <n-button secondary type="info">智能打分</n-button> -->
      </n-flex>
    </n-flex>
  </n-flex>
  <iframe class="iframe" ref="iframe"></iframe>
</template>
<script lang="ts" setup>
import { watchDebounced } from "@vueuse/core"
import { computed, onMounted, useTemplateRef } from "vue"
import { useRouter } from "vue-router"
import { Submission } from "../api"
import { submission } from "../store/submission"
import { useMessage } from "naive-ui"
import copy from "copy-text-to-clipboard"

interface Props {
  html: string
  css: string
  js: string
  submissionId?: string
}

const props = defineProps<Props>()
const emits = defineEmits(["afterScore", "showCode"])

const message = useMessage()
const router = useRouter()

const iframe = useTemplateRef<HTMLIFrameElement>("iframe")
const showDL = computed(() => props.html || props.css || props.js)

function getContent() {
  return `<!DOCTYPE html>
<html lang="zh-Hans-CN">
  <head>
    <meta charset="UTF-8" />
    <title>预览</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${props.css}</style>
    <link rel="stylesheet" href="/normalize.min.css" />
    <script src="/jquery.min.js"><\/script>
  </head>
  <body>
    ${props.html}
    <script type="module">${props.js}<\/script>
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
  if (props.submissionId) {
    const data = router.resolve({
      name: "submission",
      params: { id: props.submissionId },
    })
    window.open(data.href, "_blank")
  } else {
    const newTab = window.open("/usercontent.html")
    if (!newTab) return
    newTab.document.open()
    newTab.document.write(getContent())
    newTab.document.close()
  }
}

function copyLink() {
  copy(`${document.location.origin}/submission/${props.submissionId}`)
  message.success("该提交的链接已复制")
}

async function updateScore(score: number) {
  try {
    const res = await Submission.updateScore(submission.value.id, score)
    message.success(res.message)
    submission.value.my_score = score
    emits("afterScore")
  } catch (err: any) {
    message.error(err.response.data.detail)
  }
}

watchDebounced(() => [props.html, props.css, props.js], preview, {
  debounce: 500,
  maxWait: 1000,
})
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
