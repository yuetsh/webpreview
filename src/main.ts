import { createApp } from "vue"
import { create } from "naive-ui"
import { marked } from "marked"
import "normalize.css"
import "github-markdown-css/github-markdown-light.css"
import "highlight.js/styles/github.min.css"
import App from "./App.vue"

import { markedHighlight } from "marked-highlight"
import hljs from "highlight.js"

marked.use({
  gfm: true,
  async: true,
})
marked.use(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext"
      return hljs.highlight(code, { language }).value
    },
  }),
)

const app = createApp(App)
const naive = create()
app.use(naive)
app.mount("#app")
