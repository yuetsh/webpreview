import { ref } from "vue"

const urlParams = new URLSearchParams(window.location.search)
const currentStep = urlParams.get("step") ?? "1"

export const step = ref(Number(currentStep))

export const show = ref(true)
export const tutorialSize = ref(2 / 5)
