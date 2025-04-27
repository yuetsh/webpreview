<template>
  <div class="container" v-if="taskTab === TASK_TYPE.Challenge">
    <n-empty>暂无挑战，敬请期待</n-empty>
  </div>
</template>
<script setup lang="ts">
import { taskTab } from "../store/task"
import { TASK_TYPE } from "../utils/const"
</script>
<style scoped>
.container {
  padding: 16px;
}
</style>
