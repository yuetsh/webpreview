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
let _onCodeComplete:
  | ((code: {
      html: string | null
      css: string | null
      js: string | null
    }) => void)
  | null = null

export function setOnCodeComplete(fn: typeof _onCodeComplete) {
  _onCodeComplete = fn
}

let ws: WebSocket | null = null
let _currentTaskId = 0

export function connectPrompt(taskId: number) {
  _currentTaskId = taskId
  if (ws) ws.close()

  ws = new WebSocket(`${WS_BASE_URL}/ws/prompt/${taskId}/`)

  ws.onopen = () => {
    connected.value = true
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)

    if (data.type === "init") {
      streaming.value = false
      streamingContent.value = ""
      // Skip overwriting messages if HTTP preload already loaded this conversation.
      // If conversation_id differs (e.g. after "新对话"), always overwrite.
      const alreadyLoaded = conversationId.value === data.conversation_id
      conversationId.value = data.conversation_id
      if (!alreadyLoaded) {
        messages.value = data.messages || []
        // Apply code from last assistant message if exists
        // (skipped when HTTP preload already loaded and applied)
        const lastAssistant = [...messages.value]
          .reverse()
          .find((m) => m.role === "assistant" && m.code)
        if (lastAssistant?.code) {
          applyCode(lastAssistant.code)
        }
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
        if (_onCodeComplete) {
          _onCodeComplete(data.code)
        }
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
  _onCodeComplete = null
}

export function sendPrompt(content: string, model: string = "") {
  if (!ws || ws.readyState !== WebSocket.OPEN) return
  streaming.value = true
  messages.value.push({ role: "user", content })
  ws.send(JSON.stringify({ type: "message", content, model }))
}

export function stopPrompt() {
  // Remove the user message added to UI (not yet saved in DB)
  if (
    messages.value.length > 0 &&
    messages.value[messages.value.length - 1].role === "user"
  ) {
    messages.value.pop()
  }
  streaming.value = false
  streamingContent.value = ""
  // connectPrompt closes old WS (triggering backend disconnect cleanup) then reconnects
  if (_currentTaskId) {
    connectPrompt(_currentTaskId)
  }
}

function applyCode(code: {
  html: string | null
  css: string | null
  js: string | null
}) {
  if (code.html !== null) html.value = code.html
  if (code.css !== null) css.value = code.css
  if (code.js !== null) js.value = code.js
}
