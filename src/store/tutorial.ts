import { ref } from "vue"

const urlParams = new URLSearchParams(window.location.search)
const currentStep = urlParams.get("step") ?? "1"

export const step = ref(Number(currentStep))
export const tutorialIds = ref<number[]>([])

export function prevDisabled(): boolean {
  const i = tutorialIds.value.indexOf(step.value)
  return i <= 0
}

export function nextDisabled(): boolean {
  const i = tutorialIds.value.indexOf(step.value)
  return i === -1 || i === tutorialIds.value.length - 1
}

export function prev(): void {
  const i = tutorialIds.value.indexOf(step.value)
  if (i > 0) step.value = tutorialIds.value[i - 1] as number
}

export function next(): void {
  const i = tutorialIds.value.indexOf(step.value)
  if (i !== -1 && i < tutorialIds.value.length - 1)
    step.value = tutorialIds.value[i + 1] as number
}
