// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresGuest: true } // Только для гостей
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Флаг для предотвращения множественных проверок
let isAuthChecking = false;

// Глобальный guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  console.log('📍 Навигация:', to.path);

  // Защита от параллельных проверок
  if (isAuthChecking) {
    console.log('⏳ Проверка авторизации уже выполняется, ждем...');
    await new Promise(resolve => setTimeout(resolve, 100));
    return next();
  }

  try {
    isAuthChecking = true;

    // Если store не инициализирован - инициализируем
    if (!authStore.initialized) {
      console.log('🔄 Инициализация auth в роутере...');
      await authStore.init();
    }

    const isAuthenticated = authStore.isAuthenticated;

    console.log('🔐 Статус авторизации:', isAuthenticated);
    console.log('👤 Текущий пользователь:', authStore.user?.email || 'не авторизован');

    // Маршруты, требующие авторизации
    if (to.meta.requiresAuth && !isAuthenticated) {
      console.log('⛔ Требуется авторизация, редирект на /login');
      next({
        name: 'login',
        query: { redirect: to.fullPath } // Сохраняем исходный URL
      });
    }
    // Маршруты только для гостей (например, логин)
    else if (to.meta.requiresGuest && isAuthenticated) {
      console.log('👤 Уже авторизован, редирект на /dashboard');
      next({ name: 'dashboard' });
    }
    // Все остальные случаи
    else {
      console.log('✅ Доступ разрешен');
      next();
    }

  } catch (error) {
    console.error('❌ Ошибка в роутере:', error);
    // В случае ошибки отправляем на логин
    next({ name: 'login' });
  } finally {
    isAuthChecking = false;
  }
});

// После каждого перехода
router.afterEach((to) => {
  console.log('✅ Навигация завершена:', to.path);
});

export default router;