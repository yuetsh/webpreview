import { useStorage } from "@vueuse/core"

const defaultHTML = `<div class="welcome">黄岩一职</div>`
const defaultCSS = `.welcome {
    color: red;
    font-size: 24px;
}`

export const html = useStorage("web-html", defaultHTML)
export const css = useStorage("web-css", defaultCSS)
export const js = useStorage("web-js", "")

export const tab = useStorage("web-tab", "html")
export const size = useStorage("web-fontsize", 24)

export function reset(lang: "html" | "css" | "js") {
  if (lang === "html") {
    html.value = defaultHTML
  } else if (lang === "css") {
    css.value = defaultCSS
  } else {
    js.value = ""
  }
}
