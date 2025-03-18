<template>
  <n-flex>
    <n-tag
      size="small"
      :bordered="false"
      type="primary"
      v-if="props.submission.task_type === 'tutorial'"
    >
      教程
    </n-tag>
    <n-tag
      :bordered="false"
      size="small"
      type="error"
      v-if="props.submission.task_type === 'challenge'"
    >
      挑战
    </n-tag>
    <n-button text>{{ props.submission.task_title }}</n-button>
  </n-flex>
</template>
<script setup lang="ts">
import type { SubmissionOut } from "../../utils/type"

interface Props {
  submission: SubmissionOut
}

const props = defineProps<Props>()
</script>
