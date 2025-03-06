import { ref } from "vue"
import { useStorage } from "@vueuse/core"
import { STORAGE_KEY } from "../utils/const"

export const step = useStorage(STORAGE_KEY.STEP, 1)

export const show = ref(true)
export const tutorialSize = ref(2 / 5)
