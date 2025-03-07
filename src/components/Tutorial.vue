<template>
  <div class="container">
    <n-flex align="center" justify="space-between" class="title">
      <n-flex align="center">
        <Icon icon="twemoji:open-book" :width="20"></Icon>
        <n-text class="preview">教程(测试版)</n-text>
        <n-button text @click="prev" v-if="!hideNav" :disabled="prevDisabled">
          <Icon :width="24" icon="pepicons-pencil:arrow-left"></Icon>
        </n-button>
        <n-button text @click="next" v-if="!hideNav" :disabled="nextDisabled">
          <Icon :width="24" icon="pepicons-pencil:arrow-right"></Icon>
        </n-button>
      </n-flex>
      <n-flex>
        <n-button
          v-if="authed && roleSuper"
          quaternary
          @click="$router.push({ name: 'tutorial', params: { display: step } })"
        >
          编辑
        </n-button>
        <n-button quaternary @click="$emit('hide')">隐藏</n-button>
      </n-flex>
    </n-flex>
    <div class="markdown-body" v-html="content" ref="$content"></div>
  </div>
</template>
<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import { css, html, js, tab } from "../store/editors"
import { computed, onMounted, ref, useTemplateRef, watch } from "vue"
import { marked } from "marked"
import { Tutorial } from "../api"
import { step } from "../store/tutorial"
import { authed, roleSuper } from "../store/user"

const displays = ref<number[]>([])
const content = ref("")
const $content = useTemplateRef("$content")

defineEmits(["hide"])

const hideNav = computed(() => displays.value.length <= 1)

const prevDisabled = computed(() => {
  const i = displays.value.indexOf(step.value)
  return i <= 0
})

const nextDisabled = computed(() => {
  const i = displays.value.indexOf(step.value)
  return i === displays.value.length - 1
})

function prev() {
  const i = displays.value.indexOf(step.value)
  step.value = displays.value[i - 1]
}

function next() {
  const i = displays.value.indexOf(step.value)
  step.value = displays.value[i + 1]
}

async function getContent() {
  displays.value = await Tutorial.listDisplay()
  if (!displays.value.length) {
    content.value = "暂无教程"
    return
  }
  if (!displays.value.includes(step.value)) {
    step.value = displays.value[0]
  }
  const data = await Tutorial.get(step.value)
  content.value = await marked.parse(data.content, { async: true })
}

// 用 js 来写的，可以换成 vue 的方式
function addButton() {
  const action = document.createElement("div")
  action.className = "codeblock-action"
  const pres = $content.value?.querySelectorAll("pre") ?? []
  for (const pre of pres) {
    let timer = 0
    let copyTimer = 0
    const actions = action.cloneNode() as HTMLDivElement
    pre.insertBefore(actions, pre.children[0])
    const code = pre.childNodes[1] as HTMLPreElement
    const match = code.className.match(/-(.*)/)
    let lang = "html"
    if (match) lang = match[1].toLowerCase()
    actions.innerHTML = `<span class="lang">${lang.toUpperCase()}</span><div><div class="btn copy">复制</div><div class="btn">替换</div></div>`
    const $copy = actions.children[1].children[0] as HTMLDivElement
    const $replace = actions.children[1].children[1] as HTMLDivElement
    $copy.onclick = () => {
      $copy.innerHTML = "已复制"
      clearTimeout(copyTimer)
      copyTimer = setTimeout(() => {
        $copy.innerHTML = "复制"
      }, 1000)
    }
    $replace.onclick = () => {
      tab.value = lang
      const content = pre.children[1].textContent
      if (lang === "html") html.value = content
      if (lang === "css") css.value = content
      if (lang === "js") js.value = content
      // 样式
      $replace.innerHTML = "已替换"
      clearTimeout(timer)
      timer = setTimeout(() => {
        $replace.innerHTML = "替换"
      }, 1000)
    }
  }
}

function modifyLink() {
  const links = $content.value?.querySelectorAll("a") ?? []
  for (const link of links) {
    link.target = "_blank"
  }
}

async function render() {
  await getContent()
  addButton()
  modifyLink()
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
  padding: 0;
  font-size: 1rem;
  font-family: Monaco;
}

.codeblock-action {
  margin-bottom: 1rem;
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
  top: 2px;
  right: 0;
  padding: 1rem;
  cursor: pointer;
  border-radius: 0.4rem;
  font-size: 1rem;
}

.codeblock-action .btn.copy {
  right: 60px;
}
</style>
