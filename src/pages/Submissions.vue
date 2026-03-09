<template>
  <n-grid class="container" x-gap="10" :cols="2">
    <n-gi :span="1">
      <n-flex vertical>
        <n-flex justify="space-between">
          <n-button secondary @click="() => goHome($router, taskTab, step)">
            返回首页
          </n-button>
          <n-flex align="center">
            <n-select
              v-model:value="query.flag"
              style="width: 100px"
              clearable
              placeholder="标记"
              :options="[
                { label: '红旗', value: 'red' },
                { label: '蓝旗', value: 'blue' },
                { label: '绿旗', value: 'green' },
                { label: '黄旗', value: 'yellow' },
              ]"
            />
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
        <n-data-table
          striped
          :columns="columns"
          :data="data"
          :row-props="rowProps"
          :row-class-name="rowClassName"
        ></n-data-table>
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
  <n-modal v-model:show="chainModal" preset="card" title="提示词" style="width: 90vw; max-width: 1400px">
    <n-spin :show="chainLoading">
      <n-empty v-if="!chainLoading && chainRounds.length === 0" description="暂无对话记录" />
      <div v-else style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; height: 75vh">
        <!-- 左侧：学生提问列表 -->
        <div style="overflow-y: auto; padding-right: 8px; border-right: 1px solid #e0e0e0; display: flex; flex-direction: column; gap: 8px">
          <div
            v-for="(round, index) in chainRounds"
            :key="index"
            style="display: flex; gap: 10px; align-items: flex-start; cursor: pointer"
            @click="selectedRound = index"
          >
            <div :style="{
              flexShrink: 0, width: '22px', height: '22px', borderRadius: '50%',
              background: selectedRound === index ? '#2080f0' : '#c2d5fb',
              color: '#fff', fontSize: '12px', fontWeight: 'bold',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px',
              transition: 'background 0.2s',
            }">
              {{ index + 1 }}
            </div>
            <div :style="{
              flex: 1, padding: '10px 14px', borderRadius: '8px',
              background: selectedRound === index ? '#e8f0fe' : '#f5f5f5',
              border: selectedRound === index ? '1px solid #2080f0' : '1px solid #e0e0e0',
              fontSize: '13px', lineHeight: '1.6', transition: 'all 0.2s',
            }">
              {{ round.question }}
            </div>
          </div>
        </div>
        <!-- 右侧：对应网页预览 -->
        <div style="display: flex; flex-direction: column; gap: 8px">
          <div style="font-weight: bold; font-size: 13px; color: #555">
            第 {{ selectedRound + 1 }} 轮网页
          </div>
          <iframe
            v-if="selectedPageHtml"
            :srcdoc="selectedPageHtml"
            :key="selectedRound"
            sandbox="allow-scripts"
            style="flex: 1; border: 1px solid #e0e0e0; border-radius: 6px; background: #fff"
          />
          <n-empty v-else description="该轮无网页代码" style="margin: auto" />
        </div>
      </div>
    </n-spin>
  </n-modal>
</template>
<script setup lang="ts">
import { NButton, NPopover, NSpace, type DataTableColumn } from "naive-ui"
import { computed, h, onMounted, onUnmounted, reactive, ref, watch } from "vue"
import { Submission, Prompt } from "../api"
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
import { roleAdmin, roleSuper } from "../store/user"
import type { FlagType } from "../utils/type"

const route = useRoute()
const router = useRouter()

const data = ref<SubmissionOut[]>([])
const count = ref(0)
const query = reactive({
  page: Number(route.params.page),
  username: route.query.username ?? "",
  flag: null as string | null,
})

const html = computed(() => submission.value.html)
const css = computed(() => submission.value.css)
const js = computed(() => submission.value.js)

const codeModal = ref(false)
const chainModal = ref(false)
const chainMessages = ref<{ id: number; role: string; content: string; code_html: string | null; code_css: string | null; code_js: string | null }[]>([])
const chainLoading = ref(false)
const selectedRound = ref(0)

