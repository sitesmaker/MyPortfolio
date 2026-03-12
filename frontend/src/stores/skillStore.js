// src/stores/skillStore.js
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import api from '@/services/api'

export const useSkillStore = defineStore('skill', () => {
  const skills = ref([])
  const skillsAdmin = ref([]);
  const loading = ref(false)
  const responseMessage = ref('');

  const formDataSkill = reactive({
    name: '',
    proficiency	: '',
    icon: '',
    is_published: '',
  })

  const fetchSkills = async () => {
    loading.value = true
    try {
      const response = await api.get('/api/skills')
      skills.value = response.data
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchSkillsAdmin = async () => {
    loading.value = true
    try {
      const response = await api.get('/api/admin/skills')
      skillsAdmin.value = response.data
    } catch (error) {
      console.error('Error fetching projects:', error)
      responseMessage.value = 'Ошибка при загрузке проектов'
    } finally {
      loading.value = false
    }
  }

  const createSkill = async () => {
    loading.value = true
    responseMessage.value = ''
    
    try {
      // СОЗДАЕМ FormData ПРАВИЛЬНО
      const formData = new FormData()
      
      // Добавляем все текстовые поля
      formData.append('name', formDataSkill.name)
      
      // Добавляем файлы (ВАЖНО: добавляем как массив)
 

      // Отправляем запрос
      const response = await api.post('/api/admin/skills', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      responseMessage.value = 'Скилл успешно создан!'
      
      // Очищаем форму после успешного создания
      resetForm()
      
      // Обновляем список проектов
      await fetchSkillsAdmin()
      
      return response.data

    } catch (error) {
      console.error('Error creating project:', error)
      responseMessage.value = error.response?.data?.message || 'Ошибка при создании скила'
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    skills,
    skillsAdmin,
    formDataSkill,
    loading,
    fetchSkills,
    fetchSkillsAdmin,
    createSkill,
  }
})