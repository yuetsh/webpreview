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
          style="width: 150px"
          type="segment"
          animated
          :value="taskTab"
          @update:value="changeTab"
        >
          <n-tab name="tutorial" tab="教程"></n-tab>
          <n-tab name="challenge" tab="挑战"></n-tab>
        </n-tabs>
        <template v-if="!hideNav">
          <n-button text @click="prev()" :disabled="prevDisabled()">
            <Icon :width="24" icon="pepicons-pencil:arrow-left"></Icon>
          </n-button>
          <span v-if="progressText" class="progress-text">{{ progressText }}</span>
          <n-button text @click="next()" :disabled="nextDisabled()">
            <Icon :width="24" icon="pepicons-pencil:arrow-right"></Icon>
          </n-button>
        </template>
      </n-flex>
      <n-flex>
        <n-button
          v-if="authed"
          text
          @click="$router.push({ name: 'submissions', params: { page: 1 } })"
        >
          <Icon :width="16" icon="lucide:list"></Icon>
        </n-button>
        <n-button text v-if="roleSuper" @click="edit">
          <Icon :width="16" icon="lucide:edit"></Icon>
        </n-button>
        <n-button text @click="$emit('hide')">
          <Icon :width="24" icon="material-symbols:close-rounded"></Icon>
        </n-button>
      </n-flex>
    </n-flex>
    <TutorialContent v-if="taskTab === TASK_TYPE.Tutorial" />
    <ChallengeList v-else />
  </div>
</template>
<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import { computed, watch } from "vue"
import { step, tutorialIds, prev, next, prevDisabled, nextDisabled } from "../../store/tutorial"
import { authed, roleSuper } from "../../store/user"
import { taskTab, taskId, challengeDisplay } from "../../store/task"
import { useRoute, useRouter } from "vue-router"
import { TASK_TYPE } from "../../utils/const"
import ChallengeList from "./ChallengeList.vue"
import TutorialContent from "./TutorialContent.vue"

const route = useRoute()
const router = useRouter()

// 路由同步：初始执行 + watch 响应 SPA 内部导航
function syncRoute(routeName: string) {
  if (routeName.startsWith("home-tutorial")) {
    taskTab.value = TASK_TYPE.Tutorial
    if (route.params.display) step.value = Number(route.params.display)
  } else if (routeName.startsWith("home-challenge")) {
    taskTab.value = TASK_TYPE.Challenge
    if (route.params.display) challengeDisplay.value = Number(route.params.display)
  }
}
syncRoute(route.name as string)
watch(() => route.name as string, syncRoute)

defineEmits(["hide"])

const hideNav = computed(
  () =>
    taskTab.value !== TASK_TYPE.Tutorial || tutorialIds.value.length <= 1,
)

const progressText = computed(() => {
  const ids = tutorialIds.value
  if (!ids.length) return ""
  const i = ids.indexOf(step.value)
  return i === -1 ? "" : `${i + 1} / ${ids.length}`
})

function changeTab(v: TASK_TYPE) {
  taskId.value = 0
  taskTab.value = v
  if (v === TASK_TYPE.Tutorial) {
    router.push(
      step.value
        ? { name: "home-tutorial", params: { display: step.value } }
        : { name: "home-tutorial-list" },
    )
  } else if (v === TASK_TYPE.Challenge) {
    router.push({ name: "home-challenge-list" })
  }
}

function edit() {
  const name =
    taskTab.value === TASK_TYPE.Tutorial
      ? "tutorial-editor"
      : "challenge-editor"
  const display =
    taskTab.value === TASK_TYPE.Tutorial ? step.value : challengeDisplay.value
  router.push({ name, params: { display } })
}
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

.progress-text {
  font-size: 12px;
  color: #999;
  min-width: 36px;
  text-align: center;
  user-select: none;
}
</style>
