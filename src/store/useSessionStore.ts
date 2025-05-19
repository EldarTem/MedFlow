import { defineStore } from 'pinia';
import api from '@/services/api'; // Предполагаем, что api настроен
import { ElNotification } from 'element-plus';
import { useUiStore } from './useUiStore'; // Для отображения состояния загрузки

export interface Session {
  id: number;
  status: string;
  specific_date: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  direction_name: string;
}

export const useSessionStore = defineStore('sessions', {
  state: () => ({
    sessions: [] as Session[], // Список сессий
  }),
  actions: {
    // Получение сессий текущего пользователя
    async getUserSessions() {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.get('/sessions'); // Вызов API для получения сессий
        this.sessions = response.data;
      } catch (error) {
        ElNotification.error('Ошибка при получении сессий');
      } finally {
        uiStore.hideLoader();
      }
    },
  },
});
