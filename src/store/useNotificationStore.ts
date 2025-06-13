import { defineStore } from 'pinia';
import { ref } from 'vue';
import { notifyError, notifySuccess } from '@/utils/notify';
import type { Notification, CreateNotificationPayload } from '@/types';
import axios from 'axios';

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([]);
  const isLoading = ref(false);

  async function fetchNotifications() {
    isLoading.value = true;
    try {
      const { data } = await axios.get<{ notifications: Notification[] }>(
        '/notifications'
      );
      notifications.value = data.notifications;
    } catch (e: any) {
      notifyError(e.response?.data?.message || 'Ошибка загрузки уведомлений');
    } finally {
      isLoading.value = false;
    }
  }

  async function createNotification(payload: CreateNotificationPayload) {
    isLoading.value = true;
    try {
      const { data } = await axios.post<Notification>(
        '/notifications',
        payload
      );
      notifications.value.unshift(data);
      notifySuccess('Уведомление создано');
    } catch (e: any) {
      notifyError(
        e.response?.data?.message || 'Ошибка при создании уведомления'
      );
    } finally {
      isLoading.value = false;
    }
  }

  async function markAsRead(id: number) {
    isLoading.value = true;
    try {
      const { data } = await axios.patch<Notification>(
        `/notifications/${id}/read`
      );
      const idx = notifications.value.findIndex((n) => n.id === id);
      if (idx !== -1) notifications.value[idx] = data;
      notifySuccess('Уведомление прочитано');
    } catch (e: any) {
      notifyError(
        e.response?.data?.message || 'Ошибка при изменении статуса уведомления'
      );
    } finally {
      isLoading.value = false;
    }
  }

  async function removeNotification(id: number) {
    isLoading.value = true;
    try {
      await axios.delete(`/notifications/${id}`);
      notifications.value = notifications.value.filter((n) => n.id !== id);
      notifySuccess('Уведомление удалено');
    } catch (e: any) {
      notifyError(
        e.response?.data?.message || 'Ошибка при удалении уведомления'
      );
    } finally {
      isLoading.value = false;
    }
  }

  return {
    notifications,
    isLoading,
    fetchNotifications,
    createNotification,
    markAsRead,
    removeNotification,
  };
});
