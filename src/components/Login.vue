<template>
  <n-modal
    preset="card"
    title="登录"
    style="width: 400px"
    v-model:show="loginModal"
  >
    <n-form>
      <n-form-item label="用户名">
        <n-input v-model:value="name" name="username"></n-input>
      </n-form-item>
      <n-form-item label="密码">
        <n-input
          type="password"
          v-model:value="password"
          name="password"
        ></n-input>
      </n-form-item>
      <n-alert
        type="error"
        v-if="showMeesage"
        class="message"
        title="登录失败，请检查用户名和密码"
      ></n-alert>
      <n-flex>
        <n-button block :loading="loading" @click="submit" type="primary">登录</n-button>
      </n-flex>
    </n-form>
  </n-modal>
</template>
<script lang="ts" setup>
import { ref } from "vue"
import { Account } from "../api"
import { loginModal } from "../store/modal"
import { user } from "../store/user"

const name = ref("")
const password = ref("")
const loading = ref(false)
const showMeesage = ref(false)

async function submit() {
  loading.value = true
  try {
    const data = await Account.login(name.value, password.value)
    user.username = data.username
    user.role = data.role
    user.loaded = true
    loginModal.value = false
    loading.value = false
  } catch (err) {
    showMeesage.value = true
    loading.value = false
  }
}
</script>
<style scoped>
.message {
  margin-bottom: 20px;
}
</style>
