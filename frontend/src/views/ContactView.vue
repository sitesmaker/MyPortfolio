<template>
  <div class="contact">
    <h1>Связаться со мной</h1>
    
    <form @submit.prevent="submitForm" class="contact-form">
      <div class="form-group">
        <label for="name">Имя:</label>
        <input 
          type="text" 
          id="name" 
          v-model="form.name" 
          required
        >
      </div>
      
      <div class="form-group">
        <label for="email">Email:</label>
        <input 
          type="email" 
          id="email" 
          v-model="form.email" 
          required
        >
      </div>
      
      <div class="form-group">
        <label for="message">Сообщение:</label>
        <textarea 
          id="message" 
          v-model="form.message" 
          rows="5" 
          required
        ></textarea>
      </div>
      
      <button type="submit" :disabled="submitting">
        {{ submitting ? 'Отправка...' : 'Отправить' }}
      </button>
      
      <div v-if="success" class="success-message">
        Сообщение отправлено успешно!
      </div>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import api from '@/services/api'

const form = reactive({
  name: '',
  email: '',
  message: ''
})

const submitting = ref(false)
const success = ref(false)
const error = ref('')

const submitForm = async () => {
  submitting.value = true
  success.value = false
  error.value = ''
  
  try {
    await api.post('/messages', form)
    success.value = true
    form.name = ''
    form.email = ''
    form.message = ''
  } catch (err) {
    error.value = err.response?.data?.message || 'Ошибка отправки сообщения'
  } finally {
    submitting.value = false
  }
}
</script>