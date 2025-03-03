<template>
  <n-grid x-gap="10" :cols="8">
    <n-gi :span="2" class="col">
      <n-flex vertical class="list">
        <n-card
          v-for="item in list"
          :key="item.display"
          @click="show(item.display)"
          style="cursor: pointer"
        >
          <template #header>
            <n-flex align="center">
              <Icon
                :icon="
                  item.is_public
                    ? 'twemoji:check-mark-button'
                    : 'twemoji:locked'
                "
              ></Icon>
              <span>【{{ item.display }}】{{ item.title }}</span>
            </n-flex>
          </template>
          <template #header-extra>
            <n-button text type="default" @click="remove(item.display)">
              <Icon width="20" icon="material-symbols:close-rounded"></Icon>
            </n-button>
          </template>
        </n-card>
        <n-button @click="createNew">新建</n-button>
      </n-flex>
    </n-gi>

    <n-gi :span="3" class="col">
      <n-form>
        <n-grid x-gap="10" :cols="4">
          <n-gi :span="1">
            <n-form-item label="序号">
              <n-input-number v-model:value="tutorial.display" />
            </n-form-item>
          </n-gi>
          <n-gi :span="2">
            <n-form-item label="标题">
              <n-input v-model:value="tutorial.title" />
            </n-form-item>
          </n-gi>
          <n-gi :span="1">
            <n-form-item label="公开">
              <n-switch v-model:value="tutorial.is_public" />
            </n-form-item>
          </n-gi>
        </n-grid>
        <n-form-item label="内容">
          <n-input
            v-model:value="tutorial.content"
            type="textarea"
            class="editor"
          />
        </n-form-item>
        <n-button block type="primary" @click="submit" :disabled="!canSubmit">
          提交
        </n-button>
      </n-form>
    </n-gi>

    <n-gi :span="3" class="markdwon-body" v-html="content"></n-gi>
  </n-grid>
</template>
<script lang="ts" setup>
import { marked } from "marked"
import { computed, onMounted, ref, watch } from "vue"
import { Icon } from "@iconify/vue"
import { useStorage } from "@vueuse/core"
import { Tutorial } from "../api"
import type { TutorialSlim } from "../utils/type"
import { useDialog, useMessage } from "naive-ui"

const message = useMessage()
const confirm = useDialog()

const list = ref<TutorialSlim[]>([])
const content = ref("")
const tutorial = useStorage("web-tutorial", {
  display: 0,
  title: "",
  content: "",
  is_public: false,
})

const canSubmit = computed(
  () =>
    tutorial.value.display && tutorial.value.title && tutorial.value.content,
)
async function getContent() {
  const res = await Tutorial.list()
  list.value = res.list
  const data = tutorial.value.content || res.first?.content
  content.value = await marked.parse(data ?? "", { async: true })
}

function createNew() {
  tutorial.value.display = list.value[list.value.length - 1].display + 1
  tutorial.value.title = ""
  tutorial.value.content = ""
  tutorial.value.is_public = false
  content.value = ""
}

async function submit() {
  try {
    await Tutorial.createOrUpdate(tutorial.value)
    tutorial.value.display = 0
    tutorial.value.title = ""
    tutorial.value.content = ""
    tutorial.value.is_public = false
    await getContent()
    content.value = ""
  } catch (error: any) {
    message.error(error.response.data.detail)
  }
}

async function remove(display: number) {
  confirm.warning({
    title: "警告",
    content: "你确定要删除吗？",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: async () => {
      await Tutorial.remove(display)
      message.success("删除成功")
      getContent()
    },
  })
}

async function show(display: number) {
  const item = await Tutorial.get(display)
  tutorial.value.display = item.display
  tutorial.value.title = item.title
  tutorial.value.content = item.content
  tutorial.value.is_public = item.is_public
  content.value = await marked.parse(item.content, { async: true })
}

watch(
  () => tutorial.value.content,
  async (v: string) => {
    content.value = await marked.parse(v, { async: true })
  },
)

onMounted(getContent)
</script>
<style scoped>
.list {
  overflow: auto;
  height: calc(100vh - 20px);
}

.col {
  padding-top: 10px;
}

.editor {
  height: calc(100vh - 200px);
}

.markdwon-body {
  box-sizing: border-box;
  overflow: auto;
  height: 100vh;
}
</style>