const FLAG_OPTIONS: { value: FlagType; color: string; label: string }[] = [
  { value: "red", color: "#e03030", label: "值得展示" },
  { value: "blue", color: "#2080f0", label: "需要讲解" },
  { value: "green", color: "#18a058", label: "优秀作品" },
  { value: "yellow", color: "#f0a020", label: "需要改进" },
]

const isAdmin = computed(() => roleAdmin.value || roleSuper.value)

const chainRounds = computed(() => {
  const messages = chainMessages.value
  const rounds: { question: string; html: string | null; css: string | null; js: string | null }[] = []
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].role !== "user") continue
    let html = null, css = null, js = null
    for (let j = i + 1; j < messages.length; j++) {
      if (messages[j].role === "user") break
      if (messages[j].role === "assistant" && messages[j].code_html) {
        html = messages[j].code_html
        css = messages[j].code_css
        js = messages[j].code_js
        break
      }
    }
    rounds.push({ question: messages[i].content, html, css, js })
  }
  return rounds
})

const selectedPageHtml = computed(() => {
  const round = chainRounds.value[selectedRound.value]
  if (!round?.html) return null
  const style = round.css ? `<style>${round.css}</style>` : ""
  const script = round.js ? `<script>${round.js}<\/script>` : ""
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${style}</head><body>${round.html}${script}</body></html>`
})

async function updateFlag(row: SubmissionOut, flag: FlagType) {
  await Submission.updateFlag(row.id, flag)
  row.flag = flag
}

async function showChain(conversationId: string) {
  chainLoading.value = true
  chainModal.value = true
  selectedRound.value = 0
  try {
    chainMessages.value = await Prompt.getMessages(conversationId)
    const last = chainRounds.value.length - 1
    if (last >= 0) selectedRound.value = last
  } finally {
    chainLoading.value = false
  }
}

const columns: DataTableColumn<SubmissionOut>[] = [
  {
    title: "",
    key: "flag",
    width: 50,
    render: (row) => {
      const flagOption = FLAG_OPTIONS.find((f) => f.value === row.flag)
      const flagIcon = h("span", {
        style: {
          display: "inline-block",
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          backgroundColor: flagOption ? flagOption.color : "transparent",
          border: flagOption ? "none" : "1px dashed #ccc",
          cursor: isAdmin.value ? "pointer" : "default",
        },
      })

      if (!isAdmin.value) return flagIcon

      return h(
        NPopover,
        { trigger: "click" },
        {
          trigger: () => flagIcon,
          default: () =>
            h(NSpace, { vertical: true, size: "small" }, () => [
              ...FLAG_OPTIONS.map((opt) =>
                h(
                  NButton,
                  {
                    text: true,
                    onClick: () => updateFlag(row, opt.value),
                  },
                  () =>
                    h("span", { style: { display: "flex", alignItems: "center", gap: "6px" } }, [
                      h("span", {
                        style: {
                          display: "inline-block",
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: opt.color,
                        },
                      }),
                      opt.label,
                    ]),
                ),
              ),
              row.flag
                ? h(
                    NButton,
                    {
                      text: true,
                      block: true,
                      type: "error",
                      onClick: () => updateFlag(row, null),
                    },
                    () => "清除",
                  )
                : null,
            ]),
        },
      )
    },
  },
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
    title: "提示词",
    key: "conversation_id",
    width: 70,
    render: (row) => {
      if (!row.conversation_id) return "-"
      return h(
        NButton,
        { text: true, type: "primary", onClick: () => showChain(row.conversation_id!) },
        () => "查看",
      )
    },
  },
]

function rowProps(row: SubmissionOut) {
  return {
    style: { cursor: "pointer" },
    onClick: () => getSubmissionByID(row.id),
  }
}

function rowClassName(row: SubmissionOut) {
  return submission.value.id === row.id ? "row-active" : ""
}

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
watch(
  () => query.flag,
  () => {
    query.page = 1
    init()
  },
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

:deep(.row-active td) {
  background-color: rgba(24, 160, 80, 0.1) !important;
}
</style>
