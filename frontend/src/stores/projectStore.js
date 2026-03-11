// src/stores/projectStore.js
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import api from '@/services/api'

export const useProjectStore = defineStore('project', () => {
  const projects = ref([])
  const projectsAdmin = ref([])
  const currentProject = ref(null)
  const loading = ref(false)
  const responseMessage = ref('')
  
  const formDataProject = reactive({
    title: '',
    description: '',
    content: '',
    technologies: '',
    live_url: '',
    files: [],
    deleted_images: [],
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

  const fetchProjectsAdmin = async () => {
    loading.value = true
    try {
      const response = await api.get('/api/admin/projects')
      projectsAdmin.value = response.data
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
        formDataProject.files.forEach((item) => {
          // Используем images[] для всех файлов
          console.log(item)
          formData.append(`images[]`, item)
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
      await fetchProjectsAdmin()
      
      return response.data

    } catch (error) {
      console.error('Error creating project:', error)
      responseMessage.value = error.response?.data?.message || 'Ошибка при создании проекта'
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateProject = async (projectData) => {
    loading.value = true
    responseMessage.value = ''
    
    try {
        console.log('🔄 Updating project:', projectData)
        
        const formData = new FormData()
        
        // Добавляем все поля
        formData.append('title', projectData.title || '')
        formData.append('description', projectData.description || '')
        formData.append('content', projectData.content || '')
        formData.append('technologies', projectData.technologies || '')
        formData.append('live_url', projectData.live_url || '')
        formData.append('is_published', projectData.is_published ? '1' : '0')
        
        // ИСПРАВЛЕНО: Для одиночного изображения используем imageData из компонента
        if (projectData.imageData) {
            // Добавляем новое изображение если есть
            if (projectData.imageData.newFile) {
                formData.append('image', projectData.imageData.newFile)
            }
            
            // Добавляем ID удаленного изображения если есть
            if (projectData.imageData.deletedId) {
                formData.append('deleted_image', projectData.imageData.deletedId)
            }
        }

        // Добавляем метод для Laravel
        formData.append('_method', 'PUT')
        
        // Отправляем POST запрос с FormData
        const response = await api.post(`/api/project/${projectData.id}`, formData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        })

        console.log('✅ Update successful:', response.data)
        
        responseMessage.value = 'Проект успешно обновлен!'

        console.log(response.data.project)
        
        if (response.data.project) {
          const index = projectsAdmin.value.findIndex(p => p.id === response.data.project.id)
          if (index !== -1) {
              // Просто заменяем объект в массиве - Vue реактивность сработает
              projectsAdmin.value[index] = response.data.project
              console.log(projectsAdmin)
          }
        }
        
        return response.data

    } catch (error) {
        console.error('❌ Update failed:', error)
        console.error('Error details:', error.response?.data)
        
        if (error.response?.data?.errors) {
            const errors = Object.values(error.response.data.errors).flat()
            responseMessage.value = errors.join(', ')
        } else {
            responseMessage.value = error.response?.data?.message || 'Ошибка при обновлении проекта'
        }
        
        throw error
    } finally {
        loading.value = false
    }
  }

  const deleteProject = async (id) => {
    loading.value = true
    try {
      const response = await api.delete(`/api/project/${id}`)
      responseMessage.value = 'Проект удален'
      await fetchProjectsAdmin()
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
    projectsAdmin,
    currentProject,
    formDataProject,
    loading,
    responseMessage,
    fetchProjects,
    fetchProjectsAdmin,
    fetchProjectBySlug,
    createProject,
    updateProject,
    deleteProject,
    resetForm,
    loadProjectToForm
  }
})