<template>
  <n-modal
    :show="show"
    preset="card"
    title="提示词"
    style="width: 90vw; max-width: 1400px"
    @update:show="$emit('update:show', $event)"
  >
    <n-spin :show="loading">
      <n-empty
        v-if="!loading && rounds.length === 0"
        description="暂无对话记录"
      />
      <div
        v-else
        style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          height: 75vh;
        "
      >
        <div
          style="
            overflow-y: auto;
            padding-right: 8px;
            border-right: 1px solid #e0e0e0;
            display: flex;
            flex-direction: column;
            gap: 8px;
          "
        >
          <div
            v-for="(round, index) in rounds"
            :key="index"
            style="
              display: flex;
              gap: 10px;
              align-items: flex-start;
              cursor: pointer;
            "
            @click="selectedRound = index"
          >
            <div
              :style="{
                flexShrink: 0,
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: selectedRound === index ? '#2080f0' : '#c2d5fb',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '2px',
                transition: 'background 0.2s',
              }"
            >
              {{ index + 1 }}
            </div>
            <div
              :style="{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                background: selectedRound === index ? '#e8f0fe' : '#f5f5f5',
                border:
                  selectedRound === index
                    ? '1px solid #2080f0'
                    : '1px solid #e0e0e0',
                fontSize: '13px',
                lineHeight: '1.6',
                transition: 'all 0.2s',
              }"
            >
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  gap: 8px;
                "
              >
                <span>{{ round.question }}</span>
                <span
                  v-if="round.prompt_level"
                  :style="{
                    flexShrink: 0,
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: levelColors[round.prompt_level],
                    marginTop: '2px',
                  }"
                  >L{{ round.prompt_level }}</span
                >
              </div>
            </div>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px">
          <div style="font-weight: bold; font-size: 13px; color: #555">
            第 {{ selectedRound + 1 }} 轮网页
          </div>
          <iframe
            v-if="selectedPageHtml"
            :srcdoc="selectedPageHtml"
            :key="selectedRound"
            sandbox="allow-scripts"
            style="
              flex: 1;
              border: 1px solid #e0e0e0;
              border-radius: 6px;
              background: #fff;
            "
          />
          <n-empty v-else description="该轮无网页代码" style="margin: auto" />
        </div>
      </div>
    </n-spin>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { Prompt } from "../../api"
import type { PromptMessage } from "../../utils/type"

const props = defineProps<{
  show: boolean
  conversationId?: string
}>()

defineEmits<{ "update:show": [value: boolean] }>()

const loading = ref(false)
const messages = ref<PromptMessage[]>([])
const selectedRound = ref(0)

const rounds = computed(() => {
  const result: {
    question: string
    prompt_level: number | null
    html: string | null
    css: string | null
    js: string | null
  }[] = []
  for (const [i, msg] of messages.value.entries()) {
    if (msg.role !== "user") continue
    let html: string | null = null,
      css: string | null = null,
      js: string | null = null
    for (const reply of messages.value.slice(i + 1)) {
      if (reply.role === "user") break
      if (reply.role === "assistant" && reply.code_html) {
        html = reply.code_html
        css = reply.code_css
        js = reply.code_js
        break
      }
    }
    result.push({
      question: msg.content,
      prompt_level: msg.prompt_level ?? null,
      html,
      css,
      js,
    })
  }
  return result
})

const levelColors: Record<number, string> = {
  1: "#aaa",
  2: "#6aab9c",
  3: "#4a9ade",
  4: "#c47ab8",
  5: "#e0a040",
  6: "#e05c5c",
}

const selectedPageHtml = computed(() => {
  const round = rounds.value[selectedRound.value]
  if (!round?.html) return null
  const style = round.css ? `<style>${round.css}</style>` : ""
  const script = round.js ? `<script>${round.js}<\/script>` : ""
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${style}</head><body>${round.html}${script}</body></html>`
})

watch(
  () => props.conversationId,
  async (id) => {
    if (!id || !props.show) return
    loading.value = true
    messages.value = []
    selectedRound.value = 0
    try {
      messages.value = await Prompt.getMessages(id)
      const last = rounds.value.length - 1
      if (last >= 0) selectedRound.value = last
    } finally {
      loading.value = false
    }
  },
)

watch(
  () => props.show,
  async (visible) => {
    if (!visible || !props.conversationId) return
    loading.value = true
    messages.value = []
    selectedRound.value = 0
    try {
      messages.value = await Prompt.getMessages(props.conversationId)
      const last = rounds.value.length - 1
      if (last >= 0) selectedRound.value = last
    } finally {
      loading.value = false
    }
  },
)
</script>
