<template>
  <main v-if="detail" class="detail-layout">
    <section class="preview-panel">
      <div class="back-bar">
        <n-button text @click="router.push({ name: 'showcase' })">
          <template #icon>
            <Icon icon="lucide:arrow-left" />
          </template>
          返回创意工坊
        </n-button>
      </div>
      <iframe ref="iframe" class="preview-iframe" sandbox="allow-scripts" />
    </section>

    <aside class="info-panel">
      <div class="meta">
        <n-h3 class="detail-title">{{ detail.task_title }}</n-h3>
        <n-text depth="3">{{ detail.username }}</n-text>

        <n-flex class="award-row" wrap>
          <n-tag
            v-for="award in detail.awards"
            :key="award"
            type="warning"
            size="small"
          >
            {{ award }}
          </n-tag>
        </n-flex>

        <div class="stat-row">
          <div class="stat-item">
            <Icon icon="lucide:star" :width="16" />
            <span>{{ detail.score.toFixed(1) }}</span>
          </div>
          <div class="stat-item">
            <Icon icon="lucide:eye" :width="16" />
            <span>{{ detail.view_count }}</span>
          </div>
        </div>
      </div>

      <n-divider v-if="detail.has_prompt_chain" />

      <n-collapse
        v-if="detail.has_prompt_chain"
        @update:expanded-names="onCollapseChange"
      >
        <n-collapse-item title="创作过程" name="chain">
          <template #header-extra>
            <n-text depth="3" class="collapse-extra">点击展开</n-text>
          </template>
          <n-spin :show="chainLoading">
            <n-empty
              v-if="!chainLoading && rounds.length === 0"
              description="暂无记录"
            />
            <div v-else class="chain-layout">
              <div class="round-list">
                <button
                  v-for="(round, i) in rounds"
                  :key="i"
                  class="round-item"
                  :class="{ active: selectedRound === i }"
                  type="button"
                  @click="selectedRound = i"
                >
                  <span class="round-index">{{ i + 1 }}</span>
                  <span class="round-content">
                    <span class="round-text">{{ round.question }}</span>
                    <span class="round-tags">
                      <span class="tag-source">
                        {{ round.source === "conversation" ? "对话" : "手动" }}
                      </span>
                      <span
                        v-if="round.prompt_level"
                        class="tag-level"
                        :style="{ color: levelColors[round.prompt_level] }"
                      >
                        L{{ round.prompt_level }}
                      </span>
                    </span>
                  </span>
                </button>
              </div>
              <div class="round-preview">
                <div class="round-preview-label">
                  第 {{ selectedRound + 1 }} 轮效果
                </div>
                <iframe
                  v-if="selectedRoundSrcdoc"
                  :key="selectedRound"
                  :srcdoc="selectedRoundSrcdoc"
                  sandbox="allow-scripts"
                  class="round-iframe"
                />
                <n-empty
                  v-else
                  description="该轮无网页代码"
                  class="round-empty"
                />
              </div>
            </div>
          </n-spin>
        </n-collapse-item>
      </n-collapse>
    </aside>
  </main>

  <div v-else-if="notFound" class="state">
    <n-empty description="作品不存在" />
  </div>

  <div v-else class="state">
    <n-spin />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from "vue"
import { useRouter } from "vue-router"
import { Icon } from "@iconify/vue"
import { Showcase } from "../api"
import type { PromptRound, ShowcaseDetail } from "../utils/type"

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const iframe = useTemplateRef<HTMLIFrameElement>("iframe")
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

function renderPreview() {
  if (!iframe.value || !detail.value) return
  const doc = iframe.value.contentDocument
  if (!doc) return
  doc.open()
  doc.write(buildDetailHtml(detail.value))
  doc.close()
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
    await nextTick()
    renderPreview()
  } catch {
    notFound.value = true
  }
}

watch(
  () => detail.value,
  (value) => {
    if (value) renderPreview()
  },
)

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

.meta {
  display: flex;
  flex-direction: column;
}

.detail-title {
  margin: 0 0 4px;
}

.award-row {
  gap: 8px;
  margin-top: 12px;
}

.stat-row {
  display: flex;
  gap: 18px;
  margin-top: 14px;
}

.stat-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #333;
  font-size: 14px;
  font-weight: 600;
}

.collapse-extra {
  font-size: 12px;
}

.chain-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
}

.round-list {
  display: flex;
  max-height: 260px;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.round-item {
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #f9fafb;
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-align: left;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.round-item.active {
  border-color: #2080f0;
  background: #e8f0fe;
}

.round-index {
  display: flex;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #9db7e8;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}

.round-item.active .round-index {
  background: #2080f0;
}

.round-content {
  min-width: 0;
}

.round-text {
  display: block;
  color: #333;
  font-size: 12px;
  line-height: 1.5;
}

.round-tags {
  display: flex;
  gap: 5px;
  margin-top: 5px;
}

.tag-source {
  border-radius: 4px;
  background: #eef1f4;
  color: #666;
  font-size: 10px;
  line-height: 1.5;
  padding: 1px 5px;
}

.tag-level {
  font-size: 11px;
  font-weight: 700;
}

.round-preview {
  display: flex;
  min-height: 260px;
  flex-direction: column;
  gap: 8px;
}

.round-preview-label {
  color: #555;
  font-size: 12px;
  font-weight: 700;
}

.round-iframe {
  min-height: 240px;
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #fff;
}

.round-empty {
  margin: auto;
}

.state {
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 40px;
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
