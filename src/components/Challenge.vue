<template>
  <div class="container" v-if="taskTab === TASK_TYPE.Challenge">
    <template v-if="currentChallenge">
      <n-flex align="center" style="margin-bottom: 12px">
        <n-button text @click="back">
          <Icon :width="20" icon="pepicons-pencil:arrow-left"></Icon>
        </n-button>
        <span style="font-weight: bold">返回挑战列表</span>
      </n-flex>
      <div class="markdown-body" v-html="content" />
    </template>
    <template v-else>
      <n-empty v-if="!challenges.length">暂无挑战，敬请期待</n-empty>
      <n-grid v-else :cols="3" x-gap="12" y-gap="12">
        <n-gi v-for="item in challenges" :key="item.display">
          <n-card hoverable class="challenge-card" @click="select(item)">
            <template #header>
              {{ item.title }}
            </template>
            <template #header-extra>
              <n-tag type="warning" size="small">{{ item.score }}分</n-tag>
            </template>
          </n-card>
        </n-gi>
      </n-grid>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
import { Icon } from "@iconify/vue"
import { marked } from "marked"
import { useRouter } from "vue-router"
import { Challenge } from "../api"
import { taskTab, taskId, challengeDisplay } from "../store/task"
import { TASK_TYPE } from "../utils/const"
import type { ChallengeSlim } from "../utils/type"

const router = useRouter()
const challenges = ref<ChallengeSlim[]>([])
const currentChallenge = ref<ChallengeSlim | null>(null)
const content = ref("")

async function loadList() {
  challenges.value = await Challenge.listDisplay()
  // 从 URL 恢复选中状态
  if (challengeDisplay.value) {
    const item = challenges.value.find(
      (c) => c.display === challengeDisplay.value,
    )
    if (item) await select(item, false)
  }
}

async function select(item: ChallengeSlim, updateUrl = true) {
  currentChallenge.value = item
  challengeDisplay.value = item.display
  if (updateUrl) {
    router.push({ name: "home-challenge", params: { display: item.display } })
  }
  const data = await Challenge.get(item.display)
  taskId.value = data.task_ptr
  const merged = `# #${data.display} ${data.title}\n${data.content}`
  content.value = await marked.parse(merged, { async: true })
}

function back() {
  currentChallenge.value = null
  challengeDisplay.value = 0
  taskId.value = 0
  content.value = ""
  router.push({ name: "home-challenge-list" })
}

onMounted(loadList)
</script>
<style scoped>
.container {
  padding: 16px;
  overflow: auto;
}

.challenge-card {
  cursor: pointer;
}
</style>
