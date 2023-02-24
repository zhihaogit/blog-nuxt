<template>
  <el-container class="h-full flex flex-row">
    <AsideMenu />
    <el-container class="flex h-full flex-1">
      <el-header class="!p-0">
        <Header />
      </el-header>
      <el-main class="flex-1">
        <slot />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
const AsideMenu = defineAsyncComponent(() => import('@/components/asideMenu/index.vue'))
const Header = defineAsyncComponent(() => import('@/components/header/index.vue'))
</script>
