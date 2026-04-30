<template>
  <n-modal
    :show="show"
    preset="card"
    style="width: 90vw; max-width: 1400px"
    @update:show="$emit('update:show', $event)"
  >
    <template #header>
      <n-flex justify="start" align="center">
        <span>提示词</span>
        <n-tooltip placement="bottom-start">
          <template #trigger>
            <Icon icon="lucide:info" :width="20" style="color: #aaa" />
          </template>
          <div style="line-height: 2">
            <div>
              <span :style="{ color: levelColors[1], fontWeight: 'bold' }">
                L1
              </span>
              — 记忆：复述或识别知识点
            </div>
            <div>
              <span :style="{ color: levelColors[2], fontWeight: 'bold' }">
                L2
              </span>
              — 理解：用自己的话解释概念
            </div>
            <div>
              <span :style="{ color: levelColors[3], fontWeight: 'bold' }">
                L3
              </span>
              — 应用：将知识用于新情境
            </div>
            <div>
              <span :style="{ color: levelColors[4], fontWeight: 'bold' }">
                L4
              </span>
              — 分析：拆解结构、找出规律
            </div>
            <div>
              <span :style="{ color: levelColors[5], fontWeight: 'bold' }">
                L5
              </span>
              — 评价：基于标准作出判断
            </div>
            <div>
              <span :style="{ color: levelColors[6], fontWeight: 'bold' }">
                L6
              </span>
              — 创造：整合信息产出新成果
            </div>
          </div>
        </n-tooltip>
      </n-flex>
    </template>
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
                <div style="display: flex; flex-direction: row; align-items: center; gap: 4px; flex-shrink: 0">
                  <span
                    v-if="round.source"
                    :style="{
                      fontSize: '10px',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      background: round.source === 'conversation' ? '#e8f0fe' : '#f0f0f0',
                      color: round.source === 'conversation' ? '#2060c0' : '#888',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }"
                  >{{ round.source === "conversation" ? "对话" : "手动" }}</span>
                  <span
                    v-if="round.prompt_level"
                    :style="{
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: levelColors[round.prompt_level],
                    }"
                    >L{{ round.prompt_level }}</span
                  >
                  <n-popconfirm
                    v-if="round.assistantMsgId && canDelete"
                    :show-icon="false"
                    @positive-click="deleteRound(index)"
                  >
                    <template #trigger>
                      <n-button
                        text
                        size="tiny"
                        type="error"
                        style="margin-left: 2px"
                        @click.stop
                      >
                        <Icon icon="lucide:trash-2" :width="12" />
                      </n-button>
                    </template>
                    确定删除这一轮？
                  </n-popconfirm>
                </div>
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
import { NPopconfirm, NButton } from "naive-ui"
import { Icon } from "@iconify/vue"
import { Prompt, Submission } from "../../api"
import type { PromptRound } from "../../utils/type"
import { user, roleSuper } from "../../store/user"

const props = defineProps<{
  show: boolean
  submissionId: string
  username?: string
}>()

const canDelete = computed(() => roleSuper.value || (!!props.username && props.username === user.username))

defineEmits<{ "update:show": [value: boolean] }>()

const loading = ref(false)
const selectedRound = ref(0)
type ChainRound = Omit<PromptRound, "source"> & {
  source: string | null
  assistantMsgId: number | null
}
const rounds = ref<ChainRound[]>([])

async function deleteRound(index: number) {
  const round = rounds.value[index]
  if (!round.assistantMsgId) return
  await Prompt.deleteMessagePair(round.assistantMsgId)
  await loadMessages()
  if (selectedRound.value >= rounds.value.length) {
    selectedRound.value = Math.max(0, rounds.value.length - 1)
  }
}

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

async function loadMessages() {
  if (!props.submissionId) return
  loading.value = true
  rounds.value = []
  selectedRound.value = 0
  try {
    const data = await Submission.getPromptChain(props.submissionId)
    rounds.value = data.map((round) => ({
      ...round,
      source: round.source ?? null,
      assistantMsgId: round.assistant_msg_id ?? null,
    }))
    const last = rounds.value.length - 1
    if (last >= 0) selectedRound.value = last
  } catch {
    rounds.value = []
  } finally {
    loading.value = false
  }
}

watch(
  () => [props.show, props.submissionId] as const,
  ([visible]) => {
    if (visible) loadMessages()
  },
)
</script>
