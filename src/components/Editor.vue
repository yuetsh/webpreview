<script lang="ts" setup>
import { EditorView } from "@codemirror/view"
import { Codemirror } from "vue-codemirror"
import { githubLight } from "@fsegurai/codemirror-theme-github-light"
import { css } from "@codemirror/lang-css"
import { javascript } from "@codemirror/lang-javascript"
import { html } from "@codemirror/lang-html"
import { computed } from "vue"

const styleTheme = EditorView.baseTheme({
  "& .cm-scroller": {
    "font-family": "Monaco",
  },
  "&.cm-editor.cm-focused": {
    outline: "none",
  },
  "&.cm-editor .cm-tooltip.cm-tooltip-autocomplete ul": {
    "font-family": "Monaco",
  },
})

interface Props {
  language?: "html" | "css" | "js"
  fontSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  language: "html",
  fontSize: 20,
})

const code = defineModel<string>("value")

const lang = computed(() => {
  if (props.language === "html") return html()
  if (props.language === "css") return css()
  return javascript()
})
</script>
<template>
  <Codemirror
    v-model="code"
    indentWithTab
    :extensions="[styleTheme, lang, githubLight]"
    :tabSize="4"
    :style="{ height: '100%', fontSize: props.fontSize + 'px' }"
  />
</template>
