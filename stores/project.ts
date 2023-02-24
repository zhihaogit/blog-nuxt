export const useProject = defineStore('project', {
  state() {
    return {
      isCollapse: false,
    }
  },

  actions: {
    toggleIsCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  }
})