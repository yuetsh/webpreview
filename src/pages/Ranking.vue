<template>
  <n-split class="container" direction="horizontal" :default-size="0.333" :min="0.2" :max="0.8">
    <template #1>
      <n-flex vertical style="height: 100%; padding-right: 10px">
        <n-flex justify="space-between" align="center">
          <n-button secondary @click="$router.back()">返回</n-button>
          <span style="font-weight: bold; font-size: 16px">排名榜</span>
          <div style="width: 60px" />
        </n-flex>

        <n-tabs v-model:value="activeZone" type="line" animated @update:value="onZoneChange">
          <n-tab v-for="zone in ZONES" :key="zone.key" :name="zone.key">
            <n-flex align="center" :style="{ gap: '4px' }">
              <span>{{ zone.label }}</span>
              <n-badge
                v-if="counts[zone.key] !== undefined"
                :value="counts[zone.key]"
                :max="999"
                :show-zero="true"
                style="margin-left: 4px"
              />
            </n-flex>
          </n-tab>
        </n-tabs>

        <n-empty
          v-if="!loading && data.length === 0"
          description="该区暂无提交"
          style="margin: auto"
        />
        <n-data-table
          v-else
          striped
          :columns="columns"
          :data="data"
          :loading="loading"
          :row-props="rowProps"
          :row-class-name="rowClassName"
        />

        <n-pagination
          v-model:page="page"
          :page-size="PAGE_SIZE"
          :item-count="counts[activeZone] ?? 0"
          simple
          style="align-self: flex-end"
        />
      </n-flex>
    </template>
    <template #2>
      <div style="height: 100%; padding-left: 10px">
        <Preview
          v-if="selectedSubmission.id"
          :html="selectedSubmission.html"
          :css="selectedSubmission.css"
          :js="selectedSubmission.js"
          :submission-id="selectedSubmission.id"
          @after-score="afterScore"
        />
      </div>
    </template>
  </n-split>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, h } from "vue"
import type { DataTableColumn } from "naive-ui"
import { Submission } from "../api"
import type { SubmissionOut } from "../utils/type"
import { parseTime } from "../utils/helper"
import Preview from "../components/Preview.vue"
import { submission as submissionStore } from "../store/submission"

const PAGE_SIZE = 10

interface Zone {
  key: string
  label: string
  params: Record<string, unknown>
}

const ZONES: Zone[] = [
  {
    key: "top",
    label: "🏆 精华",
    params: { score_min: 4.5, ordering: "-score" },
  },
  {
    key: "good",
    label: "⭐ 优秀",
    params: { score_min: 3.5, score_max_exclusive: 4.5, ordering: "-score" },
  },
  {
    key: "normal",
    label: "📝 普通",
    params: { score_min: 0.001, score_max_exclusive: 3.5, ordering: "-score" },
  },
  {
    key: "unrated",
    label: "⏳ 待评",
    params: { score_lt_threshold: 0.001, ordering: "-created" },
  },
]

const activeZone = ref("top")
const page = ref(1)
const data = ref<SubmissionOut[]>([])
const loading = ref(false)
const counts = reactive<Record<string, number>>({})

const selectedSubmission = submissionStore

const columns: DataTableColumn<SubmissionOut>[] = [
  {
    title: "#",
    key: "rank",
    width: 45,
    render: (_, index) => (page.value - 1) * PAGE_SIZE + index + 1,
  },
  {
    title: "得分",
    key: "score",
    width: 65,
    render: (row) =>
      row.score > 0
        ? h("span", { style: { fontWeight: "bold" } }, row.score.toFixed(2))
        : h("span", { style: { color: "#999" } }, "—"),
  },
  { title: "提交者", key: "username", width: 80, render: (row) => row.username },
  { title: "任务", key: "task_title", render: (row) => row.task_title },
  {
    title: "时间",
    key: "created",
    width: 110,
    render: (row) => parseTime(row.created, "YYYY-MM-DD HH:mm:ss"),
  },
]

function rowProps(row: SubmissionOut) {
  return {
    style: { cursor: "pointer" },
    onClick: () => loadSubmission(row.id),
  }
}

function rowClassName(row: SubmissionOut) {
  return submissionStore.value.id === row.id ? "row-active" : ""
}

async function loadSubmission(id: string) {
  submissionStore.value = await Submission.get(id)
}

function afterScore() {
  data.value = data.value.map((d) => {
    if (d.id === submissionStore.value.id) {
      d.my_score = submissionStore.value.my_score
    }
    return d
  })
}

function currentZone(): Zone {
  return ZONES.find((z) => z.key === activeZone.value)!
}

async function fetchPage() {
  loading.value = true
  try {
    const zone = currentZone()
    const res = await Submission.list({
      page: page.value,
      task_type: "challenge",
      nominated: true,
      ...zone.params,
    } as Parameters<typeof Submission.list>[0])
    data.value = res.items
    counts[zone.key] = res.count
  } finally {
    loading.value = false
  }
}

async function fetchAllCounts() {
  await Promise.all(
    ZONES.map(async (zone) => {
      const res = await Submission.list({
        page: 1,
        task_type: "challenge",
        nominated: true,
        ...zone.params,
      } as Parameters<typeof Submission.list>[0])
      counts[zone.key] = res.count
    }),
  )
}

function onZoneChange() {
  page.value = 1
  fetchPage()
}

watch(page, fetchPage)

onMounted(async () => {
  await fetchAllCounts()
  await fetchPage()
})
</script>

<style scoped>
.container {
  padding: 10px;
  box-sizing: border-box;
  height: calc(100% - 43px);
  width: 100%;
}

:deep(.row-active td) {
  background-color: rgba(24, 160, 80, 0.1) !important;
}
</style>
