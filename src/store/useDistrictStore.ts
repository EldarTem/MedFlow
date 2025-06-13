import { defineStore } from 'pinia';
import { ref } from 'vue';
import { notifyError, notifySuccess } from '@/utils/notify';
import type {
  District,
  CreateDistrictPayload,
  UpdateDistrictPayload,
} from '@/types';
import api from '@/services/api';

export const useDistrictStore = defineStore('district', () => {
  const districts = ref<District[]>([]);
  const isLoading = ref(false);

  async function fetchDistricts() {
    isLoading.value = true;
    try {
      const { data } = await api.get<District[] | { districts: District[] }>(
        '/districts'
      );
      console.log('Districts API response:', data);
      districts.value = Array.isArray(data) ? data : data.districts || [];
      console.log('Assigned districts:', districts.value);
    } catch (e: any) {
      console.error('Fetch districts error:', e);
      notifyError(e.response?.data?.message || 'Ошибка загрузки районов');
      districts.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function createDistrict(payload: CreateDistrictPayload) {
    isLoading.value = true;
    try {
      const { data } = await api.post<District>('/districts', payload);
      districts.value.push(data);
      notifySuccess('Район добавлен');
    } catch (e: any) {
      notifyError(e.response?.data?.message || 'Ошибка при создании района');
    } finally {
      isLoading.value = false;
    }
  }

  async function updateDistrict(id: number, payload: UpdateDistrictPayload) {
    isLoading.value = true;
    try {
      const { data } = await api.put<District>(`/districts/${id}`, payload);
      const idx = districts.value.findIndex((d) => d.id === id);
      if (idx !== -1) districts.value[idx] = data;
      notifySuccess('Район обновлён');
    } catch (e: any) {
      notifyError(e.response?.data?.message || 'Ошибка при обновлении района');
    } finally {
      isLoading.value = false;
    }
  }

  async function removeDistrict(id: number) {
    isLoading.value = true;
    try {
      await api.delete(`/districts/${id}`);
      districts.value = districts.value.filter((d) => d.id !== id);
      notifySuccess('Район удалён');
    } catch (e: any) {
      notifyError(e.response?.data?.message || 'Ошибка при удалении района');
    } finally {
      isLoading.value = false;
    }
  }

  return {
    districts,
    isLoading,
    fetchDistricts,
    createDistrict,
    updateDistrict,
    removeDistrict,
  };
});
