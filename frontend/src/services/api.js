// src/services/api.js
import axios from 'axios'

// Единый клиент для всех запросов
const api = axios.create({
    baseURL: '', // Пустой baseURL, потому что используем прокси
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
})

// Логирование запросов (опционально, для отладки)
api.interceptors.request.use(request => {
    console.log(`🌐 [${request.method.toUpperCase()}] ${request.url}`, request.data || '');
    return request;
});

api.interceptors.response.use(
    response => {
        console.log(`✅ [${response.status}] ${response.config.url}`);
        return response;
    },
    error => {
        console.error(`❌ [${error.response?.status}] ${error.config?.url}`, error.response?.data);
        return Promise.reject(error);
    }
);

export default api;