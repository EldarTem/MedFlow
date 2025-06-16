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
      const { data } = await api.get<{ workingHours: WorkingHour[] }>(
        '/working-hours'
      );
      workingHours.value = data.workingHours;
    } catch (e: any) {
      notifyError(e.response?.data?.message || 'Ошибка загрузки расписания');
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
      // Проверяем, что сотрудник привязан к району
      const adminStore = useAdminStore();
      const employees = await adminStore.getEmployeesByDistrict(
        params.districtId
      );
      const employee = employees.find((e) => e.user_id === params.employeeId);
      if (!employee) {
        throw new Error('Сотрудник не найден в указанном районе');
      }

      // Запрос к существующему эндпоинту /working-hours/:id
      const { data } = await api.get<WorkingHour[]>(
        `/working-hours/${params.employeeId}`
      );

      // Логируем полученные данные для отладки
      console.log('Raw working hours:', data);

      // Фильтруем доступные слоты и преобразуем в формат WorkingHourSlot
      const slots = data
        .filter((wh) => {
          if (!wh.specific_date) return false;
          // Сравниваем только даты, игнорируя время
          const slotDate = startOfDay(new Date(wh.specific_date));
          const currentDate = startOfDay(new Date());
          return slotDate >= currentDate;
        })
        .map((wh) => ({
          workingHourId: wh.id,
          // Преобразуем specific_date в формат YYYY-MM-DD
          date: format(new Date(wh.specific_date!), 'yyyy-MM-dd'),
          startTime: wh.start_time.slice(0, 5), // Убираем секунды, оставляем HH:mm
          endTime: wh.end_time.slice(0, 5), // Убираем секунды, оставляем HH:mm
        }));

      availableSlots.value = slots;
      console.log('Filtered available slots:', slots);
    } catch (e: any) {
      console.error(
        'Error fetching available slots:',
        e.response?.data || e.message
      );
      notifyError(
        e.message ||
          e.response?.data?.message ||
          'Ошибка загрузки доступных слотов'
      );
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
      const { data } = await api.put<WorkingHour>(
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
      await api.delete(`/working-hours/${id}`);
      workingHours.value = workingHours.value.filter((w) => w.id === id);
      notifySuccess('Рабочее время удалено');
    } catch (e: any) {
      notifyError(
        e.response?.data?.message || 'Ошибка при удалении рабочего времени'
      );
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
