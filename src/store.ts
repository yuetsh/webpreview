import { useStorage } from "@vueuse/core"

const defaultHTML = `<div class="welcome">黄岩一职</div>`
const defaultCSS = `.welcome {
    color: red;
}`

export const html = useStorage("web-html", defaultHTML)
export const css = useStorage("web-css", defaultCSS)
export const js = useStorage("web-js", "")

export function reset(lang: "html" | "css" | "js") {
  if (lang === "html") {
    html.value = defaultHTML
  } else if (lang === "css") {
    css.value = defaultCSS
  } else {
    js.value = ""
  }
}

export const size = useStorage("web-fontsize", 24)
export function changeSize(num: number) {
  size.value = num
}
