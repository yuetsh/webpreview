<template>
  <div class="container">
    <n-flex align="center" justify="space-between" class="title">
      <n-flex align="center">
        <Icon
          :icon="
            taskTab === TASK_TYPE.Tutorial
              ? 'twemoji:books'
              : 'twemoji:crossed-swords'
          "
          :width="20"
        ></Icon>
        <n-tabs
          style="width: 140px"
          type="segment"
          animated
          :value="taskTab"
          @update:value="changeTab"
        >
          <n-tab name="tutorial" tab="教程"></n-tab>
          <n-tab name="challenge" tab="挑战"></n-tab>
        </n-tabs>
        <template v-if="!hideNav">
          <n-button text @click="prev" :disabled="prevDisabled">
            <Icon :width="24" icon="pepicons-pencil:arrow-left"></Icon>
          </n-button>
          <n-button text @click="next" :disabled="nextDisabled">
            <Icon :width="24" icon="pepicons-pencil:arrow-right"></Icon>
          </n-button>
        </template>
      </n-flex>
      <n-flex>
        <n-button text v-if="roleSuper" @click="edit">
          <Icon :width="16" icon="lucide:edit"></Icon>
        </n-button>
        <n-button text @click="$emit('hide')">
          <Icon :width="24" icon="material-symbols:close-rounded"></Icon>
        </n-button>
      </n-flex>
    </n-flex>
    <div
      v-if="taskTab === TASK_TYPE.Tutorial"
      class="markdown-body"
      v-html="content"
      ref="$content"
    />
    <Challenge v-else />
  </div>
</template>
<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import { computed, onMounted, ref, useTemplateRef, watch } from "vue"
import { marked } from "marked"
import copyFn from "copy-text-to-clipboard"
import { css, html, js, tab } from "../store/editors"
import { Tutorial } from "../api"
import { step } from "../store/tutorial"
import { roleSuper } from "../store/user"
import { taskId, taskTab } from "../store/task"
import { useRoute, useRouter } from "vue-router"
import { TASK_TYPE } from "../utils/const"
import Challenge from "./Challenge.vue"
import { NButton } from 'naive-ui'

const route = useRoute()
const router = useRouter()
const tutorialIds = ref<number[]>([])
const content = ref("")
const $content = useTemplateRef<any>("$content")

defineEmits(["hide"])

const hideNav = computed(
  () => taskTab.value === TASK_TYPE.Challenge || tutorialIds.value.length <= 1,
)

function changeTab(v: TASK_TYPE) {
  taskTab.value = v
  const query = { task: v } as any
  if (v === TASK_TYPE.Tutorial) query.step = step.value
  router.push({ query })
}

const prevDisabled = computed(() => {
  const i = tutorialIds.value.indexOf(step.value)
  return i <= 0
})

const nextDisabled = computed(() => {
  const i = tutorialIds.value.indexOf(step.value)
  return i === tutorialIds.value.length - 1
})

function prev() {
  const i = tutorialIds.value.indexOf(step.value)
  step.value = tutorialIds.value[i - 1]
}

function next() {
  const i = tutorialIds.value.indexOf(step.value)
  step.value = tutorialIds.value[i + 1]
}

function edit() {
  router.push({
    name: taskTab.value,
    params: taskTab.value === TASK_TYPE.Tutorial ? { display: step.value } : {},
  })
}

async function prepare() {
  tutorialIds.value = await Tutorial.listDisplay()
  if (!tutorialIds.value.length) {
    content.value = "暂无教程"
  }
  if (!tutorialIds.value.includes(step.value)) {
    step.value = tutorialIds.value[0]
  }
}

async function getContent() {
  const data = await Tutorial.get(step.value)
  taskId.value = data.task_ptr
  const merged = `# #${data.display} ${data.title}\n${data.content}`
  content.value = await marked.parse(merged, { async: true })
}

function addButton() {
  const action = document.createElement("div")
  action.className = "codeblock-action"
  const pres = $content.value?.querySelectorAll("pre") ?? []
  for (const pre of pres) {
    let timer = 0
    let copyTimer = 0
    const actions = action.cloneNode() as HTMLDivElement
    pre.insertBefore(actions, pre.children[0])
    const $code = pre.childNodes[1] as HTMLPreElement
    const match = $code.className.match(/-(.*)/)
    let lang = "html"
    if (match) lang = match[1].toLowerCase()
    
    const langSpan = document.createElement('span')
    langSpan.className = 'lang'
    langSpan.textContent = lang.toUpperCase()
    
    const btnGroup = document.createElement('div')
    btnGroup.className = 'btn-group'
    
    const copyBtn = document.createElement('button')
    copyBtn.className = 'action-btn'
    copyBtn.textContent = '复制'
    
    const replaceBtn = document.createElement('button')
    replaceBtn.className = 'action-btn'
    replaceBtn.textContent = '替换'
    
    btnGroup.appendChild(copyBtn)
    btnGroup.appendChild(replaceBtn)
    
    actions.appendChild(langSpan)
    actions.appendChild(btnGroup)
    
    copyBtn.onclick = () => {
      const content = pre.children[1].textContent
      copyFn(content ?? "")
      copyBtn.textContent = "已复制"
      clearTimeout(copyTimer)
      copyTimer = setTimeout(() => {
        copyBtn.textContent = "复制"
      }, 1000)
    }
    
    replaceBtn.onclick = () => {
      tab.value = lang
      const content = pre.children[1].textContent
      if (lang === "html") html.value = content
      if (lang === "css") css.value = content
      if (lang === "js") js.value = content
      replaceBtn.textContent = "已替换"
      clearTimeout(timer)
      timer = setTimeout(() => {
        replaceBtn.textContent = "替换"
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

async function init() {
  if (route.query.task) {
    taskTab.value = route.query.task as TASK_TYPE
  }
  if (route.query.step) {
    step.value = Number(route.query.step)
  }
  const query = { task: taskTab.value } as any
  if (taskTab.value === TASK_TYPE.Tutorial) query.step = step.value
  router.push({ query })
  await prepare()
  render()
}

onMounted(init)
watch(step, (v) => {
  router.push({ query: { ...route.query, step: v } })
  render()
})
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
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.codeblock-action .lang {
  font-size: 0.9rem;
  font-weight: bold;
}

.codeblock-action .btn-group {
  display: flex;
  gap: 0.5rem;
}

.codeblock-action .action-btn {
  height: 28px;
  padding: 0 14px;
  font-size: 14px;
  border-radius: 3px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.codeblock-action .action-btn:hover {
  border-color: #18a058;
  color: #18a058;
}
</style>
