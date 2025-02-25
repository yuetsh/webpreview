<template>
  <div class="container">
    <n-flex align="center" class="title">
      <n-flex align="center">
        <Icon icon="twemoji:open-book" :width="20"></Icon>
        <n-text class="preview">教程</n-text>
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
  if (!!data) {
    content.value = await marked.parse(data, { async: true })
    last.value = false
  } else {
    content.value = ""
    last.value = true
  }
}

// 用 js 来写的，可以换成 vue 的方式
function addCopyButton() {
  const div = document.createElement("div")
  div.className = "my-action-btn"
  const pres = $content.value!.querySelectorAll("pre")
  pres.forEach((pre) => {
    let timer = 0
    const copy = div.cloneNode(true) as HTMLDivElement
    pre.appendChild(copy)
    copy.onclick = () => {
      // 功能
      const outer = pre.childNodes[0] as HTMLPreElement
      const match = outer.className.match(/-(.*)/)
      let lang = "html"
      if (match) lang = match[1].toLowerCase()
      tab.value = lang
      if (lang === "html") html.value = pre.textContent
      if (lang === "css") css.value = pre.textContent
      if (lang === "js") js.value = pre.textContent
      // 样式
      copy.classList.add("click")
      clearTimeout(timer)
      timer = setTimeout(() => {
        copy.classList.remove("click")
      }, 1000)
    }
  })
}

async function render() {
  await getContent()
  addCopyButton()
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

.my-action-btn {
  position: absolute;
  top: 0;
  right: 0;
  padding: 1rem;
  cursor: pointer;
  border-radius: 0.4rem;
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

.my-action-btn::before {
  content: "替换";
}

.my-action-btn.click::before {
  content: "已替换";
}
</style>
