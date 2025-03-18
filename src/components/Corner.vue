<template>
  <n-flex align="center" class="corner">
    <n-button secondary v-if="!show" @click="showTutorial">教程</n-button>
    <n-button secondary @click="$router.push({ name: 'submissions' })">
      查看
    </n-button>
    <template v-if="user.loaded && authed">
      <n-button
        type="primary"
        secondary
        :disabled="submitDisabled"
        :loading="submitLoading"
        @click="submit"
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
import { computed, h, ref } from "vue"
import { useMessage } from "naive-ui"
import { Icon } from "@iconify/vue"
import { authed, roleNormal, roleSuper, user } from "../store/user"
import { loginModal } from "../store/modal"
import { show, tutorialSize, step } from "../store/tutorial"
import { taskId } from "../store/task"
import { html, css, js } from "../store/editors"
import { Account, Submission } from "../api"
import { Role } from "../utils/type"
import { router } from "../router"
import { ADMIN_URL } from "../utils/const"

const message = useMessage()

const submitLoading = ref(false)

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
      router.push({ name: "tutorial", params: { display: step.value } })
      break
    case "admin":
      window.open(ADMIN_URL)
      break
    case "submissions":
      router.push({ name: "submissions" })
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

async function submit() {
  try {
    submitLoading.value = true
    await Submission.create(taskId.value, {
      html: html.value,
      css: css.value,
      js: js.value,
    })
    message.success("提交成功")
  } catch (err) {
    message.error("提交失败")
  } finally {
    submitLoading.value = false
  }
}
</script>
<style scoped>
.corner {
  margin-right: 20px;
}
</style>
