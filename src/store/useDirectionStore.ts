import { defineStore } from 'pinia';
import { ref } from 'vue';
import { notifyError, notifySuccess } from '@/utils/notify';
import type {
  Direction,
  CreateDirectionPayload,
  UpdateDirectionPayload,
} from '@/types';
import api from '@/services/api';

// Преобразование snake_case в camelCase для одного направления
function normalizeDirection(dir: any): Direction {
  return {
    id: dir.id,
    name: dir.name,
    description: dir.description,
    isActive: dir.isActive ?? dir.is_active,
    categoryId: dir.categoryId ?? dir.category_id, // вот это ключ!
    districtId: dir.districtId ?? dir.district_id, // если используешь

  };
}

export const useDirectionStore = defineStore('direction', () => {
  const directions = ref<Direction[]>([]);
  const isLoading = ref(false);

  async function fetchDirections() {
    if (isLoading.value || directions.value.length > 0) return;
    isLoading.value = true;
    try {
      const { data } = await api.get<Direction[] | { directions: Direction[] }>(
        '/dir'
      );
      const rawList = Array.isArray(data) ? data : data.directions || [];
      directions.value = rawList.map(normalizeDirection);
      // Теперь directions.value только с categoryId, никаких category_id
      console.log('Assigned directions:', directions.value);
    } catch (e: any) {
      console.error('Fetch directions error:', e);
      notifyError(e.response?.data?.message || 'Ошибка загрузки направлений');
      directions.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchDirectionById(id: number) {
    isLoading.value = true;
    try {
      const { data } = await api.get<Direction>(`/dir/${id}`);
      directions.value = data ? [normalizeDirection(data)] : [];
    } catch (e: any) {
      directions.value = [];
      notifyError(e.response?.data?.message || 'Ошибка загрузки направления');
    } finally {
      isLoading.value = false;
    }
  }

  async function createDirection(payload: CreateDirectionPayload) {
    isLoading.value = true;
    try {
      const { data } = await api.post<Direction>('/dir', payload);
      directions.value.push(normalizeDirection(data));
      notifySuccess('Направление добавлено');
    } catch (e: any) {
      notifyError(
        e.response?.data?.message || 'Ошибка при создании направления'
      );
    } finally {
      isLoading.value = false;
    }
  }

  async function updateDirection(id: number, payload: UpdateDirectionPayload) {
    isLoading.value = true;
    try {
      const { data } = await api.put<Direction>(`/dir/${id}`, payload);
      const idx = directions.value.findIndex((d) => d.id === id);
      if (idx !== -1) directions.value[idx] = normalizeDirection(data);
      notifySuccess('Направление обновлено');
    } catch (e: any) {
      notifyError(
        e.response?.data?.message || 'Ошибка при обновлении направления'
      );
    } finally {
      isLoading.value = false;
    }
  }

  async function removeDirection(id: number) {
    isLoading.value = true;
    try {
      await api.delete(`/dir/${id}`);
      directions.value = directions.value.filter((d) => d.id !== id);
      notifySuccess('Направление удалено');
    } catch (e: any) {
      notifyError(
        e.response?.data?.message || 'Ошибка при удалении направления'
      );
    } finally {
      isLoading.value = false;
    }
  }

  return {
    directions,
    isLoading,
    fetchDirections,
    createDirection,
    updateDirection,
    removeDirection,
    fetchDirectionById,
  };
});
