import { useStorage } from "@vueuse/core"
import { STORAGE_KEY } from "../utils/const"

export const step = useStorage(STORAGE_KEY.STEP, 1)
