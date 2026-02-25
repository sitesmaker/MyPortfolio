<template>
    <menu class="menu menu__top">
        <RouterLink to="/">Главная</RouterLink>
        <RouterLink to="/dashboard">Админка</RouterLink>
        <a href="#" @click.prevent="logout" v-if="authStore.isAuthenticated">Выход</a>
        <RouterLink to="/login" v-if="!authStore.isAuthenticated">Вход</RouterLink>
    </menu>
</template>
<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = async() => {
    await authStore.logout();
    router.push('/login');
}
</script>

<style lang="scss" scoped>
.menu {
    display: flex;
    flex-direction: row;
    gap: 10px;
    
    .router-link-active {
        border-bottom: 2px solid currentColor;
    }

    a {
        padding: 10px 10px 6px;
        border-bottom: 2px solid transparent;

        &:hover {
            border-bottom: 2px solid currentColor;
        }
    }
}
</style>