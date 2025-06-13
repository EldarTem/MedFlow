import { defineStore } from 'pinia';
import { ref } from 'vue';
import { notifyError } from '@/utils/notify';
import type { Statistics } from '@/types';
import axios from 'axios';

export const useStatisticsStore = defineStore('statistics', () => {
  const statistics = ref<Statistics | null>(null);
  const isLoading = ref(false);

  async function fetchStatistics() {
    isLoading.value = true;
    try {
      const { data } = await axios.get<Statistics>('/statistics');
      statistics.value = data;
    } catch (e: any) {
      notifyError(e.response?.data?.message || 'Ошибка загрузки статистики');
    } finally {
      isLoading.value = false;
    }
  }

  return {
    statistics,
    isLoading,
    fetchStatistics,
  };
});
