import { ref } from "vue"
import { TASK_TYPE } from "../utils/const"

const urlParams = new URLSearchParams(window.location.search)
const currentTask = (urlParams.get("task") as TASK_TYPE) ?? TASK_TYPE.Tutorial

export const taskTab = ref(currentTask)
export const taskId = ref(0)
