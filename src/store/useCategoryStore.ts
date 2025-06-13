import { defineStore } from 'pinia';
import { ref } from 'vue';
import { notifyError, notifySuccess } from '@/utils/notify';
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '@/types';
import api from '@/services/api';

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([]);
  const isLoading = ref(false);

  async function fetchCategories(districtId?: number) {
    if (isLoading.value || (categories.value.length > 0 && !districtId)) return; // Избегаем повторных запросов
    isLoading.value = true;
    try {
      const { data } = await api.get<Category[] | { categories: Category[] }>(
        '/categories',
        {
          params: { districtId },
        }
      );
      console.log('Categories API response:', data);
      categories.value = Array.isArray(data) ? data : data.categories || [];
      console.log('Assigned categories:', categories.value);
    } catch (e: any) {
      console.error('Fetch categories error:', e);
      notifyError(e.response?.data?.message || 'Ошибка загрузки категорий');
      categories.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function createCategory(payload: CreateCategoryPayload) {
    isLoading.value = true;
    try {
      const { data } = await api.post<Category>('/categories', payload);
      categories.value.push(data);
      notifySuccess('Категория добавлена');
    } catch (e: any) {
      notifyError(e.response?.data?.message || 'Ошибка при создании категории');
    } finally {
      isLoading.value = false;
    }
  }

  async function updateCategory(id: number, payload: UpdateCategoryPayload) {
    isLoading.value = true;
    try {
      const { data } = await api.put<Category>(`/categories/${id}`, payload);
      const idx = categories.value.findIndex((c) => c.id === id);
      if (idx !== -1) categories.value[idx] = data;
      notifySuccess('Категория обновлена');
    } catch (e: any) {
      notifyError(
        e.response?.data?.message || 'Ошибка при обновлении категории'
      );
    } finally {
      isLoading.value = false;
    }
  }

  async function removeCategory(id: number) {
    isLoading.value = true;
    try {
      await api.delete(`/categories/${id}`);
      categories.value = categories.value.filter((c) => c.id !== id);
      notifySuccess('Категория удалена');
    } catch (e: any) {
      notifyError(e.response?.data?.message || 'Ошибка при удалении категории');
    } finally {
      isLoading.value = false;
    }
  }

  return {
    categories,
    isLoading,
    fetchCategories,
    createCategory,
    updateCategory,
    removeCategory,
  };
});
