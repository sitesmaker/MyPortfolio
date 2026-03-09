// src/stores/projectStore.js
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import api from '@/services/api'

export const useProjectStore = defineStore('project', () => {
  const projects = ref([])
  const currentProject = ref(null)
  const loading = ref(false)
  const responseMessage = ref('')
  
  const formDataProject = reactive({
    title: '',
    description: '',
    content: '',
    technologies: '',
    live_url: '',
    files: [], // Здесь хранятся объекты с file и preview
  })

  const fetchProjects = async () => {
    loading.value = true
    try {
      const response = await api.get('/api/projects')
      projects.value = response.data
    } catch (error) {
      console.error('Error fetching projects:', error)
      responseMessage.value = 'Ошибка при загрузке проектов'
    } finally {
      loading.value = false
    }
  }

  const fetchProjectBySlug = async (slug) => {
    loading.value = true
    try {
      const response = await api.get(`/api/projects/${slug}`)
      currentProject.value = response.data
    } catch (error) {
      console.error('Error fetching project:', error)
      responseMessage.value = 'Ошибка при загрузке проекта'
    } finally {
      loading.value = false
    }
  }

  const createProject = async () => {
    loading.value = true
    responseMessage.value = ''
    
    try {
      // СОЗДАЕМ FormData ПРАВИЛЬНО
      const formData = new FormData()
      
      // Добавляем все текстовые поля
      formData.append('title', formDataProject.title)
      formData.append('description', formDataProject.description)
      formData.append('content', formDataProject.content)
      formData.append('technologies', formDataProject.technologies)
      formData.append('live_url', formDataProject.live_url)
      
      // Добавляем файлы (ВАЖНО: добавляем как массив)
      if (formDataProject.files && formDataProject.files.length > 0) {
        formDataProject.files.forEach((item, index) => {
          // Ключ должен быть images[], чтобы Laravel понял как массив
          formData.append(`images[${index}]`, item.file)
        })
      }

      // Отправляем запрос
      const response = await api.post('/api/project', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      responseMessage.value = 'Проект успешно создан!'
      
      // Очищаем форму после успешного создания
      resetForm()
      
      // Обновляем список проектов
      await fetchProjects()
      
      return response.data

    } catch (error) {
      console.error('Error creating project:', error)
      responseMessage.value = error.response?.data?.message || 'Ошибка при создании проекта'
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateProject = async (id) => {
    loading.value = true
    responseMessage.value = ''
    
    try {
      const formData = new FormData()
      
      // Добавляем текстовые поля
      formData.append('title', formDataProject.title)
      formData.append('description', formDataProject.description)
      formData.append('content', formDataProject.content)
      formData.append('technologies', formDataProject.technologies)
      formData.append('live_url', formDataProject.live_url)
      
      // Добавляем новые файлы (если есть)
      if (formDataProject.files && formDataProject.files.length > 0) {
        formDataProject.files.forEach((item, index) => {
          if (item.file instanceof File) {
            formData.append(`images[${index}]`, item.file)
          }
        })
      }

      // Для PUT запроса нужно использовать _method или axios.put
      formData.append('_method', 'PUT')
      
      const response = await api.post(`/api/project/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      responseMessage.value = 'Проект успешно обновлен!'
      await fetchProjects()
      
      return response.data

    } catch (error) {
      console.error('Error updating project:', error)
      responseMessage.value = error.response?.data?.message || 'Ошибка при обновлении проекта'
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteProject = async (id) => {
    if (!confirm('Удалить проект?')) return
    
    loading.value = true
    try {
      const response = await api.delete(`/api/project/${id}`)
      responseMessage.value = 'Проект удален'
      await fetchProjects()
      return response.data
    } catch (error) {
      console.error('Error deleting project:', error)
      responseMessage.value = 'Ошибка при удалении'
      throw error
    } finally {
      loading.value = false
    }
  }

  // Вспомогательная функция для сброса формы
  const resetForm = () => {
    formDataProject.title = ''
    formDataProject.description = ''
    formDataProject.content = ''
    formDataProject.technologies = ''
    formDataProject.live_url = ''
    formDataProject.files = []
  }

  // Функция для загрузки данных проекта в форму (для редактирования)
  const loadProjectToForm = (project) => {
    formDataProject.title = project.title || ''
    formDataProject.description = project.description || ''
    formDataProject.content = project.content || ''
    formDataProject.technologies = project.technologies || ''
    formDataProject.live_url = project.live_url || ''
    formDataProject.files = [] // Файлы нужно загружать отдельно
  }

  return {
    projects,
    currentProject,
    formDataProject,
    loading,
    responseMessage,
    fetchProjects,
    fetchProjectBySlug,
    createProject,
    updateProject,
    deleteProject,
    resetForm,
    loadProjectToForm
  }
})