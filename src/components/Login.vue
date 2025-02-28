<template>
  <n-modal
    preset="card"
    title="登录"
    style="width: 400px"
    v-model:show="loginModal"
  >
    <n-form>
      <n-form-item label="用户名">
        <n-input v-model:value="name"></n-input>
      </n-form-item>
      <n-form-item label="密码">
        <n-input v-model:value="password"></n-input>
      </n-form-item>
      <n-alert
        type="error"
        v-if="showMeesage"
        class="message"
        title="登录失败"
      ></n-alert>
      <n-flex>
        <n-button @click="submit">登录</n-button>
      </n-flex>
    </n-form>
  </n-modal>
</template>
<script lang="ts" setup>
import { ref } from "vue"
import { login } from "../api"
import { loginModal } from "../store/modal"
import { username } from "../store/user"

const name = ref("")
const password = ref("")

const showMeesage = ref(false)

async function submit() {
  try {
    const data = await login(name.value, password.value)
    username.value = data
    loginModal.value = false
  } catch (err) {
    showMeesage.value = true
  }
}
</script>
<style scoped>
.message {
  margin-bottom: 20px;
}
</style>
