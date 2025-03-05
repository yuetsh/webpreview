<template>
  <n-flex vertical class="container">
    <n-flex>
      <div>
        <n-input
          style="width: 200px"
          v-model:value="query.username"
          clearable
        />
      </div>
      <div>
        <n-select
          style="width: 120px"
          v-model:value="query.role"
          :options="roles"
        />
      </div>
      <n-button @click="goDjangoUserAdd">新建一个</n-button>
      <n-button @click="showBatch = true">批量新建</n-button>
      <n-pagination
        v-model:page="query.page"
        :page-size="20"
        :item-count="count"
        simple
      />
    </n-flex>
    <n-data-table :columns="columns" :data="users"></n-data-table>
    <n-modal
      style="width: 300px"
      :mask-closable="false"
      preset="card"
      title="批量新建用户"
      v-model:show="showBatch"
    >
      <n-flex vertical>
        <b>前缀：web</b>
        <n-input placeholder="班级" />
        <n-input rows="20" type="textarea" />
        <n-button type="primary">提交</n-button>
      </n-flex>
    </n-modal>
  </n-flex>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, h, watch } from "vue"
import { Account } from "../api"
import { parseTime } from "../utils/helper"
import type { DataTableColumn } from "naive-ui"
import { getRole, Role, type User } from "../utils/type"
import { ADMIN_URL } from "../utils/const"
import UserActions from "../components/dashboard/UserActions.vue"
import { useRoute, useRouter } from "vue-router"
import { watchDebounced } from "@vueuse/core"

const users = ref([])
const count = ref(0)
const route = useRoute()
const router = useRouter()
const query = reactive({
  username: "",
  page: Number(route.params.page),
  role: "",
})
const showBatch = ref(true)

const roles = [
  { label: "全部权限", value: "" },
  { label: "普通用户", value: Role.Normal },
  { label: "管理员", value: Role.Admin },
  { label: "超级管理员", value: Role.Super },
]

const columns: DataTableColumn<User>[] = [
  {
    title: "用户名",
    key: "username",
  },
  {
    title: "密码",
    key: "raw_password",
  },
  {
    title: "创建时间",
    key: "date_joined",
    render: (row) => parseTime(row.date_joined, "YYYY-MM-DD HH:mm:ss"),
  },
  {
    title: "上次登录",
    key: "last_login",
    render: (row) =>
      row.last_login
        ? parseTime(row.last_login, "YYYY-MM-DD HH:mm:ss")
        : "从未登录",
  },
  {
    title: "权限",
    key: "role",
    render: (row) => getRole(row.role),
  },
  {
    title: "选项",
    key: "actions",
    render: (row) => h(UserActions, { user: row, onReload: init }),
  },
]

function goDjangoUserAdd() {
  window.open(`${ADMIN_URL}/account/user/add/`)
}

async function init() {
  const data = await Account.list(query)
  users.value = data.items
  count.value = data.count
}

watch(() => [query.page, query.role], init)
watchDebounced(() => query.username, init, { debounce: 500, maxWait: 1000 })
watch(
  () => query.page,
  (v) => router.push({ params: { page: v } }),
)

onMounted(init)
</script>
<style scoped>
.container {
  padding: 10px 10px 10px 0;
}
</style>
