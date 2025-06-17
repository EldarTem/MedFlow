import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/store/useAuthStore';

import MainLayout from '@/layouts/MainLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';

const SITE_NAME = 'MedFlow';

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/login' },
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/LoginView.vue'),
        meta: { title: 'Логин' },
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/RegisterView.vue'),
        meta: { title: 'Регистрация' },
      },
    ],
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'records',
        name: 'MyRecords',
        component: () => import('@/views/MyRecords.vue'),
        meta: { title: 'Мои записи' },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/ProfileView.vue'),
        meta: { title: 'Аккаунт' },
      },
      {
        path: 'distcrict',
        name: 'Distcrict',
        component: () => import('@/views/DistcrictPage.vue'),
        meta: { title: 'Отдел' },
      },
      {
        path: 'employee-schedule',
        name: 'TrainerSchedule',
        component: () => import('@/views/EmployeeScheduleView.vue'),
        meta: { title: 'Мой график', allowedRoles: ['employee'] },
      },
      {
        path: 'employee-records',
        name: 'EmployeeRecords',
        component: () => import('@/views/MyRecordsEmployee.vue'),
        meta: { title: 'Мои записи', allowedRoles: ['employee'] },
      },
      {
        path: 'departments',
        name: 'Departments',
        component: () => import('@/views/DepartmentsView.vue'),
        meta: { title: 'Отделы', allowedRoles: ['super_admin'] },
      },
      {
        path: 'not-authorized',
        name: 'NotAuthorized',
        component: () => import('@/views/NotAuthorizedView.vue'),
        meta: { title: 'NotAuthorized' },
      },
      {
        // только один path!
        path: 'clients',
        name: 'Clients',
        component: () => import('@/views/AllClientsView.vue'),
        meta: {
          title: 'Клиенты',
          allowedRoles: ['local_admin', 'super_admin'],
        },
      },

      {
        path: 'archive',
        name: 'Archive',
        component: () => import('@/views/ArchivePage.vue'),
        meta: { title: 'Архив' },
      },
      {
        path: 'archive-employee',
        name: 'ArchiveEmployee',
        component: () => import('@/views/ArchivePageEmployee.vue'),
        meta: { title: 'Архив записей' },
      },
      {
        path: 'employee',
        name: 'Employee',
        component: () => import('@/views/AllEmployeeView.vue'),
        meta: { title: 'Сотрудники' },
      },
      {
        path: 'admins',
        name: 'Admins',
        component: () => import('@/views/AllAdminView.vue'),
        meta: { title: 'Администраторы' },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.token;

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      return next('/login');
    }
    if (!authStore.user) {
      try {
        await authStore.getUserProfile();
      } catch (error) {
        return next('/login');
      }
    }

    if (to.meta.allowedRoles && authStore.user) {
      const allowedRoles = to.meta.allowedRoles as string[];
      if (!allowedRoles.includes(authStore.user.role)) {
        return next('/not-authorized');
      }
    }
  }

  next();
});

router.afterEach((to) => {
  const pageTitle = (to.meta.title as string) || (to.name as string) || '';
  document.title = pageTitle ? `${SITE_NAME} | ${pageTitle}` : SITE_NAME;
});

export default router;
