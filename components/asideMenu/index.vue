<template>
  <ClientOnly>
    <el-aside :class="projectStore.isCollapse ? '!w-[70px]' : '!w-[200px]'">
      <el-menu default-active="2" class="h-full aside-menu" :collapse="projectStore.isCollapse" @open="handleOpen"
        @close="handleClose">
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <location />
            </el-icon>
            <span>Navigator One</span>
          </template>
          <el-menu-item-group>
            <template #title><span>Group One</span></template>
            <el-menu-item index="1-1">item one</el-menu-item>
            <el-menu-item index="1-2">item two</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="Group Two">
            <el-menu-item index="1-3">item three</el-menu-item>
          </el-menu-item-group>
          <el-sub-menu index="1-4">
            <template #title><span>item four</span></template>
            <el-menu-item index="1-4-1">item one</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="2">
          <el-icon><icon-menu /></el-icon>
          <template #title>Navigator Two</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
  </ClientOnly>
</template>

<script setup lang="ts">
import {
  Menu as IconMenu,
  Location,
} from '@element-plus/icons-vue'

const projectStore = useProject()

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style lang="scss" scoped>
.aside-menu:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>