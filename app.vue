<template>
  <el-config-provider :locale="locale">
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </el-config-provider>
</template>

<script lang="ts" setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

const languageStore = useLanguage()
const locale = computed(() => (languageStore.language === 'zh-cn' ? zhCn : en))
</script>
