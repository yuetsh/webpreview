<template>
  <div class="challenge-layout">
    <div class="challenge-sider">
      <n-tabs v-model:value="activeTab" type="line" class="left-tabs">
        <template #prefix>
          <n-button text @click="back" style="margin: 0 8px">
            <Icon :width="20" icon="pepicons-pencil:arrow-left" />
          </n-button>
        </template>
        <template #suffix>
          <n-flex style="margin: 0 8px">
            <n-button
              v-if="authed"
              text
              @click="$router.push({ name: 'submissions', params: { page: 1 } })"
            >
              <Icon :width="16" icon="lucide:list" />
            </n-button>
            <n-button v-if="roleSuper" text @click="edit">
              <Icon :width="16" icon="lucide:edit" />
            </n-button>
          </n-flex>
        </template>
        <n-tab-pane name="desc" tab="挑战描述" display-directive="show">
          <div
            class="markdown-body"
            style="padding: 12px; overflow-y: auto; height: 100%"
            v-html="challengeContent"
          />
        </n-tab-pane>
        <n-tab-pane name="chat" tab="AI 对话" display-directive="show">
          <PromptPanel />
        </n-tab-pane>
        <n-tab-pane name="external" tab="手动提交" display-directive="show">
          <ExternalAIPanel :task-id="taskId" />
        </n-tab-pane>
      </n-tabs>
    </div>
    <div class="challenge-content">
      <Preview
        :html="html"
        :css="css"
        :js="js"
        show-code-button
        clearable
        @showCode="showCode = true"
        @clear="clearAll"
      />
    </div>
  </div>
  <n-modal
    v-model:show="showCode"
    preset="card"
    title="代码"
    style="width: 700px"
  >
    <n-tabs type="line">
      <n-tab-pane name="html" tab="HTML">
        <n-code :code="html" language="html" />
      </n-tab-pane>
      <n-tab-pane name="css" tab="CSS">
        <n-code :code="css" language="css" />
      </n-tab-pane>
      <n-tab-pane name="js" tab="JS">
        <n-code :code="js" language="javascript" />
      </n-tab-pane>
    </n-tabs>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useMessage } from "naive-ui"
import { Icon } from "@iconify/vue"
import { marked } from "marked"
import PromptPanel from "../components/PromptPanel.vue"
import ExternalAIPanel from "../components/ExternalAIPanel.vue"
import Preview from "../components/Preview.vue"
import { Challenge, Submission } from "../api"
import { html, css, js } from "../store/editors"
import { taskId } from "../store/task"
import { authed, roleSuper } from "../store/user"
import {
  connectPrompt,
  disconnectPrompt,
  conversationId,
  streaming,
  setOnCodeComplete,
  loadHistory,
} from "../store/prompt"

const route = useRoute()
const router = useRouter()
const message = useMessage()

const activeTab = ref("desc")
const challengeContent = ref("")
const showCode = ref(false)

watch(streaming, (val) => {
  if (val) activeTab.value = "chat"
})

async function loadChallenge() {
  const display = Number(route.params.display)
  const data = await Challenge.get(display)
  taskId.value = data.task_ptr
  challengeContent.value = await marked.parse(data.content, { async: true })
  if (!authed.value) return
  loadHistory(data.task_ptr) // HTTP preload — async, non-blocking
  connectPrompt(data.task_ptr) // WebSocket — synchronous open
  setOnCodeComplete(async (code) => {
    if (!conversationId.value) return
    try {
      await Submission.create(taskId.value, {
        html: code.html ?? "",
        css: code.css ?? "",
        js: code.js ?? "",
        conversationId: conversationId.value,
      })
      message.success("已自动提交本次对话生成的代码")
    } catch {
      // 静默失败，不打扰用户
    }
  })
}

function edit() {
  router.push({
    name: "challenge-editor",
    params: { display: route.params.display },
  })
}

function clearAll() {
  html.value = ""
  css.value = ""
  js.value = ""
}

function back() {
  disconnectPrompt()
  router.push({ name: "home-challenge-list" })
}

onMounted(loadChallenge)
onUnmounted(disconnectPrompt)
</script>

<style scoped>
.challenge-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.challenge-sider {
  width: 40%;
  height: 100%;
  overflow: hidden;
  border-right: 1px solid var(--n-border-color, #efeff5);
  flex-shrink: 0;
}

.challenge-content {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

.left-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.left-tabs :deep(.n-tabs-pane-wrapper) {
  flex: 1;
  overflow: hidden;
}

.left-tabs :deep(.n-tab-pane) {
  height: 100%;
  padding: 0;
}
</style>
