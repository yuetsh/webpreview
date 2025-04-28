import { useDateFormat } from "@vueuse/core"
import { TASK_TYPE } from "./const"

export function parseTime(utc: Date | string, format = "YYYY年M月D日") {
  const time = useDateFormat(utc, format, { locales: "zh-CN" })
  return time.value
}

export function goHome(router: any, type: TASK_TYPE, step: number) {
  const query = { type } as any
  if (type === TASK_TYPE.Tutorial) {
    query.step = step
  }
  router.push({ name: "home", query })
}
