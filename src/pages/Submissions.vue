<template>
  <n-grid class="container" x-gap="10" :cols="3">
    <n-gi :span="1">
      <n-flex vertical>
        <n-flex justify="space-between">
          <n-button quaternary @click="$router.push({ name: 'home' })">
            返回首页
          </n-button>
          <n-pagination
            v-model:page="query.page"
            :page-size="10"
            :item-count="count"
            simple
          >
            <template #prefix>总共 {{ count }} 条</template>
          </n-pagination>
        </n-flex>
        <n-data-table striped :columns="columns" :data="data"></n-data-table>
      </n-flex>
    </n-gi>
    <n-gi :span="2">
      <Preview
        v-if="submission.id"
        :html="html"
        :css="css"
        :js="js"
        @after-score="afterScore"
        @show-code="codeModal = true"
      />
    </n-gi>
  </n-grid>
  <n-modal
    preset="card"
    title="前端代码"
    v-model:show="codeModal"
    style="max-width: 80%"
  >
    <n-grid x-gap="20" :cols="codeCount">
      <n-gi :span="1" v-if="html">
        <n-code :code="html" language="html" word-wrap></n-code>
      </n-gi>
      <n-gi :span="1" v-if="css">
        <n-code :code="css" language="css" word-wrap></n-code>
      </n-gi>
      <n-gi :span="1" v-if="js">
        <n-code :code="js" language="javascript" word-wrap></n-code>
      </n-gi>
    </n-grid>
  </n-modal>
</template>
<script setup lang="ts">
import { NButton, type DataTableColumn } from "naive-ui"
import { computed, h, onMounted, onUnmounted, reactive, ref, watch } from "vue"
import { Submission } from "../api"
import type { SubmissionOut } from "../utils/type"
import { parseTime } from "../utils/helper"
import TaskTitle from "../components/submissions/TaskTitle.vue"
import Preview from "../components/Preview.vue"
import { submission } from "../store/submission"

const data = ref<SubmissionOut[]>([])
const count = ref(0)
const query = reactive({
  page: 1,
})

const html = computed(() => submission.value.html)
const css = computed(() => submission.value.css)
const js = computed(() => submission.value.js)

const codeCount = computed(
  () => [html.value, css.value, js.value].filter((c) => !!c).length,
)

const codeModal = ref(false)

const columns: DataTableColumn<SubmissionOut>[] = [
  {
    title: "时间",
    key: "created",
    render: (row) => parseTime(row.created, "YYYY-MM-DD HH:mm:ss"),
  },
  {
    title: "提交者",
    key: "user",
    render: (row) => row.username,
  },
  {
    title: "任务",
    key: "task_title",
    render: (submission) => h(TaskTitle, { submission }),
  },
  {
    title: "我打的分",
    key: "my_score",
    render: (row) => {
      if (row.my_score > 0) return row.my_score
      else return "-"
    },
  },
  {
    title: "平均得分",
    key: "score",
    render: (row) => {
      if (row.score > 0) return row.score.toFixed(2)
      else return "-"
    },
  },
  {
    title: "效果",
    key: "code",
    render: (row) =>
      h(
        NButton,
        { quaternary: true, onClick: () => getSubmissionByID(row.id) },
        () => "查看",
      ),
  },
]

async function init() {
  const res = await Submission.list(query)
  data.value = res.items
  count.value = res.count
}

async function getSubmissionByID(id: string) {
  submission.value = await Submission.get(id)
}

function afterScore() {
  data.value = data.value.map((d) => {
    if (d.id === submission.value.id) {
      d.my_score = submission.value.my_score
    }
    return d
  })
}

watch(() => query.page, init)
onMounted(init)
onUnmounted(() => {
  submission.value = {
    id: "",
    userid: 0,
    username: "",
    task_title: "",
    task_type: "tutorial",
    score: 0,
    my_score: 0,
    html: "",
    css: "",
    js: "",
    created: new Date(),
    modified: new Date(),
  }
})
</script>
<style scoped>
.container {
  padding: 10px;
  box-sizing: border-box;
}
</style>
