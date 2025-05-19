// src/store/useTrainerScheduleStore.ts
import { defineStore } from 'pinia';
import api from '@/services/api';
import { WorkingHour } from '@/types';
import { ElNotification } from 'element-plus';
import { useUiStore } from './useUiStore';

interface TrainerScheduleState {
  workingHours: WorkingHour[];
}

export const useTrainerScheduleStore = defineStore('trainerSchedule', {
  state: (): TrainerScheduleState => ({
    workingHours: [],
  }),
  actions: {
    async fetchWorkingHours() {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.get('/working-hours');
        this.workingHours = response.data;
      } catch (error) {
        ElNotification.error('Ошибка загрузки расписания');
      } finally {
        uiStore.hideLoader();
      }
    },
    async addWorkingHour(hour: Partial<WorkingHour>) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.post('/working-hours', hour);
        ElNotification.success('Рабочее время добавлено');
        await this.fetchWorkingHours();
      } catch (error) {
        ElNotification.error('Ошибка добавления рабочего времени');
      } finally {
        uiStore.hideLoader();
      }
    },
    async updateWorkingHour(hour: WorkingHour) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.put(`/working-hours/${hour.id}`, hour);
        ElNotification.success('Рабочее время обновлено');
        await this.fetchWorkingHours();
      } catch (error) {
        ElNotification.error('Ошибка обновления рабочего времени');
      } finally {
        uiStore.hideLoader();
      }
    },
    async deleteWorkingHour(id: number) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.delete(`/working-hours/${id}`);
        ElNotification.success('Рабочее время удалено');
        this.workingHours = this.workingHours.filter((h) => h.id !== id);
      } catch (error) {
        ElNotification.error('Ошибка удаления рабочего времени');
      } finally {
        uiStore.hideLoader();
      }
    },
  },
});
