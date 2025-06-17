import { defineStore } from 'pinia';
import { ref } from 'vue';
import { notifyError, notifySuccess } from '@/utils/notify';
import type { User, UpdateUserPayload } from '@/types';
import api from '@/services/api';

// Расширим тип User для поддержки дополнительных полей из EmployeeDetails
export interface EmployeeDetails {
  user_id: number;
  name: string;
  email: string;
  specialization?: string;
  experience_years?: number;
  bio?: string;
  certifications?: string;
  message?: string; // Для случаев, когда данных нет
}

// Тип для payload назначения роли
export interface AssignRolePayload {
  email: string;
  role: 'user' | 'employee' | 'local_admin' | 'super_admin';
  district_id?: number;
  specialization?: string;
  experience_years?: number;
  bio?: string;
  certifications?: string;
}

export const useAdminStore = defineStore('admin', () => {
  const users = ref<User[]>([]);
  const isLoading = ref(false);

  async function fetchUsers(params?: {
    role?: User['role'];
    page?: number;
    limit?: number;
  }) {
    isLoading.value = true;
    try {
      const { data } = await api.get<{
        users: User[];
        meta: { total: number; page: number; limit: number };
      }>('/admin', {
        params,
      });
      users.value = data.users;
    } catch (e: any) {
      notifyError(e.response?.data?.message || 'Ошибка загрузки пользователей');
    } finally {
      isLoading.value = false;
    }
  }

  async function getUserById(id: number) {
    isLoading.value = true;
    try {
      const { data } = await api.get<User>(`/admin/${id}`);
      return data;
    } catch (e: any) {
      notifyError(e.response?.data?.message || 'Ошибка получения пользователя');
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function removeUser(id: number) {
    isLoading.value = true;
    try {
      await api.delete(`/admin/${id}`);
      users.value = users.value.filter((u) => u.id !== id);
      notifySuccess('Пользователь удалён');
    } catch (e: any) {
      notifyError(
        e.response?.data?.message || 'Ошибка при удалении пользователя'
      );
    } finally {
      isLoading.value = false;
    }
  }

  async function updateUser(id: number, payload: UpdateUserPayload) {
    isLoading.value = true;
    try {
      const { data } = await api.put<{ message: string; updated: User }>(
        `/admin/${id}`,
        payload
      );
      const idx = users.value.findIndex((u) => u.id === id);
      if (idx !== -1)
        users.value[idx] = { ...users.value[idx], ...data.updated };
      notifySuccess('Пользователь обновлён');
    } catch (e: any) {
      notifyError(
        e.response?.data?.message || 'Ошибка при обновлении пользователя'
      );
    } finally {
      isLoading.value = false;
    }
  }

  async function assignRole(payload: AssignRolePayload) {
    isLoading.value = true;
    try {
      const { data } = await api.post<{ message: string }>(
        '/admin/assign-role',
        payload
      );
      notifySuccess(data.message);
      if (users.value.length) {
        await fetchUsers();
      }
    } catch (e: any) {
      notifyError(e.response?.data?.message || 'Ошибка при назначении роли');
    } finally {
      isLoading.value = false;
    }
  }

  async function getEmployeesByDistrict(districtId: number) {
    isLoading.value = true;
    try {
      const { data } = await api.get<EmployeeDetails[]>(
        `/admin/district/${districtId}/employees`
      );
      return data;
    } catch (e: any) {
      notifyError(e.response?.data?.message || 'Ошибка получения сотрудников');
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  return {
    users,
    isLoading,
    fetchUsers,
    getUserById,
    removeUser,
    updateUser,
    assignRole,
    getEmployeesByDistrict,
  };
});
