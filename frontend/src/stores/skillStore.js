// src/stores/skillStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useSkillStore = defineStore('skill', () => {
  const skills = ref([])
  const loading = ref(false)

  const fetchSkills = async () => {
    loading.value = true
    try {
      const response = await api.get('/skills')
      skills.value = response.data
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      loading.value = false
    }
  }

  return { skills, loading, fetchSkills }
})