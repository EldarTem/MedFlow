// src/store/useDistrictStore.ts
import { defineStore } from 'pinia';
import api from '@/services/api'; // предполагается, что api настроен для отправки запросов на ваш сервер
import { ElNotification } from 'element-plus';
import { useUiStore } from './useUiStore'; // предполагается, что у вас есть useUiStore для отображения загрузки

// Типизация для District
export interface District {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export const useDistrictStore = defineStore('district', {
  state: () => ({
    districts: [] as District[], // список всех отделов
    district: null as District | null, // один выбранный отдел
  }),
  actions: {
    // Создание нового отдела
    async createDistrict(district: Partial<District>) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.post('/districts', district); // вызов API для создания отдела
        ElNotification.success('Отдел успешно добавлен');
        this.districts.push(response.data.district); // добавляем созданный отдел в список
      } catch (error) {
        ElNotification.error('Ошибка при создании отдела');
      } finally {
        uiStore.hideLoader();
      }
    },

    // Получение всех отделов
    async getAllDistricts() {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.get('/districts'); // вызов API для получения всех отделов
        this.districts = response.data;
      } catch (error) {
        ElNotification.error('Ошибка при получении отделов');
      } finally {
        uiStore.hideLoader();
      }
    },

    // Получение отдела по ID
    async getDistrictById(id: number) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.get(`/districts/${id}`); // вызов API для получения одного отдела
        this.district = response.data;
      } catch (error) {
        ElNotification.error('Ошибка при получении отдела');
      } finally {
        uiStore.hideLoader();
      }
    },

    // Обновление информации об отделе
    async updateDistrict(district: District) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.put(`/districts/${district.id}`, district); // вызов API для обновления отдела
        ElNotification.success('Отдел успешно обновлён');
        const index = this.districts.findIndex((d) => d.id === district.id);
        if (index !== -1) {
          this.districts[index] = response.data.updatedDistrict; // обновляем информацию об отделе в списке
        }
      } catch (error) {
        ElNotification.error('Ошибка при обновлении отдела');
      } finally {
        uiStore.hideLoader();
      }
    },

    // Удаление отдела
    async deleteDistrict(id: number) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.delete(`/districts/${id}`); // вызов API для удаления отдела
        ElNotification.success('Отдел успешно удалён');
        this.districts = this.districts.filter((d) => d.id !== id); // удаляем из списка
      } catch (error) {
        ElNotification.error('Ошибка при удалении отдела');
      } finally {
        uiStore.hideLoader();
      }
    },
  },
});
