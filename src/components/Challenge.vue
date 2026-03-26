<template>
  <div class="container" v-if="taskTab === TASK_TYPE.Challenge">
    <n-empty v-if="!challenges.length">暂无挑战，敬请期待</n-empty>
    <n-flex v-else vertical :size="12">
      <n-card
        v-for="item in challenges"
        :key="item.display"
        hoverable
        class="challenge-card"
        @click="select(item)"
      >
        <template #header>
          {{ item.title }}
        </template>
        <template #header-extra>
          <n-tag type="warning" size="small">{{ item.score }}分</n-tag>
        </template>
      </n-card>
    </n-flex>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { Challenge } from "../api"
import { taskTab } from "../store/task"
import { TASK_TYPE } from "../utils/const"
import type { ChallengeSlim } from "../utils/type"

const router = useRouter()
const challenges = ref<ChallengeSlim[]>([])

function select(item: ChallengeSlim) {
  router.push({ name: "home-challenge", params: { display: item.display } })
}

onMounted(async () => {
  challenges.value = await Challenge.listDisplay()
})
</script>
<style scoped>
.container {
  padding: 16px;
  overflow: auto;
}

.challenge-card {
  cursor: pointer;
}
</style>
