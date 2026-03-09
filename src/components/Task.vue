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
          <n-button
            text
            @click="tutorialRef?.prev()"
            :disabled="tutorialRef?.prevDisabled()"
          >
            <Icon :width="24" icon="pepicons-pencil:arrow-left"></Icon>
          </n-button>
          <n-button
            text
            @click="tutorialRef?.next()"
            :disabled="tutorialRef?.nextDisabled()"
          >
            <Icon :width="24" icon="pepicons-pencil:arrow-right"></Icon>
          </n-button>
        </template>
      </n-flex>
      <n-flex>
        <n-button
          text
          @click="$router.push({ name: 'submissions', params: { page: 1 } })"
        >
          <Icon :width="16" icon="lucide:list"></Icon>
        </n-button>
        <n-button text @click="$router.push({ name: 'leaderboard' })">
          <Icon :width="16" icon="lucide:trophy" />
        </n-button>
        <n-button text v-if="isLoggedIn" @click="$router.push({ name: 'my-scores' })">
          <Icon :width="16" icon="lucide:bar-chart-2" />
        </n-button>
        <n-button text v-if="roleSuper" @click="edit">
          <Icon :width="16" icon="lucide:edit"></Icon>
        </n-button>
        <n-button text @click="$emit('hide')">
          <Icon :width="24" icon="material-symbols:close-rounded"></Icon>
        </n-button>
      </n-flex>
    </n-flex>
    <Tutorial v-if="taskTab === TASK_TYPE.Tutorial" ref="tutorialRef" />
    <Challenge v-else />
  </div>
</template>
<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import { computed, onMounted, ref } from "vue"
import { step } from "../store/tutorial"
import { roleSuper } from "../store/user"
import { taskTab, challengeDisplay } from "../store/task"
import { useRoute, useRouter } from "vue-router"
import { TASK_TYPE, STORAGE_KEY } from "../utils/const"
import Challenge from "./Challenge.vue"
import Tutorial from "./Tutorial.vue"

const route = useRoute()
const router = useRouter()
const tutorialRef = ref<InstanceType<typeof Tutorial>>()

defineEmits(["hide"])

const isLoggedIn = computed(() => localStorage.getItem(STORAGE_KEY.LOGIN) === "true")

const hideNav = computed(
  () =>
    taskTab.value !== TASK_TYPE.Tutorial ||
    (tutorialRef.value?.tutorialIds?.length ?? 0) <= 1,
)

function changeTab(v: TASK_TYPE) {
  taskTab.value = v
  if (v === TASK_TYPE.Tutorial) {
    router.push(
      step.value
        ? { name: "home-tutorial", params: { display: step.value } }
        : { name: "home-tutorial-list" },
    )
  } else if (v === TASK_TYPE.Challenge) {
    challengeDisplay.value = 0
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

function init() {
  const name = route.name as string
  if (name.startsWith("home-tutorial")) {
    taskTab.value = TASK_TYPE.Tutorial
    if (route.params.display) step.value = Number(route.params.display)
  } else if (name.startsWith("home-challenge")) {
    taskTab.value = TASK_TYPE.Challenge
    if (route.params.display)
      challengeDisplay.value = Number(route.params.display)
  }
}

onMounted(init)
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
</style>
