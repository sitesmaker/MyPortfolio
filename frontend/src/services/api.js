// src/services/api.js
import axios from 'axios'

// Единый клиент для всех запросов
const api = axios.create({
    baseURL: '', // Пустой baseURL, потому что используем прокси
    withCredentials: true,
    https: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
})

// Интерцептор для запросов
api.interceptors.request.use(
    config => {
        // Логируем запросы для отладки
        console.log(`🌐 [${config.method?.toUpperCase()}] ${config.url}`)
        
        // Если это FormData, выводим содержимое для отладки
        if (config.data instanceof FormData) {
            for (let pair of config.data.entries()) {
                if (pair[0] !== 'images[]' && pair[0] !== 'new_images[]') {
                    console.log(`   ${pair[0]}:`, pair[1])
                } else {
                    console.log(`   ${pair[0]}: [File] ${pair[1].name}`)
                }
            }
            
            delete config.headers['Content-Type']
        }
        
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    response => {
        return response
    },
    error => {
        console.error('❌ API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        })
        return Promise.reject(error)
    }
)

export default api