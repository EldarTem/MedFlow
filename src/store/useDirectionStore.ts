import { defineStore } from 'pinia';
import api from '@/services/api'; // Предполагается, что api настроен
import { ElNotification } from 'element-plus';
import { useUiStore } from './useUiStore'; // Для отображения состояния загрузки

export interface Direction {
  id: number;
  name: string;
  description: string;
  requirements: string;
  category_id: number;
}

export const useDirectionStore = defineStore('directions', {
  state: () => ({
    directions: [] as Direction[], // список направлений
    direction: null as Direction | null, // одно выбранное направление
  }),
  actions: {
    // Получение всех направлений
    async getAllDirections() {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.get('/dir'); // Вызов API для получения всех направлений
        this.directions = response.data;
      } catch (error) {
        ElNotification.error('Ошибка при получении направлений');
      } finally {
        uiStore.hideLoader();
      }
    },

    // Получение направления по ID
    async getDirectionById(id: number) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.get(`/dir/${id}`); // Вызов API для получения направления по ID
        this.direction = response.data;
      } catch (error) {
        ElNotification.error('Ошибка при получении направления');
      } finally {
        uiStore.hideLoader();
      }
    },

    // Создание нового направления
    async createDirection(direction: Partial<Direction>) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.post('/dir', direction); // Вызов API для создания направления
        ElNotification.success('Направление успешно создано');
        this.directions.push(response.data.direction); // Добавляем новое направление в список
      } catch (error) {
        ElNotification.error('Ошибка при создании направления');
      } finally {
        uiStore.hideLoader();
      }
    },

    // Обновление направления
    async updateDirection(direction: Direction) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.put(`/dir/${direction.id}`, direction); // Вызов API для обновления направления
        ElNotification.success('Направление успешно обновлено');
        const index = this.directions.findIndex((d) => d.id === direction.id);
        if (index !== -1) {
          this.directions[index] = response.data.updatedDirection; // Обновляем направление в списке
        }
      } catch (error) {
        ElNotification.error('Ошибка при обновлении направления');
      } finally {
        uiStore.hideLoader();
      }
    },

    // Удаление направления
    async deleteDirection(id: number) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.delete(`/dir/${id}`); // Вызов API для удаления направления
        ElNotification.success('Направление успешно удалено');
        this.directions = this.directions.filter((d) => d.id !== id); // Удаляем направление из списка
      } catch (error) {
        ElNotification.error('Ошибка при удалении направления');
      } finally {
        uiStore.hideLoader();
      }
    },
  },
});
