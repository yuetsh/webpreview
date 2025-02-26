<template>
  <div class="container">
    <n-flex align="center" class="title">
      <n-flex align="center">
        <Icon icon="twemoji:open-book" :width="20"></Icon>
        <n-text class="preview">教程(测试版)</n-text>
        <n-button text @click="prev" :disabled="step === '01'">
          <Icon :width="24" icon="pepicons-pencil:arrow-left"></Icon>
        </n-button>
        <n-button text @click="next" :disabled="last">
          <Icon :width="24" icon="pepicons-pencil:arrow-right"></Icon>
        </n-button>
      </n-flex>
    </n-flex>
    <div class="markdown-body" v-html="content" ref="$content"></div>
  </div>
</template>
<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import { css, html, js, tab } from "../store"
import { onMounted, ref, useTemplateRef, watch } from "vue"
import { marked } from "marked"
import { useStorage } from "@vueuse/core"

const step = useStorage("web-turtorial-step", "01")
const last = ref(false)
const content = ref("")
const $content = useTemplateRef("$content")

function prev() {
  let num = parseInt(step.value) - 1
  step.value = num.toString().padStart(2, "0")
}

function next() {
  let num = parseInt(step.value) + 1
  step.value = num.toString().padStart(2, "0")
}

async function getContent() {
  const res = await fetch(`/turtorial/${step.value}/README.md`)
  const data = await res.text()
  content.value = await marked.parse(data, { async: true })
  last.value = data == "全部结束"
}

// 用 js 来写的，可以换成 vue 的方式
function addButton() {
  const action = document.createElement("div")
  action.className = "codeblock-action"
  const pres = $content.value!.querySelectorAll("pre")
  pres.forEach((pre) => {
    let timer = 0
    const copy = action.cloneNode() as HTMLDivElement
    pre.insertBefore(copy, pre.children[0])
    const code = pre.childNodes[1] as HTMLPreElement
    const match = code.className.match(/-(.*)/)
    let lang = "html"
    if (match) lang = match[1].toLowerCase()
    copy.innerHTML = `<span class="lang">${lang}</span><div class="btn">替换<div>`
    const btn = copy.children[1] as HTMLDivElement
    btn.onclick = () => {
      tab.value = lang
      const content = pre.children[1].textContent
      if (lang === "html") html.value = content
      if (lang === "css") css.value = content
      if (lang === "js") js.value = content
      // 样式
      btn.innerHTML = "已替换"
      clearTimeout(timer)
      timer = setTimeout(() => {
        btn.innerHTML = "替换"
      }, 1000)
    }
  })
}

async function render() {
  await getContent()
  addButton()
}

onMounted(render)
watch(step, render)
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.title {
  height: 43px;
  padding: 0 20px;
  flex-shrink: 0;
  border-bottom: 1px solid rgb(239, 239, 245);
  box-sizing: border-box;
}

.preview {
  font-size: 16px;
}

.markdown-body {
  padding: 16px;
  box-sizing: border-box;
  overflow: auto;
}
</style>
<style>
.markdown-body pre {
  position: relative;
}

.markdown-body pre code {
  text-wrap: auto;
}

.codeblock-action {
  font-family:
    v-sans,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif,
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol";
}

.codeblock-action .lang {
  font-size: 1.2rem;
}

.codeblock-action .btn {
  position: absolute;
  top: 0;
  right: 0;
  padding: 1rem;
  cursor: pointer;
  border-radius: 0.4rem;
}
</style>
