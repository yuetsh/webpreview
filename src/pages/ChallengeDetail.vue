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
            <n-button v-if="assets.length" text @click="showAssets = true">
              <Icon :width="16" icon="lucide:image" />
            </n-button>
            <n-button
              v-if="roleAdmin || roleSuper"
              text
              @click="showStats = true"
            >
              <Icon :width="16" icon="lucide:bar-chart-2" />
            </n-button>
            <n-button
              v-if="authed"
              text
              @click="
                $router.push({ name: 'submissions', params: { page: 1 } })
              "
            >
              <Icon :width="16" icon="lucide:list" />
            </n-button>
            <n-button v-if="roleSuper" text @click="edit">
              <Icon :width="16" icon="lucide:edit" />
            </n-button>
          </n-flex>
        </template>
        <n-tab-pane name="desc" tab="挑战描述" display-directive="show">
          <div class="markdown-body content" v-html="challengeContent" />
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
        :asset-base-url="assetBaseUrl"
        show-code-button
        clearable
        @showCode="showCode = true"
        @clear="clearAll"
      />
    </div>
  </div>
  <TaskStatsModal v-model:show="showStats" :task-id="taskId" />
  <n-modal
    v-model:show="showAssets"
    preset="card"
    title="素材"
    style="width: 500px"
  >
    <n-grid :cols="3" :x-gap="12" :y-gap="12">
      <n-gi v-for="asset in assets" :key="asset.name">
        <n-card size="small" :title="asset.name">
          <n-image
            :src="asset.url"
            style="width: 100%; height: 100px; object-fit: contain"
          />
        </n-card>
      </n-gi>
    </n-grid>
  </n-modal>
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
import { ref, watch, onMounted, onUnmounted, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useMessage } from "naive-ui"
import { Icon } from "@iconify/vue"
import { marked } from "marked"
import PromptPanel from "../components/ai/PromptPanel.vue"
import ExternalAIPanel from "../components/ai/ExternalAIPanel.vue"
import Preview from "../components/editor/Preview.vue"
import TaskStatsModal from "../components/task/TaskStatsModal.vue"
import { Challenge, Submission, TaskAssets } from "../api"
import type { TaskAsset } from "../utils/type"
import { html, css, js } from "../store/editors"
import { taskId, taskTab, challengeDisplay } from "../store/task"
import { TASK_TYPE } from "../utils/const"
import { authed, roleAdmin, roleSuper } from "../store/user"
import {
  connectPrompt,
  disconnectPrompt,
  streaming,
  setOnCodeComplete,
} from "../store/prompt"

const route = useRoute()
const router = useRouter()
const message = useMessage()

const activeTab = ref("desc")
const challengeContent = ref("")
const showCode = ref(false)
const showStats = ref(false)
const showAssets = ref(false)
const assets = ref<TaskAsset[]>([])

const assetBaseUrl = computed(
  () => `/media/tasks/challenge/${challengeDisplay.value}/`,
)

watch(streaming, (val) => {
  if (val) activeTab.value = "chat"
})

async function loadChallenge() {
  const display = Number(route.params.display)
  taskTab.value = TASK_TYPE.Challenge
  challengeDisplay.value = display
  const data = await Challenge.get(display)
  taskId.value = data.task_ptr
  challengeContent.value = await marked.parse(data.content, { async: true })
  assets.value = await TaskAssets.listChallenge(display)
  if (!authed.value) return
  connectPrompt(data.task_ptr)
  setOnCodeComplete(async (code) => {
    try {
      await Submission.create(taskId.value, {
        html: code.html ?? "",
        css: code.css ?? "",
        js: code.js ?? "",
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
  taskId.value = 0
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
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.left-tabs :deep(.n-tab-pane) {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  padding: 0;
}

.content {
  padding: 12px;
  overflow-y: auto;
  height: 100%;
  box-sizing: border-box;
}
</style>
