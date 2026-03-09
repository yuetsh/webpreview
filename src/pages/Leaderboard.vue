<template>
  <div class="container">
    <n-flex justify="space-between" align="center" style="margin-bottom: 16px">
      <n-button secondary @click="$router.back()">返回</n-button>
      <span style="font-weight: bold; font-size: 18px">排行榜</span>
      <div style="width: 60px" />
    </n-flex>
    <n-data-table :columns="columns" :data="data" :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from "vue"
import { Account } from "../api"
import type { DataTableColumn } from "naive-ui"

const data = ref<{ rank: number; username: string; total_score: number }[]>([])
const loading = ref(false)

const columns: DataTableColumn<(typeof data.value)[0]>[] = [
  { title: "排名", key: "rank", width: 70 },
  { title: "用户名", key: "username" },
  {
    title: "总分",
    key: "total_score",
    render: (row) => h("span", { style: "font-weight: bold" }, row.total_score.toFixed(2)),
  },
]

onMounted(async () => {
  loading.value = true
  try {
    data.value = await Account.leaderboard()
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 0 16px;
}
</style>
