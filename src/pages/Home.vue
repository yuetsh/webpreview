<template>
    <n-split :default-size="1 / 3" min="300px" max="800px">
      <template #1>
        <Tutorial />
      </template>
      <template #2>
        <n-split direction="vertical" min="200px">
          <template #1>
            <Editors />
          </template>
          <template #2>
            <Preview />
          </template>
        </n-split>
      </template>
    </n-split>
</template>
<script lang="ts" setup>
import Editors from "../components/Editors.vue"
import Preview from "../components/Preview.vue"
import Tutorial from "../components/Tutorial.vue"
</script>