import { ref } from "vue"
import type { SubmissionAll } from "../utils/type"

export const submission = ref<SubmissionAll>({
  id: "",
  userid: 0,
  username: "",
  task_title: "",
  task_type: "tutorial",
  score: 0.0,
  my_score: 0,
  html: "",
  css: "",
  js: "",
  created: new Date(),
  modified: new Date(),
})
