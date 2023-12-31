import { defineStore } from 'pinia';

export default defineStore({
  id: 'api',
  state: () => ({
    selectedRoute: {} as any,
    needRefresh: false,
  }),

  persist: true,
  
  getters: {
    // doubleCount: (state) => state.counter * 2
  },
  
  actions: {
    setSelectedRoute(route: any):void {
        this.selectedRoute = route;
    },
    clearSelectedRoute() {
        this.selectedRoute = {};
    },
    setNeedRefresh(value:boolean) {
      this.needRefresh = value;
    }
  }
});
