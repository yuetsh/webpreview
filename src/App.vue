<script setup lang="ts">
import { dateZhCN, zhCN } from "naive-ui"
import Login from "./components/Login.vue"
import { onMounted, watch } from "vue"
import { getMyProfile } from "./api"
import { authed, user } from "./store/user"

onMounted(async () => {
  const data = await getMyProfile()
  user.loaded = true
  user.username = data.username
  user.role = data.role
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
      <n-message-provider>
        <router-view></router-view>
        <Login />
      </n-message-provider>
    </n-modal-provider>
  </n-config-provider>
</template>
<style scoped>
.myContainer {
  height: 100vh;
  width: 100vw;
}
</style>
