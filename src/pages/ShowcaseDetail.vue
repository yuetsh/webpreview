<template>
  <main v-if="detail" class="detail-layout">
    <section class="preview-panel">
      <div class="back-bar">
        <n-button text @click="router.back()">
          <template #icon>
            <Icon icon="lucide:arrow-left" />
          </template>
          返回创意工坊
        </n-button>
      </div>
      <iframe
        v-if="detailSrcdoc"
        :srcdoc="detailSrcdoc"
        class="preview-iframe"
        sandbox="allow-scripts"
      />
    </section>

    <aside class="info-panel">
      <n-flex vertical :size="0">
        <n-h3 style="margin: 0 0 4px;">{{ detail.task_title }}</n-h3>
        <n-text depth="3">{{ detail.username }}</n-text>
        <n-flex wrap :size="8" style="margin-top: 12px;">
          <n-tag
            v-for="award in detail.awards"
            :key="award"
            type="warning"
            size="small"
          >
            {{ award }}
          </n-tag>
        </n-flex>
        <n-flex :size="18" style="margin-top: 14px;">
          <n-flex align="center" :size="6">
            <Icon icon="lucide:star" :width="16" />
            <n-text strong style="font-size: 14px;">
              {{ detail.score.toFixed(1) }}
            </n-text>
          </n-flex>
          <n-flex align="center" :size="6">
            <Icon icon="lucide:eye" :width="16" />
            <n-text strong style="font-size: 14px;">
              {{ detail.view_count }}
            </n-text>
          </n-flex>
        </n-flex>
      </n-flex>

      <n-divider v-if="detail.has_prompt_chain" />

      <n-collapse
        v-if="detail.has_prompt_chain"
        @update:expanded-names="onCollapseChange"
      >
        <n-collapse-item title="创作过程" name="chain">
          <template #header-extra>
            <n-text depth="3" style="font-size: 12px;">点击展开</n-text>
          </template>
          <n-spin :show="chainLoading">
            <n-empty
              v-if="!chainLoading && rounds.length === 0"
              description="暂无记录"
            />
            <n-flex v-else vertical :size="12">
              <n-scrollbar style="max-height: 260px;">
                <n-flex vertical :size="8" style="padding-right: 4px;">
                  <n-card
                    v-for="(round, i) in rounds"
                    :key="i"
                    size="small"
                    content-style="padding: 8px;"
                    :style="{
                      cursor: 'pointer',
                      borderColor: selectedRound === i ? '#2080f0' : undefined,
                      background: selectedRound === i ? '#e8f0fe' : undefined,
                    }"
                    @click="selectedRound = i"
                  >
                    <n-flex align="flex-start" :size="8">
                      <n-avatar
                        round
                        :size="20"
                        :color="selectedRound === i ? '#2080f0' : '#9db7e8'"
                        style="font-size: 11px; font-weight: 700; flex-shrink: 0;"
                      >
                        {{ i + 1 }}
                      </n-avatar>
                      <n-flex vertical :size="4" style="min-width: 0; flex: 1;">
                        <n-text style="font-size: 12px; line-height: 1.5;">
                          {{ round.question }}
                        </n-text>
                        <n-flex :size="5">
                          <n-tag size="small" style="font-size: 10px;">
                            {{ round.source === "conversation" ? "对话" : "手动" }}
                          </n-tag>
                          <n-text
                            v-if="round.prompt_level"
                            :style="{
                              color: levelColors[round.prompt_level],
                              fontSize: '11px',
                              fontWeight: 700,
                            }"
                          >
                            L{{ round.prompt_level }}
                          </n-text>
                        </n-flex>
                      </n-flex>
                    </n-flex>
                  </n-card>
                </n-flex>
              </n-scrollbar>

              <n-flex vertical :size="8">
                <n-text strong style="font-size: 12px; color: #555;">
                  第 {{ selectedRound + 1 }} 轮效果
                </n-text>
                <iframe
                  v-if="selectedRoundSrcdoc"
                  :key="selectedRound"
                  :srcdoc="selectedRoundSrcdoc"
                  sandbox="allow-scripts"
                  class="round-iframe"
                />
                <n-flex
                  v-else
                  justify="center"
                  align="center"
                  style="min-height: 240px;"
                >
                  <n-empty description="该轮无网页代码" />
                </n-flex>
              </n-flex>
            </n-flex>
          </n-spin>
        </n-collapse-item>
      </n-collapse>
    </aside>
  </main>

  <n-flex
    v-else-if="notFound"
    justify="center"
    align="center"
    style="min-height: 100vh; padding: 40px;"
  >
    <n-empty description="作品不存在" />
  </n-flex>

  <n-flex v-else justify="center" align="center" style="min-height: 100vh;">
    <n-spin />
  </n-flex>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { Icon } from "@iconify/vue"
import { Showcase, Submission } from "../api"
import type { PromptRound, ShowcaseDetail } from "../utils/type"

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const detail = ref<ShowcaseDetail | null>(null)
const notFound = ref(false)
const rounds = ref<PromptRound[]>([])
const chainLoading = ref(false)
const selectedRound = ref(0)
const chainLoaded = ref(false)

const levelColors: Record<number, string> = {
  1: "#888",
  2: "#4f8f7f",
  3: "#2f7bc1",
  4: "#aa5f9f",
  5: "#c48620",
  6: "#c94f4f",
}

const detailSrcdoc = computed(() => {
  if (!detail.value) return null
  return buildDetailHtml(detail.value)
})

const selectedRoundSrcdoc = computed(() => {
  const round = rounds.value[selectedRound.value]
  if (!round?.html) return null
  const style = round.css ? `<style>${round.css}</style>` : ""
  const script = round.js ? `<script>${round.js}<\/script>` : ""
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/normalize.min.css" />${style}</head><body>${round.html}${script}</body></html>`
})

function buildDetailHtml(d: ShowcaseDetail) {
  const css = d.css ? `<style>${d.css}</style>` : ""
  const js = d.js ? `<script>${d.js}<\/script>` : ""
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/normalize.min.css" />${css}</head><body>${d.html ?? ""}${js}</body></html>`
}

async function loadChain() {
  if (chainLoaded.value) return
  chainLoading.value = true
  try {
    rounds.value = await Showcase.getPromptChain(props.id)
    selectedRound.value = Math.max(0, rounds.value.length - 1)
    chainLoaded.value = true
  } finally {
    chainLoading.value = false
  }
}

function onCollapseChange(
  names: string | number | Array<string | number> | null,
) {
  const expanded = Array.isArray(names) ? names : names == null ? [] : [names]
  if (expanded.includes("chain")) void loadChain()
}

async function init() {
  try {
    detail.value = await Showcase.getDetail(props.id)
    void Submission.incrementView(props.id)
  } catch {
    notFound.value = true
  }
}

onMounted(init)
</script>

<style scoped>
.detail-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #fff;
}

.preview-panel {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  border-right: 1px solid #e6e6e6;
}

.back-bar {
  flex-shrink: 0;
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.preview-iframe {
  width: 100%;
  flex: 1;
  border: none;
}

.info-panel {
  width: 360px;
  flex-shrink: 0;
  padding: 20px 16px;
  overflow-y: auto;
}

.round-iframe {
  min-height: 240px;
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #fff;
}

@media (max-width: 760px) {
  .detail-layout {
    height: auto;
    min-height: 100vh;
    flex-direction: column;
    overflow: visible;
  }

  .preview-panel {
    min-height: 56vh;
    border-right: none;
    border-bottom: 1px solid #e6e6e6;
  }

  .info-panel {
    width: auto;
  }
}
</style>
