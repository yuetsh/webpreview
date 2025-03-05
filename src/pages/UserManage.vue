<template>
  <n-flex vertical class="container">
    <n-flex>
      <div>
        <n-input v-model:value="query.username" clearable />
      </div>
      <n-button @click="init">搜索</n-button>
      <n-button @click="goDjangoUserAdd">新建一个</n-button>
      <n-button>批量新建</n-button>
      <n-pagination
        v-model:page="query.page"
        :page-size="20"
        :item-count="count"
        simple
      />
    </n-flex>
    <n-data-table :columns="columns" :data="users"></n-data-table>
  </n-flex>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, h, watch } from "vue"
import { Account } from "../api"
import { parseTime } from "../utils/helper"
import type { DataTableColumn } from "naive-ui"
import { getRole, type User } from "../utils/type"
import { ADMIN_URL } from "../utils/const"
import UserActions from "../components/dashboard/UserActions.vue"
import { useRoute, useRouter } from "vue-router"

const users = ref([])
const count = ref(0)
const route = useRoute()
const router = useRouter()
const query = reactive({
  username: "",
  page: Number(route.params.page),
})

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

watch(query, init)
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
