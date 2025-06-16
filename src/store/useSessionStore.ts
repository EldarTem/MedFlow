// src/store/useSessionStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { notifyError, notifySuccess } from '@/utils/notify';
import type {
  Session,
  CreateSessionPayload,
  UpdateSessionPayload,
} from '@/types';
import api from '@/services/api';

export const useSessionStore = defineStore('session', () => {
  const sessions = ref<Session[]>([]);
  const isLoading = ref(false);

  async function fetchSessions() {
    isLoading.value = true;
    try {
      const { data } = await api.get<Session[] | { sessions: Session[] }>(
        '/sessions'
      );
      console.log('API response:', data);
      sessions.value = Array.isArray(data) ? data : data.sessions || [];
    } catch (e: any) {
      console.error('Fetch sessions error:', e);
      notifyError(e.response?.data?.message || 'Ошибка загрузки записей');
      sessions.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function createSession(payload: CreateSessionPayload) {
    isLoading.value = true;
    try {
      const { data } = await api.post<Session>('/sessions', payload);
      sessions.value.push(data);
      notifySuccess('Запись создана');
    } catch (e: any) {
      notifyError(e.response?.data?.message || 'Ошибка при создании записи');
      throw e; // Пробрасываем ошибку для обработки в компоненте
    } finally {
      isLoading.value = false;
    }
  }

  async function updateSession(id: number, payload: UpdateSessionPayload) {
    isLoading.value = true;
    try {
      const { data } = await api.put<Session>(`/sessions/${id}`, payload);
      const idx = sessions.value.findIndex((s) => s.id === id);
      if (idx !== -1) sessions.value[idx] = data;
      notifySuccess('Запись обновлена');
    } catch (e: any) {
      notifyError(e.response?.data?.message || 'Ошибка при обновлении записи');
    } finally {
      isLoading.value = false;
    }
  }

  async function cancelSession(id: number) {
    isLoading.value = true;
    try {
      await api.patch(`/sessions/${id}/cancel`);
      const idx = sessions.value.findIndex((s) => s.id === id);
      if (idx !== -1) sessions.value[idx].status = 'canceled';
      notifySuccess('Запись отменена');
    } catch (e: any) {
      notifyError(e.response?.data?.message || 'Ошибка при отмене записи');
    } finally {
      isLoading.value = false;
    }
  }

  return {
    sessions,
    isLoading,
    fetchSessions,
    createSession,
    updateSession,
    cancelSession,
  };
});
