<template>
  <div class="flex items-center h-full w-full border-b px-4">
    <el-page-header class="w-full">
      <template #content>
        <div class="flex items-center">
          <div class="px-4 pt-[5px] cursor-pointer" @click="projectStore.toggleIsCollapse()">
            <el-icon v-if="projectStore.isCollapse">
              <Expand />
            </el-icon>
            <el-icon v-else>
              <Fold />
            </el-icon>
          </div>
          <el-avatar :size="32" class="mr-3" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <span class="text-large font-600 mr-3"> Title </span>
          <span class="text-sm mr-2" style="color: var(--el-text-color-regular)">
            Sub title
          </span>
          <el-tag>Default</el-tag>
        </div>
      </template>
      <template #extra>
        <div class="flex items-center">
          <el-button>Print</el-button>
          <el-button type="primary" class="ml-2">Edit</el-button>
        </div>
      </template>
    </el-page-header>
  </div>
</template>

<script setup lang="ts">
import {
  Expand,
  Fold,
} from '@element-plus/icons-vue'

const projectStore = useProject()
</script>
