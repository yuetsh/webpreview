import { createApp } from "vue"
import {
  create,
  NButton,
  NFlex,
  NSplit,
  NTabs,
  NTabPane,
  NConfigProvider,
} from "naive-ui"
import "normalize.css"
import App from "./App.vue"

const app = createApp(App)
const naive = create({
  components: [NButton, NSplit, NFlex, NTabs, NTabPane, NConfigProvider],
})
app.use(naive)
app.mount("#app")
