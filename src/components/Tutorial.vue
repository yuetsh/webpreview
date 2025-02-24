<template>
  <div class="container">
    <n-flex align="center" class="title">
      <n-flex align="center">
        <Icon icon="twemoji:open-book" :width="20"></Icon>
        <n-text class="preview">教程</n-text>
        <n-button text @click="prev" :disabled="step === '01'">
          <Icon :width="24" icon="pepicons-pencil:arrow-left"></Icon>
        </n-button>
        <n-button text @click="next" :disabled="end">
          <Icon :width="24" icon="pepicons-pencil:arrow-right"></Icon>
        </n-button>
      </n-flex>
    </n-flex>
    <div class="markdown-body" v-html="marked(content)"></div>
  </div>
</template>
<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import { step, prev, next, content } from "../store"
import { onMounted, ref, watch } from "vue"
import { marked } from "marked"

const end = ref(false)

async function getContent() {
  const res = await fetch(`/turtorial/${step.value}/README.md`)
  const data = await res.text()
  if (!!data) {
    content.value = data
    end.value = false
  } else {
    end.value = true
    content.value = ""
  }
}

onMounted(getContent)
watch(step, getContent)
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.title {
  height: 46px;
  background-color: rgb(247, 247, 250);
  padding: 0 20px;
  flex-shrink: 0;
}
.preview {
  font-size: 16px;
}
.markdown-body {
  padding: 16px;
  box-sizing: border-box;
  overflow: scroll;
}
</style>
