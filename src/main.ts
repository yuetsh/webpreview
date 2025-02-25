import { createApp } from "vue"
import { create } from "naive-ui"
import "normalize.css"
import "github-markdown-css/github-markdown-light.css"
import "highlight.js/styles/github.min.css"
import App from "./App.vue"

const app = createApp(App)
const naive = create()
app.use(naive)
app.mount("#app")
