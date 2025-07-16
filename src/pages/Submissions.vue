<template>
  <n-grid class="container" x-gap="10" :cols="2">
    <n-gi :span="1">
      <n-flex vertical>
        <n-flex justify="space-between">
          <n-button secondary @click="() => goHome($router, taskTab, step)">
            返回首页
          </n-button>
          <n-flex align="center">
            <div>
              <n-input
                style="width: 120px"
                v-model:value="query.username"
                clearable
              />
            </div>
            <n-pagination
              v-model:page="query.page"
              :page-size="10"
              :item-count="count"
              simple
            >
            </n-pagination>
          </n-flex>
        </n-flex>
        <n-data-table striped :columns="columns" :data="data"></n-data-table>
      </n-flex>
    </n-gi>
    <n-gi :span="1">
      <Preview
        v-if="submission.id"
        :html="html"
        :css="css"
        :js="js"
        :submission-id="submission.id"
        @after-score="afterScore"
        @show-code="codeModal = true"
      />
    </n-gi>
  </n-grid>
  <n-modal preset="card" v-model:show="codeModal" style="max-width: 60%">
    <template #header>
      <n-flex align="center">
        <span>前端代码</span>
        <n-button tertiary @click="copyToEditor">复制到编辑框</n-button>
      </n-flex>
    </template>
    <n-tabs animated type="segment">
      <n-tab-pane name="html" tab="html">
        <n-code :code="html" language="html" word-wrap></n-code>
      </n-tab-pane>
      <n-tab-pane name="css" tab="css">
        <n-code :code="css" language="css" word-wrap></n-code>
      </n-tab-pane>
      <n-tab-pane v-if="!!js" name="js" tab="js">
        <n-code :code="js" language="js" word-wrap></n-code>
      </n-tab-pane>
    </n-tabs>
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
import { useRouter, useRoute } from "vue-router"
import { watchDebounced } from "@vueuse/core"
import { taskTab } from "../store/task"
import { step } from "../store/tutorial"
import { html as eHtml, css as eCss, js as eJs } from "../store/editors"
import { TASK_TYPE } from "../utils/const"
import { goHome } from "../utils/helper"

const route = useRoute()
const router = useRouter()

const data = ref<SubmissionOut[]>([])
const count = ref(0)
const query = reactive({
  page: Number(route.params.page),
  username: route.query.username ?? "",
})

const html = computed(() => submission.value.html)
const css = computed(() => submission.value.css)
const js = computed(() => submission.value.js)

const codeModal = ref(false)

const columns: DataTableColumn<SubmissionOut>[] = [
  {
    title: "时间",
    key: "created",
    width: 110,
    render: (row) => parseTime(row.created, "YYYY-MM-DD HH:mm:ss"),
  },
  {
    title: "提交者",
    key: "user",
    width: 80,
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
        {
          quaternary: submission.value.id !== row.id,
          type: submission.value.id === row.id ? "primary" : "default",
          onClick: () => getSubmissionByID(row.id),
        },
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

function copyToEditor() {
  eHtml.value = html.value
  eCss.value = css.value
  eJs.value = js.value
  goHome(router, submission.value.task_type, submission.value.task_display)
}

watch(
  () => query.page,
  (v) => {
    init()
    router.push({ params: { page: v } })
  },
)
watchDebounced(
  () => query.username,
  () => {
    query.page = 1
    init()
  },
  { debounce: 500, maxWait: 1000 },
)
onMounted(init)
onUnmounted(() => {
  submission.value = {
    id: "",
    userid: 0,
    username: "",
    task_id: 0,
    task_display: 0,
    task_title: "",
    task_type: TASK_TYPE.Tutorial,
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
  height: calc(100% - 43px);
}
</style>
