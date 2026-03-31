<template>
  <n-flex class="container" :wrap="false">
    <n-flex vertical class="menu">
      <n-button secondary @click="() => goHome($router, taskTab, step)">
        返回
      </n-button>
      <n-button
        v-for="item in menu"
        :key="item.label"
        :type="$route.name === item.route.name ? 'primary' : 'default'"
        @click="$router.push(item.route)"
      >
        {{ item.label }}
      </n-button>
    </n-flex>
    <n-flex class="content">
      <router-view></router-view>
    </n-flex>
  </n-flex>
</template>
<script lang="ts" setup>
import { computed } from "vue"
import { taskTab } from "../store/task"
import { step } from "../store/tutorial"
import { roleAdmin, roleSuper } from "../store/user"
import { goHome } from "../utils/helper"

const menu = computed(() =>
  [
    {
      label: "教程",
      route: { name: "tutorial-editor", params: { display: step.value } },
      show: roleSuper.value,
    },
    {
      label: "挑战",
      route: { name: "challenge-editor", params: { display: 0 } },
      show: roleAdmin.value || roleSuper.value,
    },
    {
      label: "用户",
      route: { name: "user-manage", params: { page: 1 } },
      show: roleSuper.value,
    },
    {
      label: "提交",
      route: { name: "submissions", params: { page: 1 } },
      show: roleAdmin.value || roleSuper.value,
    },
  ].filter((item) => item.show),
)
</script>
<style scoped>
.container {
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
}
.menu {
  width: 100px;
  padding: 10px 0 10px 10px;
}
.content {
  box-sizing: border-box;
  width: calc(100vw - 100px);
  overflow: hidden;
}
</style>
