<template>
  <n-flex align="center" class="corner">
    <template v-if="user.loaded && authed">
      <n-button type="primary" secondary @click="submit">提交</n-button>
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
import { useMessage } from "naive-ui"
import { Icon } from "@iconify/vue"
import { user, authed, roleNormal } from "../store/user"
import { loginModal } from "../store/modal"
import { Account } from "../api"
import { Role } from "../utils/type"
import { router } from "../router"

const message = useMessage()

const menu = computed(() => [
  {
    label: "后台",
    key: "dashboard",
    show: !roleNormal.value,
    icon: () =>
      h(Icon, {
        icon: "streamline-emojis:robot-face-1",
      }),
  },
  {
    label: "退出",
    key: "logout",
    icon: () =>
      h(Icon, {
        icon: "streamline-emojis:hot-beverage-2",
      }),
  },
])

function clickMenu(name: string) {
  switch (name) {
    case "dashboard":
      router.push({ name: "tutorial" })
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

function submit() {
  message.error("未实装")
}
</script>
<style scoped>
.corner {
  margin-right: 20px;
}
</style>
