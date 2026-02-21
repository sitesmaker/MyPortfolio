// src/stores/projectStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useProjectStore = defineStore('project', () => {
  const projects = ref([])
  const currentProject = ref(null)
  const loading = ref(false)

  const fetchProjects = async () => {
    loading.value = true
    try {
      const response = await api.get('/projects')
      projects.value = response.data
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchProjectBySlug = async (slug) => {
    loading.value = true
    try {
      const response = await api.get(`/projects/${slug}`)
      currentProject.value = response.data
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      loading.value = false
    }
  }

  return { projects, currentProject, loading, fetchProjects, fetchProjectBySlug }
})