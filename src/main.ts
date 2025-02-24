import { createApp } from "vue"
import { create } from "naive-ui"
import "normalize.css"
import App from "./App.vue"

const app = createApp(App)
const naive = create()
app.use(naive)
app.mount("#app")
