<template>
  <main class="showcase">
    <header class="header">
      <div>
        <n-h2 class="title">作品广场</n-h2>
        <n-text depth="3">优秀作品展示</n-text>
      </div>
    </header>

    <n-spin :show="loading">
      <n-empty
        v-if="!loading && awards.length === 0"
        description="暂无展示作品"
        class="empty"
      />

      <section
        v-for="section in awards"
        :key="section.id"
        class="award-section"
      >
        <div class="section-header">
          <n-h3 class="section-title">{{ section.name }}</n-h3>
          <n-text v-if="section.description" depth="3" class="section-desc">
            {{ section.description }}
          </n-text>
        </div>

        <div class="card-grid">
          <article
            v-for="item in section.items"
            :key="item.submission_id"
            class="work-card"
            @click="openDetail(item.submission_id)"
          >
            <div class="card-preview">
              <iframe
                :srcdoc="buildSrcdoc(item)"
                sandbox="allow-scripts"
                scrolling="no"
                class="preview-iframe"
              />
              <div class="preview-overlay" />
            </div>
            <div class="card-info">
              <n-flex justify="space-between" align="center" :wrap="false">
                <n-text strong class="username">{{ item.username }}</n-text>
                <n-flex align="center" :wrap="false" class="metric-row">
                  <span class="metric">
                    <Icon icon="lucide:star" :width="13" />
                    {{ item.score.toFixed(1) }}
                  </span>
                  <span class="metric">
                    <Icon icon="lucide:eye" :width="13" />
                    {{ item.view_count }}
                  </span>
                </n-flex>
              </n-flex>
              <n-text depth="3" class="task-title">
                {{ item.task_title }}
              </n-text>
            </div>
          </article>
        </div>
      </section>
    </n-spin>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { Icon } from "@iconify/vue"
import { Showcase } from "../api"
import type { AwardSection, ShowcaseItem } from "../utils/type"

const router = useRouter()
const loading = ref(true)
const awards = ref<AwardSection[]>([])

function buildSrcdoc(item: ShowcaseItem): string {
  const css = item.css ? `<style>${item.css}</style>` : ""
  const js = item.js ? `<script>${item.js}<\/script>` : ""
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/normalize.min.css" />${css}</head><body>${item.html ?? ""}${js}</body></html>`
}

function openDetail(id: string) {
  router.push({ name: "showcase-detail", params: { id } })
}

async function init() {
  try {
    awards.value = await Showcase.list()
  } finally {
    loading.value = false
  }
}

onMounted(init)
</script>

<style scoped>
.showcase {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 20px 48px;
}

.header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 32px;
}

.title {
  margin: 0 0 4px;
}

.empty {
  margin-top: 72px;
}

.award-section {
  margin-bottom: 48px;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
}

.section-title {
  margin: 0;
}

.section-desc {
  font-size: 13px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.work-card {
  overflow: hidden;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease;
}

.work-card:hover {
  border-color: #c9dcff;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
  transform: translateY(-2px);
}

.card-preview {
  position: relative;
  height: 160px;
  overflow: hidden;
  background: #f7f8fa;
}

.preview-iframe {
  width: 200%;
  height: 200%;
  border: none;
  transform: scale(0.5);
  transform-origin: top left;
  pointer-events: none;
}

.preview-overlay {
  position: absolute;
  inset: 0;
}

.card-info {
  min-height: 72px;
  padding: 10px 12px;
  border-top: 1px solid #f0f0f0;
}

.username {
  min-width: 0;
  overflow: hidden;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.metric-row {
  flex-shrink: 0;
  gap: 8px;
}

.metric {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: #666;
  font-size: 12px;
  line-height: 1;
}

.task-title {
  display: block;
  margin-top: 4px;
  overflow: hidden;
  font-size: 12px;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .showcase {
    padding: 24px 12px 36px;
  }

  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
