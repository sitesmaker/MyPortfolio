<!-- App.vue -->
<template>
    <component :is="currentLayout">
      <main>
        <router-view />
      </main>
    </component>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const authStore = useAuthStore();
const route = useRoute();

const currentLayout = computed(() => {
    // Выбираем лейаут в зависимости от маршрута
    if (route.meta.layout === 'auth') return AuthLayout
    if (route.meta.layout === 'dashboard') return DashboardLayout
    if (route.meta.layout === 'empty') return EmptyLayout
    return DefaultLayout
})

onMounted(() => {
  // Инициализация auth при загрузке приложения
  authStore.init();
});
</script>