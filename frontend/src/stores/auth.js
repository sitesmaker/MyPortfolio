// src/stores/auth.js
import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        isAuthenticated: false,
        loading: false,
        initialized: false
    }),

    getters: {
        currentUser: (state) => state.user,
        isAuth: (state) => state.isAuthenticated,
        isLoading: (state) => state.loading
    },

    actions: {
        // Инициализация при загрузке приложения
        async init() {
            // Если уже инициализированы - выходим
            if (this.initialized) {
                console.log('✓ Auth уже инициализирован');
                return;
            }

            // Если идет загрузка - ждем
            if (this.loading) {
                console.log('⏳ Auth инициализируется...');
                return;
            }

            console.log('🔄 Инициализация auth...');
            this.loading = true;

            try {
                // Пытаемся получить текущего пользователя
                await this.fetchUser();
            } catch (error) {
                console.error('Ошибка инициализации:', error);
            } finally {
                this.initialized = true;
                this.loading = false;
            }
        },

        // Логин
        async login(credentials) {
            // Защита от множественных вызовов
            if (this.loading) {
                throw new Error('Login already in progress');
            }

            try {
                this.loading = true;
                console.log('🔄 Выполняется вход...');

                // Шаг 1: Получаем CSRF cookie (через прокси)
                await api.get('/sanctum/csrf-cookie');

                // Шаг 2: Отправляем логин (через прокси)
                const response = await api.post('/api/login', credentials);

                // Шаг 3: Сохраняем пользователя
                if (response.data.user) {
                    this.user = response.data.user;
                    this.isAuthenticated = true;
                } else {
                    // Если пользователь не пришел в ответе, получаем отдельно
                    await this.fetchUser();
                }

                console.log('✓ Вход выполнен успешно');
                return response;

            } catch (error) {
                console.error('✗ Ошибка входа:', error.response?.data || error.message);
                this.user = null;
                this.isAuthenticated = false;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Получение текущего пользователя
        async fetchUser() {
            // Если пользователь уже загружен и авторизован - не делаем запрос
            if (this.isAuthenticated && this.user) {
                console.log('✓ Пользователь уже загружен');
                return this.user;
            }

            // Если уже идет загрузка - не делаем новый запрос
            if (this.loading) {
                console.log('⏳ Загрузка уже идет...');
                return;
            }

            try {
                this.loading = true;
                console.log('🔄 Запрос пользователя...');

                const response = await api.get('/api/user');

                this.user = response.data;
                this.isAuthenticated = true;

                console.log('✓ Пользователь загружен:', this.user.email);
                return this.user;

            } catch (error) {
                // 401 - не авторизован (это нормально)
                if (error.response?.status === 401) {
                    console.log('👤 Пользователь не авторизован');
                } else {
                    console.error('Ошибка при загрузке пользователя:', error);
                }

                this.user = null;
                this.isAuthenticated = false;
                return null;

            } finally {
                this.loading = false;
            }
        },

        // Выход
        async logout() {
            try {
                this.loading = true;
                console.log('🔄 Выход из системы...');

                await api.post('/api/logout');

                console.log('✓ Выход выполнен');

            } catch (error) {
                console.error('Ошибка при выходе:', error);
            } finally {
                this.user = null;
                this.isAuthenticated = false;
                this.initialized = true;
                this.loading = false;
            }
        },

        // Сброс состояния (полезно для тестирования)
        reset() {
            this.user = null;
            this.isAuthenticated = false;
            this.loading = false;
            this.initialized = false;
        }
    }
});