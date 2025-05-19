// src/store/useTrainerDetailsStore.ts
import { defineStore } from 'pinia';
import api from '@/services/api';
import { Trainer } from '@/types';
import { ElNotification } from 'element-plus';
import { useUiStore } from './useUiStore';

interface TrainerDetailsState {
  trainers: Trainer[];
}

export const useTrainerDetailsStore = defineStore('trainerDetails', {
  state: (): TrainerDetailsState => ({
    trainers: [],
  }),
  actions: {
    async fetchAllTrainers() {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.get('/employee-details');
        this.trainers = response.data;
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message ||
            'Не удалось загрузить список тренеров'
        );
      } finally {
        uiStore.hideLoader();
      }
    },
    async addTrainerDetails(details: Partial<Trainer>) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.post('/employee-details', details);
        ElNotification.success('Информация о тренере добавлена');
        await this.fetchAllTrainers();
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || 'Не удалось добавить тренера'
        );
      } finally {
        uiStore.hideLoader();
      }
    },
    async updateTrainerDetails(details: Partial<Trainer>) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.put('/employee-details', details);
        ElNotification.success('Информация о тренере обновлена');
        await this.fetchAllTrainers();
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || 'Не удалось обновить данные тренера'
        );
      } finally {
        uiStore.hideLoader();
      }
    },
    async deleteTrainerDetails() {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.delete('/employee-details');
        ElNotification.success(
          response.data.message || 'Тренер удалён успешно'
        );
        await this.fetchAllTrainers();
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || 'Не удалось удалить тренера'
        );
      } finally {
        uiStore.hideLoader();
      }
    },
    async fetchTrainerById(user_id: number): Promise<Trainer | null> {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.get(`/employee-details/${user_id}`);
        return response.data as Trainer;
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message ||
            'Не удалось загрузить информацию о тренере'
        );
        return null;
      } finally {
        uiStore.hideLoader();
      }
    },
  },
});
