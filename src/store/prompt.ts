import { ref } from "vue"
import { WS_BASE_URL } from "../utils/const"
import { html, css, js } from "./editors"
import { Prompt } from "../api"
import type { PromptMessage as RawMessage } from "../utils/type"
import { user } from "./user"

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
export const historyLoading = ref(false)
let _historyLoadId = 0
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

export function connectPrompt(taskId: number) {
  if (ws) ws.close()

  ws = new WebSocket(`${WS_BASE_URL}/ws/prompt/${taskId}/`)

  ws.onopen = () => {
    connected.value = true
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)

    if (data.type === "init") {
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
  _historyLoadId++ // cancel any in-flight loadHistory
  historyLoading.value = false // reset here; finally block won't (loadId mismatch)
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

export async function loadHistory(taskId: number) {
  const loadId = ++_historyLoadId
  historyLoading.value = true
  try {
    const convs = await Prompt.listConversations(taskId)
    console.log(
      "[loadHistory] convs:",
      convs.map((c: any) => ({
        id: c.id,
        is_active: c.is_active,
        message_count: c.message_count,
        username: c.username,
      })),
      "user.username:",
      user.username,
    )
    if (loadId !== _historyLoadId) return // navigated away, abort
    const active = convs.find(
      (c: { is_active: boolean; message_count: number; username: string }) =>
        c.is_active && c.message_count > 0 && c.username === user.username,
    )
    console.log("[loadHistory] active:", active)
    if (!active) return
    const raw: RawMessage[] = await Prompt.getMessages(active.id)
    console.log("[loadHistory] raw messages:", raw.length)
    if (loadId !== _historyLoadId) return // navigated away, abort
    // Only apply if nothing has arrived via WebSocket yet
    if (messages.value.length > 0) return
    conversationId.value = active.id
    messages.value = raw.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
      code:
        m.role === "assistant"
          ? { html: m.code_html, css: m.code_css, js: m.code_js }
          : undefined,
      created: m.created,
    }))
    // Apply code from last assistant message to editors
    const lastAssistant = [...messages.value]
      .reverse()
      .find((m) => m.role === "assistant" && m.code)
    if (lastAssistant?.code) {
      applyCode(lastAssistant.code)
    }
  } catch {
    // 静默失败，不影响 WebSocket 正常流程
  } finally {
    if (loadId === _historyLoadId) historyLoading.value = false
  }
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

function applyCode(code: {
  html: string | null
  css: string | null
  js: string | null
}) {
  if (code.html !== null) html.value = code.html
  if (code.css !== null) css.value = code.css
  if (code.js !== null) js.value = code.js
}
