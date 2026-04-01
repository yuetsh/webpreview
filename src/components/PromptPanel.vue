<template>
  <div class="prompt-panel">
    <div class="messages" ref="messagesRef">
      <div v-for="(msg, i) in messages" :key="i" :class="['message', msg.role]">
        <div class="message-role">{{ msg.role === "user" ? "我" : "AI" }}</div>
        <div class="message-content" v-html="renderContent(msg)"></div>
      </div>
      <div v-if="streaming" class="message assistant">
        <div class="message-role">AI</div>
        <div v-if="!streamingContent" class="typing-indicator">
          <span></span><span></span><span></span>
        </div>
        <div
          v-else
          class="message-content"
          v-html="renderMarkdown(streamingContent)"
        ></div>
        <div class="streaming-hint">AI 正在思考中…</div>
      </div>
    </div>
    <div class="input-area">
      <n-input
        v-model:value="input"
        type="textarea"
        :autosize="{ minRows: 1, maxRows: 4 }"
        placeholder="描述你想要的网页效果..."
        :disabled="streaming"
        @keydown.enter.exact.prevent="send"
      />
      <n-flex justify="flex-end" align="center" style="margin-top: 8px">
        <n-select
          v-model:value="selectedModel"
          :options="modelOptions"
          style="width: 120px"
          :disabled="streaming"
        />
        <n-button
          type="primary"
          :loading="streaming"
          :disabled="!input.trim() || streaming"
          @click="send"
        >
          发送
        </n-button>
      </n-flex>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue"
import { useStorage } from "@vueuse/core"
import { marked, Renderer } from "marked"
import {
  messages,
  streaming,
  streamingContent,
  sendPrompt,
} from "../store/prompt"

const input = ref("")
const messagesRef = ref<HTMLElement>()

const modelOptions = [
  { label: "豆包", value: "doubao-seed-2-0-mini-260215" },
  { label: "DeepSeek", value: "deepseek-chat" },
]
const selectedModel = useStorage("prompt-model", "deepseek-chat")

function send() {
  const text = input.value.trim()
  if (!text || streaming.value) return
  sendPrompt(text, selectedModel.value)
  input.value = ""
}

const renderer = new Renderer()
renderer.code = function ({ lang }: { text: string; lang?: string }) {
  const label = lang ? lang.toUpperCase() : "CODE"
  const colors: Record<
    string,
    { bg: string; fg: string; dot: string; border: string; shimmer: string }
  > = {
    html: {
      bg: "#f0fff4",
      fg: "#18a058",
      dot: "#18a058",
      border: "#b8e8cc",
      shimmer: "#f0fff4, #e0f7ea, #f0fff4",
    },
    css: {
      bg: "#f0f0ff",
      fg: "#6060d0",
      dot: "#6060d0",
      border: "#d0d0f0",
      shimmer: "#f0f0ff, #e8e8fa, #f0f0ff",
    },
    js: {
      bg: "#fffbf0",
      fg: "#c0960a",
      dot: "#c0960a",
      border: "#f0e0b0",
      shimmer: "#fffbf0, #fff5e0, #fffbf0",
    },
    javascript: {
      bg: "#fffbf0",
      fg: "#c0960a",
      dot: "#c0960a",
      border: "#f0e0b0",
      shimmer: "#fffbf0, #fff5e0, #fffbf0",
    },
  }
  const c = colors[(lang ?? "").toLowerCase()] ?? {
    bg: "#f0f7ff",
    fg: "#2080f0",
    dot: "#2080f0",
    border: "#e0eaf5",
    shimmer: "#f0f7ff, #e8f4f8, #f0f7ff",
  }
  return `<div class="code-placeholder" style="background: linear-gradient(90deg, ${c.shimmer}); background-size: 200% 100%; border-color: ${c.border}"><span class="code-placeholder-dot" style="background: ${c.dot}"></span><span class="code-placeholder-label" style="color: ${c.fg}; background: ${c.fg}18">${label}</span><span class="code-placeholder-text">代码正在生成中，结束后会自动应用到预览区</span></div>`
}

function renderMarkdown(text: string): string {
  return marked.parse(text, { renderer }) as string
}

function renderContent(msg: { role: string; content: string }): string {
  return renderMarkdown(msg.content)
}

// Auto-scroll to bottom on new messages
watch([() => messages.value.length, streamingContent], () => {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
})
</script>

<style scoped>
.prompt-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px;
}

.message {
  margin-bottom: 16px;
}

.message-role {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #666;
}

.message.user .message-role {
  color: #2080f0;
}

.message.assistant .message-role {
  color: #18a058;
}

.message-content {
  font-size: 14px;
  line-height: 1.6;
}

.message-content :deep(pre) {
  background: #f5f5f5;
  padding: 8px 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 13px;
}

.message-content :deep(.code-placeholder) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  margin: 8px 0;
  background: linear-gradient(90deg, #f0f7ff, #e8f4f8, #f0f7ff);
  background-size: 200% 100%;
  animation: shimmer 2s ease-in-out infinite;
  border-radius: 6px;
  border: 1px solid #e0eaf5;
}

.message-content :deep(.code-placeholder-dot) {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2080f0;
  animation: pulse 1.5s ease-in-out infinite;
}

.message-content :deep(.code-placeholder-label) {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 3px;
}

.message-content :deep(.code-placeholder-text) {
  font-size: 12px;
  color: #888;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}

.typing-indicator {
  display: flex;
  gap: 5px;
  padding: 8px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #18a058;
  animation: bounce 1.4s ease-in-out infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-6px);
    opacity: 1;
  }
}

.streaming-hint {
  font-size: 11px;
  color: #aaa;
  margin-top: 4px;
  animation: pulse 1.5s ease-in-out infinite;
}

.input-area {
  flex-shrink: 0;
  padding: 12px;
  border-top: 1px solid #e0e0e0;
}
</style>
