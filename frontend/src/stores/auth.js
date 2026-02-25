// src/stores/auth.js - БЕЗОПАСНАЯ ВЕРСИЯ
import { defineStore } from 'pinia';
import api from '@/services/api';

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
    },

    actions: {
        async init() {
            if (this.initialized) return;
            
            this.loading = true;
            
            try {
                // Проверяем сессию через cookie (безопасно)
                await this.fetchUser();
            } catch (error) {
                console.error('Init error:', error);
            } finally {
                this.initialized = true;
                this.loading = false;
            }
        },

        async login(credentials) {
            try {
                this.loading = true;
                
                // Sanctum сам установит httpOnly cookie
                await api.get('/sanctum/csrf-cookie');
                const response = await api.post('/api/login', credentials);
                
                // НЕ сохраняем токен в localStorage!
                // Просто получаем пользователя
                await this.fetchUser();
                
                return response;
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchUser() {
            try {
                // Запрос автоматически отправит httpOnly cookie
                const response = await api.get('/api/user');
                
                this.user = response.data;
                this.isAuthenticated = true;
                
                return this.user;
            } catch (error) {
                this.user = null;
                this.isAuthenticated = false;
                throw error;
            }
        },

        async logout() {
            try {
                await api.post('/api/logout');
            } finally {
                this.user = null;
                this.isAuthenticated = false;
            }
        }
    }
});