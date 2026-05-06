<template>
  <div class="history-panel">
    <n-flex
      class="history-toolbar"
      align="center"
      justify="space-between"
      :wrap="false"
    >
      <n-text depth="3">共 {{ items.length }} 条历史对话</n-text>
      <n-tooltip>
        <template #trigger>
          <n-button
            quaternary
            circle
            size="small"
            :loading="loading"
            aria-label="刷新历史对话"
            @click="load(true)"
          >
            <template #icon>
              <Icon icon="lucide:refresh-cw" />
            </template>
          </n-button>
        </template>
        刷新历史对话
      </n-tooltip>
    </n-flex>

    <n-spin v-if="loading" class="state" />
    <n-empty
      v-else-if="!items.length"
      class="state"
      description="暂无历史对话"
    />
    <n-scrollbar v-else class="history-scrollbar">
      <n-flex vertical :size="12" class="history-list">
        <n-card
          v-for="(item, index) in items"
          :key="item.assistant_message_id"
          class="history-card"
          :class="{
            'is-selected':
              selectedAssistantMessageId === item.assistant_message_id,
          }"
          size="small"
          :bordered="true"
          hoverable
          :embedded="selectedAssistantMessageId === item.assistant_message_id"
          :content-style="{ padding: 0 }"
          @click="selectItem(item)"
        >
          <n-flex
            class="history-main"
            align="center"
            justify="space-between"
            :wrap="false"
          >
            <n-flex align="center" :wrap="false" :size="6">
              <n-tag
                round
                size="small"
                :bordered="false"
                :type="
                  selectedAssistantMessageId === item.assistant_message_id
                    ? 'success'
                    : 'default'
                "
              >
                #{{ index + 1 }}
              </n-tag>
              <n-tag
                size="small"
                :type="item.source === 'manual' ? 'info' : 'success'"
              >
                {{ item.source === "manual" ? "手动提交" : "AI 对话" }}
              </n-tag>
            </n-flex>
            <n-tag
              v-if="selectedAssistantMessageId === item.assistant_message_id"
              size="small"
              type="success"
              :bordered="false"
            >
              正在预览
            </n-tag>
            <n-text depth="3">
              {{ parseTime(item.created, "YYYY-MM-DD HH:mm") }}
            </n-text>
          </n-flex>
          <div
            class="prompt-markdown markdown-body"
            v-html="renderMarkdown(item.prompt)"
          />
          <div class="thumbnail" aria-label="页面缩略图">
            <iframe
              v-if="item.hasPage"
              title="页面缩略图"
              loading="lazy"
              sandbox="allow-scripts"
              referrerpolicy="no-referrer"
              tabindex="-1"
              :srcdoc="item.previewDoc"
            />
            <n-empty v-else size="small" description="未生成页面" />
          </div>
        </n-card>
      </n-flex>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import { Icon } from "@iconify/vue"
import { marked } from "marked"
import { Prompt } from "../../api"
import type { PromptHistoryItem } from "../../utils/type"
import { parseTime } from "../../utils/helper"
import { buildPreviewDocument } from "../../utils/previewDocument"

const props = defineProps<{
  taskId: number
  active: boolean
  assetBaseUrl?: string
  refreshKey?: number
}>()

const emit = defineEmits<{
  select: [code: { html: string; css: string; js: string }]
}>()

type HistoryViewItem = PromptHistoryItem & {
  hasPage: boolean
  previewDoc: string
}

const items = ref<HistoryViewItem[]>([])
const loading = ref(false)
const selectedAssistantMessageId = ref<number | null>(null)
let loadedTaskId = 0

function toViewItem(item: PromptHistoryItem): HistoryViewItem {
  const html = item.code_html ?? ""
  const css = item.code_css ?? ""
  const js = item.code_js ?? ""
  return {
    ...item,
    hasPage: !!(html.trim() || css.trim() || js.trim()),
    previewDoc: buildPreviewDocument({
      html,
      css,
      js,
      assetBaseUrl: props.assetBaseUrl,
    }),
  }
}

function renderMarkdown(text: string): string {
  return marked.parse(text) as string
}

function selectItem(item: HistoryViewItem) {
  selectedAssistantMessageId.value = item.assistant_message_id
  emit("select", {
    html: item.code_html ?? "",
    css: item.code_css ?? "",
    js: item.code_js ?? "",
  })
}

async function load(force = true) {
  if (!props.taskId || loading.value) return
  if (!force && loadedTaskId === props.taskId) return
  loading.value = true
  try {
    const taskChanged = loadedTaskId !== props.taskId
    const data = await Prompt.listHistory(props.taskId)
    items.value = data.map(toViewItem)
    if (
      taskChanged ||
      !items.value.some(
        (item) =>
          item.assistant_message_id === selectedAssistantMessageId.value,
      )
    ) {
      selectedAssistantMessageId.value = null
    }
    loadedTaskId = props.taskId
  } finally {
    loading.value = false
  }
}

watch(
  () => [props.active, props.taskId] as const,
  ([active]) => {
    if (active) load(false)
  },
)

watch(
  () => props.refreshKey,
  () => {
    if (props.active) load(true)
  },
)

onMounted(() => {
  if (props.active) load(false)
})
</script>

<style scoped>
.history-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.history-toolbar {
  height: 42px;
  padding: 0 12px;
  border-bottom: 1px solid var(--n-border-color, #efeff5);
  flex-shrink: 0;
}

.state {
  margin: auto;
}

.history-scrollbar {
  flex: 1;
  min-height: 0;
}

.history-list {
  padding: 12px;
}

.history-card {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.history-card.is-selected {
  --n-border-color: #18a058;
  border-color: #18a058;
  box-shadow:
    0 0 0 2px rgba(24, 160, 88, 0.35),
    0 12px 26px rgba(24, 160, 88, 0.24);
  transform: translateY(-1px);
}

.history-card.is-selected::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: #18a058;
  z-index: 1;
}

.history-main {
  padding: 10px 12px;
}

.prompt-markdown {
  margin: 0;
  padding: 0 12px 12px;
  color: #333;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
  background: transparent;
}

.prompt-markdown :deep(p),
.prompt-markdown :deep(ul),
.prompt-markdown :deep(ol),
.prompt-markdown :deep(blockquote),
.prompt-markdown :deep(pre) {
  margin-top: 0;
  margin-bottom: 6px;
}

.prompt-markdown :deep(:last-child) {
  margin-bottom: 0;
}

.prompt-markdown :deep(pre) {
  padding: 8px;
  overflow-x: auto;
  font-size: 12px;
}

.prompt-markdown :deep(code) {
  white-space: pre-wrap;
  word-break: break-word;
}

.thumbnail {
  height: 160px;
  border-top: 1px solid var(--n-border-color, #efeff5);
  background: #f7f7f9;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail iframe {
  width: 100%;
  height: 100%;
  border: 0;
  background: #fff;
  pointer-events: none;
}
</style>
