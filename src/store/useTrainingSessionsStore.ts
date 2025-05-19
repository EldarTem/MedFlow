// src/store/useTrainingSessionsStore.ts
import { defineStore } from 'pinia';
import api from '@/services/api';
import { TrainingSession } from '@/types';
import { ElNotification } from 'element-plus';
import { useUiStore } from './useUiStore';

interface TrainingSessionsState {
  upcomingSessions: TrainingSession[];
  completedSessions: TrainingSession[];
}

export const useTrainingSessionsStore = defineStore('trainingSessions', {
  state: (): TrainingSessionsState => ({
    upcomingSessions: [],
    completedSessions: [],
  }),
  actions: {
    async bookSession(working_hour_id: number) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.post('/sessions', {
          working_hour_id,
        });
        ElNotification.success(response.data.message || 'Сессия забронирована');
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || 'Не удалось забронировать сессию'
        );
      } finally {
        uiStore.hideLoader();
      }
    },
    async completeSession(id: number, training_type: string, comments: string) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.put(`/training-sessions/${id}/complete`, {
          training_type,
          comments,
        });
        ElNotification.success('Тренировка завершена');
      } catch (error) {
        ElNotification.error('Не удалось завершить тренировку');
      } finally {
        uiStore.hideLoader();
      }
    },
    async fetchUserSessions() {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.get('/sessions/');
        const sessions: TrainingSession[] = response.data;
        this.upcomingSessions = sessions.filter((s) => s.status === 'booked');
        this.completedSessions = sessions.filter(
          (s) => s.status === 'completed'
        );
      } catch (error) {
        ElNotification.error('Не удалось получить сессии пользователя');
      } finally {
        uiStore.hideLoader();
      }
    },
  },
});
