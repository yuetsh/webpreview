<template>
  <n-tabs
    :value="tab"
    pane-class="pane"
    style="height: 100%"
    type="card"
    @update:value="changeTab"
  >
    <n-tab-pane name="html" tab="HTML">
      <template #tab>
        <n-flex align="center">
          <Icon :width="20" icon="skill-icons:html"></Icon>
          <span>HTML</span>
        </n-flex>
      </template>
      <Editor v-model:value="html" :font-size="size" language="html" />
    </n-tab-pane>
    <n-tab-pane name="css" tab="CSS">
      <template #tab>
        <n-flex align="center">
          <Icon :width="20" icon="skill-icons:css"></Icon>
          <span>CSS</span>
        </n-flex>
      </template>
      <Editor v-model:value="css" :font-size="size" language="css" />
    </n-tab-pane>
    <n-tab-pane name="js" tab="JS">
      <template #tab>
        <n-flex align="center">
          <Icon :width="20" icon="skill-icons:javascript"></Icon>
          <span>JS</span>
        </n-flex>
      </template>
      <Editor v-model:value="js" :font-size="size" language="js" />
    </n-tab-pane>
    <n-tab-pane name="actions" tab="选项">
      <template #tab>
        <n-flex align="center">
          <Icon :width="20" icon="skill-icons:actix-dark"></Icon>
          <span>选项</span>
        </n-flex>
      </template>
      <n-flex class="wrapper" vertical>
        <n-flex align="center">
          <span class="label">重置</span>
          <n-button @click="reset('html')">HTML</n-button>
          <n-button @click="reset('css')">CSS</n-button>
          <n-button @click="reset('js')">JS</n-button>
        </n-flex>
        <n-flex align="center">
          <span class="label">字号</span>
          <n-flex align="center">
            <span :style="{ 'font-size': size + 'px' }">{{ size }}</span>
            <n-button :disabled="size === 20" @click="changeSize(size - 2)">
              调小
            </n-button>
            <n-button :disabled="size === 40" @click="changeSize(size + 2)">
              调大
            </n-button>
          </n-flex>
        </n-flex>
        <n-flex align="center">
          <span class="label">预加载</span>
          <n-tag type="success">Normalize.css</n-tag>
          <n-tag type="success">jQuery</n-tag>
        </n-flex>
      </n-flex>
    </n-tab-pane>
    <template #suffix>
      <n-flex align="center" class="suffix">
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
  </n-tabs>
</template>
<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import Editor from "./Editor.vue"
import { html, css, js, tab, size, reset } from "../store/editors"
import { user, authed, roleNormal } from "../store/user"
import { loginModal } from "../store/modal"
import { Account } from "../api"
import { Role } from "../utils/type"
import { router } from "../router"
import { computed, h } from "vue"
import { useMessage } from "naive-ui"

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

function changeTab(name: string) {
  tab.value = name
}

function changeSize(num: number) {
  size.value = num
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
.pane {
  height: 100%;
  overflow: auto;
}

.wrapper {
  padding-left: 16px;
}

.label {
  font-size: 16px;
}

.suffix {
  margin-right: 20px;
}
</style>
