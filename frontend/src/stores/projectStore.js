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
        
        // ДОБАВЛЕНО: Отправляем ID существующих изображений, которые нужно сохранить
        if (projectData.images && projectData.images.length > 0) {
            // Отправляем только те изображения, которые не помечены на удаление
            const existingImages = projectData.images
                .filter(img => !img.isNew && !projectData.deleted_images?.includes(img.id))
                .map(img => img.id)
            
            if (existingImages.length > 0) {
                formData.append('existing_images', JSON.stringify(existingImages))
            }
        }

        // ДОБАВЛЕНО: Отправляем ID удаленных изображений
        if (projectData.deleted_images && projectData.deleted_images.length > 0) {
            formData.append('deleted_images', JSON.stringify(projectData.deleted_images))
        }
        
        // Добавляем новые файлы (если есть)
        if (projectData.new_files && projectData.new_files.length > 0) {
            projectData.new_files.forEach((file, index) => {
                formData.append(`images[${index}]`, file)
            })
        }

        // Добавляем метод для Laravel
        formData.append('_method', 'PUT')
        
        // Отправляем POST запрос с FormData
        const response = await api.post(`/api/project/${projectData.id}`, formData, {
            headers: {
                'Accept': 'application/json'
            }
        })

        console.log('✅ Update successful:', response.data)
        
        responseMessage.value = 'Проект успешно обновлен!'
        await fetchProjects()
        
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