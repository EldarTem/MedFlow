// src/store/useTrainerWorkingHoursStore.ts
import { defineStore } from 'pinia';
import api from '@/services/api';
import { ElNotification } from 'element-plus';
import { useUiStore } from './useUiStore';
import type { WorkingHour } from '@/types';

export const useTrainerWorkingHoursStore = defineStore('trainerWorkingHours', {
  state: () => ({
    workingHours: [] as WorkingHour[],
  }),
  actions: {
    async createWorkingHour(hour: Partial<WorkingHour>) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.post('/working-hours', hour);
        ElNotification.success('Рабочий час успешно создан');
      } catch (error) {
        ElNotification.error('Ошибка при создании рабочего часа');
      } finally {
        uiStore.hideLoader();
      }
    },
    async getTrainerWorkingHours(trainer_id: number) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.get(`/working-hours/${trainer_id}`);
        this.workingHours = response.data.map((wh: any) => ({
          id: wh.working_hour_id,
          trainer_id: wh.trainer_id,
          day_of_week: wh.day_of_week,
          specific_date: wh.specific_date,
          start_time: wh.start_time,
          end_time: wh.end_time,
          status: wh.working_hour_status,
          sessions:
            typeof wh.sessions === 'string'
              ? JSON.parse(wh.sessions)
              : wh.sessions || [],
        }));
      } catch (error) {
        console.error('Ошибка при получении рабочих часов тренера', error);
        ElNotification.error('Ошибка при получении рабочих часов тренера');
      } finally {
        uiStore.hideLoader();
      }
    },
    async updateWorkingHour(hour: WorkingHour) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.put(`/working-hours/${hour.id}`, hour);
        ElNotification.success('Рабочий час успешно обновлён');
      } catch (error) {
        ElNotification.error('Ошибка при обновлении рабочего часа');
      } finally {
        uiStore.hideLoader();
      }
    },
    async deleteWorkingHour(id: number) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.delete(`/working-hours/${id}`);
        ElNotification.success('Рабочий час успешно удалён');
        this.workingHours = this.workingHours.filter((h) => h.id !== id);
      } catch (error) {
        ElNotification.error('Ошибка при удалении рабочего часа');
      } finally {
        uiStore.hideLoader();
      }
    },
  },
});
