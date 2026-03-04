<template>
  <div class="prompt-panel">
    <div class="messages" ref="messagesRef">
      <div v-for="(msg, i) in messages" :key="i" :class="['message', msg.role]">
        <div class="message-role">{{ msg.role === 'user' ? '我' : 'AI' }}</div>
        <div class="message-content" v-html="renderContent(msg)"></div>
      </div>
      <div v-if="streaming" class="message assistant">
        <div class="message-role">AI</div>
        <div class="message-content" v-html="renderMarkdown(streamingContent)"></div>
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
      <n-flex justify="space-between" align="center" style="margin-top: 8px">
        <n-button text size="small" @click="newConversation" :disabled="streaming">
          新对话
        </n-button>
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
import { marked } from "marked"
import {
  messages,
  streaming,
  streamingContent,
  sendPrompt,
  newConversation,
} from "../store/prompt"

const input = ref("")
const messagesRef = ref<HTMLElement>()

function send() {
  const text = input.value.trim()
  if (!text || streaming.value) return
  sendPrompt(text)
  input.value = ""
}

function renderMarkdown(text: string): string {
  return marked.parse(text) as string
}

function renderContent(msg: { role: string; content: string }): string {
  return renderMarkdown(msg.content)
}

// Auto-scroll to bottom on new messages
watch(
  [() => messages.value.length, streamingContent],
  () => {
    nextTick(() => {
      if (messagesRef.value) {
        messagesRef.value.scrollTop = messagesRef.value.scrollHeight
      }
    })
  }
)
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

.input-area {
  padding: 12px;
  border-top: 1px solid #e0e0e0;
}
</style>
