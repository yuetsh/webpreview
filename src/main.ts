import { createApp } from "vue"
import { create } from "naive-ui"
import App from "./App.vue"

//@ts-ignore
import "normalize.css"
//@ts-ignore
import "github-markdown-css/github-markdown-light.css"

import { marked } from "marked"
import markedAlert from "marked-alert"
import { markedHighlight } from "marked-highlight"
import { alertVariants } from "./utils"

import hljs from "highlight.js/lib/core"
import xml from "highlight.js/lib/languages/xml"
import css from "highlight.js/lib/languages/css"
import javascript from "highlight.js/lib/languages/javascript"
//@ts-ignore
import "highlight.js/styles/github.min.css"

hljs.registerLanguage("html", xml)
hljs.registerLanguage("css", css)
hljs.registerLanguage("js", javascript)

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
marked.use(markedAlert({ variants: alertVariants }))

const app = createApp(App)
const naive = create()
app.use(naive)
app.mount("#app")
