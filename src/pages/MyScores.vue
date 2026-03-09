<template>
  <div class="container">
    <n-flex justify="space-between" align="center" style="margin-bottom: 16px">
      <n-button secondary @click="$router.back()">返回</n-button>
      <span style="font-weight: bold; font-size: 18px">我的成绩</span>
      <div style="width: 60px" />
    </n-flex>
    <n-empty v-if="!loading && !data.length" description="暂无评分记录" />
    <n-data-table v-else :columns="columns" :data="data" :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from "vue"
import { Submission } from "../api"
import type { DataTableColumn } from "naive-ui"
import { parseTime } from "../utils/helper"

type MyScore = {
  task_id: number
  task_display: number
  task_title: string
  score: number
  created: string
}

const data = ref<MyScore[]>([])
const loading = ref(false)

const columns: DataTableColumn<MyScore>[] = [
  { title: "题号", key: "task_display", width: 70 },
  { title: "标题", key: "task_title" },
  {
    title: "最高得分",
    key: "score",
    render: (row) =>
      row.score > 0
        ? h("span", { style: { fontWeight: "bold", color: "#18a058" } }, row.score.toFixed(2))
        : h("span", { style: { color: "#999" } }, "未评分"),
  },
  {
    title: "提交时间",
    key: "created",
    render: (row) => parseTime(row.created, "YYYY-MM-DD HH:mm"),
  },
]

onMounted(async () => {
  loading.value = true
  try {
    data.value = await Submission.myScores()
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.container {
  max-width: 700px;
  margin: 40px auto;
  padding: 0 16px;
}
</style>
