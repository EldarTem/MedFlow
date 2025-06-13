import { defineStore } from 'pinia';
import { ref } from 'vue';
import { notifyError, notifySuccess } from '@/utils/notify';
import type {
  EmployeeDetails,
  CreateEmployeeDetailsPayload,
  UpdateEmployeeDetailsPayload,
} from '@/types';
import api from '@/services/api';

export const useEmployeeDetailsStore = defineStore('employeeDetails', () => {
  const employees = ref<EmployeeDetails[]>([]);
  const isLoading = ref(false);

  async function fetchEmployees() {
    isLoading.value = true;
    try {
      const { data } = await api.get<{ employees: EmployeeDetails[] }>(
        '/employees'
      );
      employees.value = data.employees;
    } catch (e: any) {
      notifyError(e.response?.data?.message || 'Ошибка загрузки сотрудников');
    } finally {
      isLoading.value = false;
    }
  }

  async function createEmployee(payload: CreateEmployeeDetailsPayload) {
    isLoading.value = true;
    try {
      const { data } = await api.post<EmployeeDetails>('/employees', payload);
      employees.value.push(data);
      notifySuccess('Сотрудник добавлен');
    } catch (e: any) {
      notifyError(
        e.response?.data?.message || 'Ошибка при создании сотрудника'
      );
    } finally {
      isLoading.value = false;
    }
  }

  async function updateEmployee(
    id: number,
    payload: UpdateEmployeeDetailsPayload
  ) {
    isLoading.value = true;
    try {
      const { data } = await api.put<EmployeeDetails>(
        `/employees/${id}`,
        payload
      );
      const idx = employees.value.findIndex((e) => e.id === id);
      if (idx !== -1) employees.value[idx] = data;
      notifySuccess('Данные сотрудника обновлены');
    } catch (e: any) {
      notifyError(
        e.response?.data?.message || 'Ошибка при обновлении сотрудника'
      );
    } finally {
      isLoading.value = false;
    }
  }

  async function removeEmployee(id: number) {
    isLoading.value = true;
    try {
      await api.delete(`/employees/${id}`);
      employees.value = employees.value.filter((e) => e.id !== id);
      notifySuccess('Сотрудник удалён');
    } catch (e: any) {
      notifyError(
        e.response?.data?.message || 'Ошибка при удалении сотрудника'
      );
    } finally {
      isLoading.value = false;
    }
  }

  return {
    employees,
    isLoading,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    removeEmployee,
  };
});
