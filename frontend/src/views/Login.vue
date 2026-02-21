<!-- views/Login.vue -->
<template>
  <div class="login-container">
    <h2>Вход в систему</h2>

    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>Email:</label>
        <input
            type="email"
            v-model="form.email"
            required
            :disabled="authStore.loading"
        />
      </div>

      <div class="form-group">
        <label>Пароль:</label>
        <input
            type="password"
            v-model="form.password"
            required
            :disabled="authStore.loading"
        />
      </div>

      <button type="submit" :disabled="authStore.loading">
        {{ authStore.loading ? 'Вход...' : 'Войти' }}
      </button>

      <div v-if="error" class="error">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const form = reactive({
  email: '',
  password: ''
});
const error = ref('');

// Если уже авторизован - редирект
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/dashboard');
  }
});

const handleLogin = async () => {
  error.value = '';

  try {
    await authStore.login(form);

    // Редирект на исходную страницу или дашборд
    const redirectPath = route.query.redirect || '/dashboard';
    router.push(redirectPath);

  } catch (err) {
    error.value = err.response?.data?.message || 'Неверный email или пароль';
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error {
  margin-top: 15px;
  padding: 10px;
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
</style>