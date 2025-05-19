import { defineStore } from 'pinia';
import api from '@/services/api';
import { AuthState, User, Meta } from '@/types';
import router from '@/router';
import { ElNotification } from 'element-plus';
import { useUiStore } from './useUiStore';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState & { selectedUser: User | null } => ({
    user: null,
    token: localStorage.getItem('token'),
    errorMessage: '',
    clients: [],
    meta: { total: 0, page: 1, limit: 10 },
    selectedUser: null,
  }),
  actions: {
    async login(email: string, password: string) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.post('/users/login', { email, password });
        this.token = response.data.token;
        this.user = response.data.user as User;
        localStorage.setItem('token', this.token!);
        router.push('/records');
        ElNotification.success('Вы успешно вошли в систему!');
      } catch (error: any) {
        this.errorMessage =
          error?.response?.data?.message || 'Ошибка при входе';
        ElNotification.error(this.errorMessage);
      } finally {
        uiStore.hideLoader();
      }
    },

    async register(
      name: string,
      email: string,
      password: string,
      phone: string
    ) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.post('/users/signup', {
          name,
          email,
          password,
          phone,
        });
        this.token = response.data.token;
        await this.getUserProfile();
        localStorage.setItem('token', this.token!);
        router.push('/records');
        ElNotification.success('Регистрация прошла успешно!');
      } catch (error: any) {
        this.errorMessage =
          error?.response?.data?.message || 'Ошибка при регистрации';
        ElNotification.error(this.errorMessage);
      } finally {
        uiStore.hideLoader();
      }
    },

    async getUserProfile() {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const response = await api.get('/users/profile');
        this.user = response.data as User;
      } catch (error: any) {
        this.errorMessage =
          error?.response?.data?.message || 'Ошибка при загрузке профиля';
        ElNotification.error(this.errorMessage);
        this.logout();
      } finally {
        uiStore.hideLoader();
      }
    },

    async updateUserProfile(details: Partial<User>) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.put('/users/profile', details);
        await this.getUserProfile();
        ElNotification.success('Профиль обновлён');
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || 'Не удалось обновить профиль'
        );
        throw error;
      } finally {
        uiStore.hideLoader();
      }
    },

    async deleteUser() {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.delete('/users/profile');
        ElNotification.success('Пользователь удалён');
        this.logout();
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || 'Не удалось удалить пользователя'
        );
      } finally {
        uiStore.hideLoader();
      }
    },

    // Теперь отправляем запрос logout на сервер
    async logout() {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.post('/users/logout');
      } catch (error: any) {
        console.warn('Logout request failed:', error);
      } finally {
        this.user = null;
        this.token = null;
        this.errorMessage = '';
        localStorage.removeItem('token');
        router.push('/login');
        uiStore.hideLoader();
      }
    },

    async assignRoleToUser(email: string, role: string) {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        await api.post('/users/promote', { email, role });
        ElNotification.success('Роль успешно назначена');
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message ||
            'Не удалось назначить роль пользователю'
        );
      } finally {
        uiStore.hideLoader();
      }
    },

    async fetchAllUsers(page = 1, limit = 10, role = 'user') {
      const uiStore = useUiStore();
      uiStore.showLoader();
      try {
        const params: any = { page, limit, role };
        const response = await api.get('/admin', { params });
        this.clients = response.data.users;
        this.meta = response.data.meta as Meta;
      } catch (error: any) {
        ElNotification.error(
          error?.response?.data?.message || 'Не удалось загрузить клиентов'
        );
      } finally {
        uiStore.hideLoader();
      }
    },

    async fetchUserById(id: number) {
      const ui = useUiStore();
      ui.showLoader();
      try {
        const res = await api.get(`/admin/${id}`);
        this.selectedUser = res.data as User;
        return this.selectedUser;
      } catch (e: any) {
        ElNotification.error(
          e.response?.data?.message || 'Не удалось загрузить пользователя'
        );
        throw e;
      } finally {
        ui.hideLoader();
      }
    },

    /** Обновить пользователя (PUT /admin/:id) */
    async updateUserById(id: number, payload: Partial<User>) {
      const ui = useUiStore();
      ui.showLoader();
      try {
        await api.put(`/admin/${id}`, payload);
        ElNotification.success('Пользователь обновлён');
        // обновим список, если нужно
        await this.fetchAllUsers(
          this.meta.page,
          this.meta.limit,
          'local_admin'
        );
      } catch (e: any) {
        ElNotification.error(
          e.response?.data?.message || 'Не удалось обновить пользователя'
        );
        throw e;
      } finally {
        ui.hideLoader();
      }
    },

    /** Удалить пользователя (DELETE /admin/:id) */
    async deleteUserById(id: number) {
      const ui = useUiStore();
      ui.showLoader();
      try {
        await api.delete(`/admin/${id}`);
        ElNotification.success('Пользователь удалён');
        // выкинем из локального массива, чтобы сразу ушёл из списка
        this.clients = this.clients.filter((u) => u.id !== id);
      } catch (e: any) {
        ElNotification.error(
          e.response?.data?.message || 'Не удалось удалить пользователя'
        );
        throw e;
      } finally {
        ui.hideLoader();
      }
    },
  },
});
