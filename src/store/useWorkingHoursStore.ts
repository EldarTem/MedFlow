import { defineStore } from 'pinia';
import { ref } from 'vue';
import { notifyError, notifySuccess } from '@/utils/notify';
import type {
  WorkingHour,
  CreateWorkingHourPayload,
  UpdateWorkingHourPayload,
} from '@/types';
import axios from 'axios';

export const useWorkingHoursStore = defineStore('workingHours', () => {
  const workingHours = ref<WorkingHour[]>([]);
  const isLoading = ref(false);

  async function fetchWorkingHours() {
    isLoading.value = true;
    try {
      const { data } = await axios.get<{ workingHours: WorkingHour[] }>(
        '/working-hours'
      );
      workingHours.value = data.workingHours;
    } catch (e: any) {
      notifyError(e.response?.data?.message || 'Ошибка загрузки расписания');
    } finally {
      isLoading.value = false;
    }
  }

  async function createWorkingHour(payload: CreateWorkingHourPayload) {
    isLoading.value = true;
    try {
      const { data } = await axios.post<WorkingHour>(
        '/working-hours',
        payload
      );
      workingHours.value.push(data);
      notifySuccess('Рабочее время добавлено');
    } catch (e: any) {
      notifyError(
        e.response?.data?.message || 'Ошибка при добавлении рабочего времени'
      );
    } finally {
      isLoading.value = false;
    }
  }

  async function updateWorkingHour(
    id: number,
    payload: UpdateWorkingHourPayload
  ) {
    isLoading.value = true;
    try {
      const { data } = await axios.put<WorkingHour>(
        `/working-hours/${id}`,
        payload
      );
      const idx = workingHours.value.findIndex((w) => w.id === id);
      if (idx !== -1) workingHours.value[idx] = data;
      notifySuccess('Рабочее время обновлено');
    } catch (e: any) {
      notifyError(
        e.response?.data?.message || 'Ошибка при обновлении рабочего времени'
      );
    } finally {
      isLoading.value = false;
    }
  }

  async function removeWorkingHour(id: number) {
    isLoading.value = true;
    try {
      await axios.delete(`/working-hours/${id}`);
      workingHours.value = workingHours.value.filter((w) => w.id !== id);
      notifySuccess('Рабочее время удалено');
    } catch (e: any) {
      notifyError(
        e.response?.data?.message || 'Ошибка при удалении рабочего времени'
      );
    } finally {
      isLoading.value = false;
    }
  }

  return {
    workingHours,
    isLoading,
    fetchWorkingHours,
    createWorkingHour,
    updateWorkingHour,
    removeWorkingHour,
  };
});
