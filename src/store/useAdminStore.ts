import { defineStore } from 'pinia';
import api from '@/services/api';
import { ElNotification } from 'element-plus';
import { useUiStore } from './useUiStore';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    users: [] as any[],
    meta: { total: 0, page: 1, limit: 10 },
    selectedUser: null as any,
  }),
  actions: {
    // Получение всех пользователей (администратор)
    async fetchAllUsers(page = 1, limit = 10) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const params = { page, limit };
        const response = await api.get('/admin/district/${id}/employess', {
          params,
        });
        this.users = response.data.users;
        this.meta = response.data.meta;
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || 'Не удалось загрузить пользователей'
        );
      } finally {
        uiStore.hideLoader();
      }
    },

    // Получение пользователя по ID (администратор)
    async fetchUserById(id: number) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.get(`/admin/${id}`);
        this.selectedUser = response.data;
        return this.selectedUser;
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || 'Не удалось загрузить пользователя'
        );
        throw error;
      } finally {
        uiStore.hideLoader();
      }
    },

    // Обновить пользователя по ID
    async updateUserById(id: number, payload: Partial<any>) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.put(`/admin/${id}`, payload);
        ElNotification.success('Пользователь обновлён');
        await this.fetchAllUsers(this.meta.page, this.meta.limit);
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || 'Не удалось обновить пользователя'
        );
      } finally {
        uiStore.hideLoader();
      }
    },

    // Удалить пользователя по ID
    async deleteUserById(id: number) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.delete(`/admin/${id}`);
        ElNotification.success('Пользователь удалён');
        this.users = this.users.filter((user) => user.id !== id);
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || 'Не удалось удалить пользователя'
        );
      } finally {
        uiStore.hideLoader();
      }
    },
  },
});
