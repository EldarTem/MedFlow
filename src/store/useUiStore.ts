// src/store/useUiStore.ts
import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    isLoading: false as boolean,
  }),
  actions: {
    showLoader() {
      this.isLoading = true;
    },
    hideLoader() {
      this.isLoading = false;
    },
  },
});
