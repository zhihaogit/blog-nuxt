export const useLanguage = defineStore('language', {
  state() {
    return {
      language: 'zh-cn',
    };
  },

  actions: {
    toggleLanguage() {
      this.language = this.language === 'zh-cn'
        ? 'en'
        : 'zh-cn';
    }
  }
})
