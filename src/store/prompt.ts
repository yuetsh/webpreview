import { ref } from "vue"
import { WS_BASE_URL } from "../utils/const"
import { html, css, js } from "./editors"

export interface PromptMessage {
  role: "user" | "assistant"
  content: string
  code?: { html: string | null; css: string | null; js: string | null }
  created?: string
}

export const messages = ref<PromptMessage[]>([])
export const conversationId = ref<string>("")
export const connected = ref(false)
export const streaming = ref(false)
export const streamingContent = ref("")

let ws: WebSocket | null = null

export function connectPrompt(taskId: number) {
  if (ws) ws.close()

  ws = new WebSocket(`${WS_BASE_URL}/ws/prompt/${taskId}/`)

  ws.onopen = () => {
    connected.value = true
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)

    if (data.type === "init") {
      conversationId.value = data.conversation_id
      messages.value = data.messages || []
      // Apply code from last assistant message if exists
      const lastAssistant = [...messages.value]
        .reverse()
        .find((m) => m.role === "assistant" && m.code)
      if (lastAssistant?.code) {
        applyCode(lastAssistant.code)
      }
    } else if (data.type === "stream") {
      streaming.value = true
      streamingContent.value += data.content
    } else if (data.type === "complete") {
      streaming.value = false
      // Push the full assistant message
      messages.value.push({
        role: "assistant",
        content: streamingContent.value,
        code: data.code,
      })
      streamingContent.value = ""
      // Apply code to editors
      if (data.code) {
        applyCode(data.code)
      }
    } else if (data.type === "error") {
      streaming.value = false
      streamingContent.value = ""
      messages.value.push({
        role: "assistant",
        content: data.content,
      })
    }
  }

  ws.onclose = () => {
    connected.value = false
  }
}

export function disconnectPrompt() {
  if (ws) {
    ws.close()
    ws = null
  }
  messages.value = []
  conversationId.value = ""
  connected.value = false
  streaming.value = false
  streamingContent.value = ""
}

export function sendPrompt(content: string) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return
  messages.value.push({ role: "user", content })
  ws.send(JSON.stringify({ type: "message", content }))
}

export function newConversation() {
  if (!ws || ws.readyState !== WebSocket.OPEN) return
  ws.send(JSON.stringify({ type: "new_conversation" }))
}

function applyCode(code: { html: string | null; css: string | null; js: string | null }) {
  if (code.html !== null) html.value = code.html
  if (code.css !== null) css.value = code.css
  if (code.js !== null) js.value = code.js
}
