<script setup lang="ts">
import { dateZhCN, zhCN } from "naive-ui"
import Login from "./components/Login.vue"
import { onMounted, watch } from "vue"
import { Account } from "./api"
import { authed, user } from "./store/user"
import { STORAGE_KEY } from "./utils/const"

onMounted(async () => {
  const data = await Account.getMyProfile()
  user.loaded = true
  user.username = data.username
  user.role = data.role
})

watch(authed, (v) => {
  if (v) {
    localStorage.setItem(STORAGE_KEY.LOGIN, "true")
  } else {
    localStorage.removeItem(STORAGE_KEY.LOGIN)
  }
})
</script>

<template>
  <n-config-provider class="myContainer" :locale="zhCN" :date-locale="dateZhCN">
    <n-modal-provider>
      <n-message-provider>
        <n-dialog-provider>
          <router-view></router-view>
          <Login />
        </n-dialog-provider>
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
