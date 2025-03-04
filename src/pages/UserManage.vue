<template>
  <n-flex vertical class="container">
    <n-flex>
      <div>
        <n-input v-model:value="query.username" clearable />
      </div>
      <n-button @click="init">搜索</n-button>
      <n-button>新建一个</n-button>
      <n-button>批量新建</n-button>
    </n-flex>
    <n-flex>
      <n-data-table :columns="columns" :data="data"></n-data-table>
    </n-flex>
  </n-flex>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue"
import { Account } from "../api"
import { parseTime } from "../utils/helper"
import type { DataTableColumn } from "naive-ui"
import type { User } from "../utils/type"

const data = ref([])
const query = reactive({
  username: "",
})

const columns: DataTableColumn<User>[] = [
  {
    title: "用户名",
    key: "username",
  },
  {
    title: "凭证",
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
      row.last_login ? parseTime(row.last_login, "YYYY-MM-DD HH:mm:ss") : "从未登录",
  },
  {
    title: "权限",
    key: "role",
  },
  {
    title: "选项",
    key: "actions",
  },
]

async function init() {
  data.value = await Account.list(query)
}

onMounted(init)
</script>
<style scoped>
.container {
  padding: 10px 10px 10px 0;
}
</style>
