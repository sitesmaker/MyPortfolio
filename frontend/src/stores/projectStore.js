// src/stores/projectStore.js
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import api from '@/services/api'

export const useProjectStore = defineStore('project', () => {
  const projects = ref([])
  const currentProject = ref(null)
  const loading = ref(false)
  const formDataProject = reactive({
    title: '',
    description: '',
    content: '',
    technologies: '',
    live_url: '',
});

  const fetchProjects = async () => {
    loading.value = true
    try {
      const response = await api.get('/api/projects')
      projects.value = response.data
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      loading.value = false
    }
  }

  const updateProject = async (projectData) => {
    loading.value = true
    try {
      const response = await api.put(`/api/project/${projectData.id}`, projectData)
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
      const response = await api.get(`/api/projects/${slug}`)
      currentProject.value = response.data
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      loading.value = false
    }
  }

  const createProject = async () => {
    loading.value = true
    try {
      const response = await api.post(`/api/project`, formDataProject)
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      loading.value = false
    }
  }

  return { projects, currentProject, formDataProject, loading, fetchProjects, fetchProjectBySlug, updateProject, createProject }
})