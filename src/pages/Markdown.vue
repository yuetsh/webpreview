<template>
  <n-grid x-gap="10" :cols="8">
    <n-gi :span="2" class="col">
      <n-flex vertical class="list">
        <n-card
          v-for="item in list"
          :key="item.display"
          @click="show(item.display)"
          class="card"
          :header-style="{
            backgroundColor:
              item.display === tutorial.display ? 'rgba(24, 160, 80, 0.1)' : '',
          }"
          :embedded="!item.is_public"
        >
          <template #header>
            <n-flex align="center">
              <n-button text @click.stop="togglePublic(item.display)">
                <Icon
                  width="24"
                  :icon="
                    item.is_public
                      ? 'twemoji:check-mark-button'
                      : 'twemoji:locked'
                  "
                ></Icon>
              </n-button>
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
import { computed, onMounted, reactive, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Icon } from "@iconify/vue"
import { Tutorial } from "../api"
import type { TutorialSlim } from "../utils/type"
import { useDialog, useMessage } from "naive-ui"

const route = useRoute()
const router = useRouter()
const message = useMessage()
const confirm = useDialog()

const list = ref<TutorialSlim[]>([])
const content = ref("")
const tutorial = reactive({
  display: 0,
  title: "",
  content: "",
  is_public: false,
})

const canSubmit = computed(
  () => tutorial.display && tutorial.title && tutorial.content,
)
async function getContent() {
  list.value = await Tutorial.list()
  show(Number(route.params.display))
}

function createNew() {
  tutorial.display = list.value[list.value.length - 1].display + 1
  tutorial.title = ""
  tutorial.content = ""
  tutorial.is_public = false
  content.value = ""
}

async function submit() {
  try {
    await Tutorial.createOrUpdate(tutorial)
    tutorial.display = 0
    tutorial.title = ""
    tutorial.content = ""
    tutorial.is_public = false
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
  router.push({ name: "tutorial", params: { display } })
  const item = await Tutorial.get(display)
  tutorial.display = item.display
  tutorial.title = item.title
  tutorial.content = item.content
  tutorial.is_public = item.is_public
  content.value = await marked.parse(item.content, { async: true })
}

async function togglePublic(display: number) {
  const data = await Tutorial.togglePublic(display)
  message.success(data.message)
  list.value = list.value.map((item) => {
    if (item.display === display) item.is_public = !item.is_public
    return item
  })
}

watch(
  () => tutorial.content,
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

.card {
  cursor: pointer;
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
