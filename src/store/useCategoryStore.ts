import { defineStore } from 'pinia';
import { ref } from 'vue';
import { notifyError, notifySuccess } from '@/utils/notify';
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '@/types';
import api from '@/services/api';

// Преобразование snake_case в camelCase для одной категории
function normalizeCategory(cat: any): Category {
  return {
    id: cat.id,
    name: cat.name,
    description: cat.description,
    isActive: cat.isActive ?? cat.is_active, // если приходит is_active
    districtId: cat.districtId ?? cat.district_id, // вот это ключ!
  };
}

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([]);
  const isLoading = ref(false);

  async function fetchCategories() {
    if (isLoading.value || categories.value.length > 0) return;
    isLoading.value = true;
    try {
      const { data } = await api.get<Category[] | { categories: Category[] }>(
        '/categories'
      );
      const rawList = Array.isArray(data) ? data : data.categories || [];
      categories.value = rawList.map(normalizeCategory);
      // Теперь ВСЕ categories.value — только с districtId, никаких district_id
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
      categories.value.push(normalizeCategory(data));
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
      if (idx !== -1) categories.value[idx] = normalizeCategory(data);
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
