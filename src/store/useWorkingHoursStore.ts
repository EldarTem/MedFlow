import { defineStore } from 'pinia';
import { ref } from 'vue';
import { notifyError, notifySuccess } from '@/utils/notify';
import type {
  WorkingHour,
  WorkingHourSlot,
  CreateWorkingHourPayload,
  UpdateWorkingHourPayload,
} from '@/types';
import api from '@/services/api';
import { useAdminStore } from '@/store/useAdminStore';
import { format, startOfDay } from 'date-fns';

export const useWorkingHoursStore = defineStore('workingHours', () => {
  const workingHours = ref<WorkingHour[]>([]);
  const availableSlots = ref<WorkingHourSlot[]>([]);
  const isLoading = ref(false);

  async function fetchWorkingHours() {
    isLoading.value = true;
    try {
      const { data } = await api.get<WorkingHour[]>('/working-hours');
      console.log('API response data:', data);
      workingHours.value = data;
    } catch (e) {
      console.error('Error fetching working hours:', e);
      notifyError('Ошибка загрузки расписания');
      workingHours.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchAvailableSlots(params: {
    employeeId: number;
    districtId: number;
  }) {
    isLoading.value = true;
    try {
      const adminStore = useAdminStore();
      const employees = await adminStore.getEmployeesByDistrict(
        params.districtId
      );
      const employee = employees.find((e) => e.user_id === params.employeeId);
      if (!employee) {
        throw new Error('Сотрудник не найден в указанном районе');
      }

      const { data } = await api.get<WorkingHour[]>(
        `/working-hours/${params.employeeId}`
      );
      console.log('Raw working hours:', data);

      const slots = data
        .filter((wh) => {
          if (!wh.specific_date) return false;
          const slotDate = startOfDay(new Date(wh.specific_date));
          const currentDate = startOfDay(new Date());
          return slotDate >= currentDate;
        })
        .map((wh) => ({
          workingHourId: wh.id,
          date: format(new Date(wh.specific_date!), 'yyyy-MM-dd'),
          startTime: wh.start_time.slice(0, 5),
          endTime: wh.end_time.slice(0, 5),
        }));

      availableSlots.value = slots;
      console.log('Filtered available slots:', slots);
    } catch (e: any) {
      console.error('Error fetching available slots:', e);
      notifyError(e.message || 'Ошибка загрузки доступных слотов');
      availableSlots.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function createWorkingHour(payload: CreateWorkingHourPayload) {
    isLoading.value = true;
    try {
      const { data } = await api.post<WorkingHour>('/working-hours', payload);
      workingHours.value.push(data);
      notifySuccess('Рабочее время добавлено');
    } catch (e: any) {
      notifyError('Ошибка при добавлении рабочего времени');
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
      const { data } = await api.put<WorkingHour>(
        `/working-hours/${id}`,
        payload
      );
      const idx = workingHours.value.findIndex((w) => w.id === id);
      if (idx !== -1) workingHours.value[idx] = data;
      notifySuccess('Рабочее время обновлено');
    } catch (e: any) {
      notifyError('Ошибка при обновлении рабочего времени');
    } finally {
      isLoading.value = false;
    }
  }

  async function removeWorkingHour(id: number) {
    isLoading.value = true;
    try {
      await api.delete(`/working-hours/${id}`);
      workingHours.value = workingHours.value.filter((w) => w.id !== id);
      notifySuccess('Рабочее время удалено');
    } catch (e: any) {
      notifyError('Ошибка при удалении рабочего времени');
    } finally {
      isLoading.value = false;
    }
  }

  function clearAvailableSlots() {
    availableSlots.value = [];
  }

  return {
    workingHours,
    availableSlots,
    isLoading,
    fetchWorkingHours,
    fetchAvailableSlots,
    createWorkingHour,
    updateWorkingHour,
    removeWorkingHour,
    clearAvailableSlots,
  };
});
