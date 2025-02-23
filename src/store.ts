import { useStorage } from "@vueuse/core";

export const html = useStorage("web-html", `<div class="welcome">黄岩一职</div>`)
export const css = useStorage("web-css", `.welcome { color: red; }`)
export const js = useStorage("web-js", "")