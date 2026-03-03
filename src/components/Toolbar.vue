<template>
  <n-flex align="center" class="corner">
    <n-button quaternary v-if="!show" @click="showTutorial">
      打开{{ TASK_LABEL[taskTab] }}
    </n-button>
    <template v-if="user.loaded && authed">
      <n-button quaternary @click="emit('format')">整理</n-button>
      <n-button
        type="primary"
        secondary
        :disabled="submitDisabled"
        :loading="submitLoading"
        @click="emit('submit')"
      >
        提交
      </n-button>
      <n-dropdown :options="menu" @select="clickMenu">
        <n-button>{{ user.username }}</n-button>
      </n-dropdown>
    </template>
    <n-button
      v-if="user.loaded && !authed"
      @click="handleLogin"
      secondary
      type="primary"
    >
      登录
    </n-button>
  </n-flex>
</template>
<script lang="ts" setup>
import { computed, h } from "vue"
import { Icon } from "@iconify/vue"
import { authed, roleNormal, roleSuper, user } from "../store/user"
import { loginModal } from "../store/modal"
import { show, tutorialSize, step } from "../store/tutorial"
import { taskId, taskTab } from "../store/task"
import { Account } from "../api"
import { Role } from "../utils/type"
import { router } from "../router"
import { ADMIN_URL, TASK_LABEL } from "../utils/const"

const props = defineProps<{
  submitLoading: boolean
}>()
const emit = defineEmits(["format", "submit"])

const submitDisabled = computed(() => {
  return taskId.value === 0
})

const menu = computed(() => [
  {
    label: "后台管理",
    key: "dashboard",
    show: !roleNormal.value,
    icon: () =>
      h(Icon, {
        icon: "streamline-emojis:robot-face-1",
      }),
  },
  {
    label: "数据管理",
    key: "admin",
    show: roleSuper.value,
    icon: () =>
      h(Icon, {
        icon: "skill-icons:django",
      }),
  },
  {
    label: "我的提交",
    key: "submissions",
    icon: () =>
      h(Icon, {
        icon: "streamline-emojis:bar-chart",
      }),
  },
  {
    label: "退出账号",
    key: "logout",
    icon: () =>
      h(Icon, {
        icon: "streamline-emojis:hot-beverage-2",
      }),
  },
])

function showTutorial() {
  show.value = true
  tutorialSize.value = 2 / 5
}

function clickMenu(name: string) {
  switch (name) {
    case "dashboard":
      router.push({ name: "tutorial-editor", params: { display: step.value } })
      break
    case "admin":
      window.open(ADMIN_URL)
      break
    case "submissions":
      router.push({
        name: "submissions",
        params: { page: 1 },
        query: { username: user.username },
      })
      break
    case "logout":
      handleLogout()
      break
  }
}

function handleLogin() {
  loginModal.value = true
}

async function handleLogout() {
  await Account.logout()
  user.username = ""
  user.role = Role.Normal
}
</script>
<style scoped>
.corner {
  margin-right: 20px;
}
</style>
