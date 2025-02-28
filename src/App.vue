<script setup lang="ts">
import { dateZhCN, zhCN } from "naive-ui"
import { useMagicKeys, whenever } from "@vueuse/core"
import Login from "./components/Login.vue"
import { onMounted, watch } from "vue"
import { getMyProfile } from "./api"
import { authed, username } from "./store/user"

const { ctrl_s } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === "s" && e.type === "keydown") e.preventDefault()
  },
})

const { ctrl_r } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === "r" && e.type === "keydown") e.preventDefault()
  },
})
whenever(ctrl_s, () => {})
whenever(ctrl_r, () => {})

onMounted(async () => {
  // const data = await getMyProfile()
  // username.value = data
})

watch(authed, (v) => {
  if (v) {
    localStorage.setItem("web-isloggedin", "true")
  } else {
    localStorage.removeItem("web-isloggedin")
  }
})
</script>

<template>
  <n-config-provider class="myContainer" :locale="zhCN" :date-locale="dateZhCN">
    <n-modal-provider>
      <router-view></router-view>
      <Login />
    </n-modal-provider>
  </n-config-provider>
</template>
<style scoped>
.myContainer {
  height: 100vh;
  width: 100vw;
}
</style>
