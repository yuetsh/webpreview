<template>
  <n-flex class="container" :wrap="false">
    <n-flex vertical class="menu">
      <n-button @click="$router.push({ name: 'home' })">返回</n-button>
      <n-button @click="$router.push({ name: 'tutorial' })">教程</n-button>
    </n-flex>
    <n-flex class="content">
      <router-view></router-view>
    </n-flex>
  </n-flex>
</template>
<script lang="ts" setup></script>
<style scoped>
.container {
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
}
.menu {
  width: 100px;
  padding: 10px 0 10px 10px;
}
.content {
  box-sizing: border-box;
  width: calc(100vw - 100px);
  overflow: hidden;
}
</style>
