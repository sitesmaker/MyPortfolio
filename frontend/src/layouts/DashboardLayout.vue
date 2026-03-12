<template>
    <AppHeader/>
    <div class="container">
        <div class="dashboard">
            <div class="panel">
                <h2>Меню</h2>
                <nav class="dashboard__menu">
                    <RouterLink :to="{name: 'dashboard'}">Сводка</RouterLink>
                    <RouterLink :to="{name: 'admin-messages'}">Сообщения</RouterLink>
                    <RouterLink :to="{name: 'admin-settings'}">Настройки</RouterLink>
                    <RouterLink :to="{name: 'admin-projects'}">Работы</RouterLink>
                    <RouterLink :to="{name: 'admin-skills'}">Скилы</RouterLink>
                    <RouterLink :to="{name: 'admin-reviews'}">Отзывы</RouterLink>
                </nav>
            </div>
            <div class="panel">
                <slot></slot>
            </div>
        </div>
    </div>
    <AppFooter/>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
</script>

<style lang="scss" scoped>
.dashboard {
    display: grid;
    grid-template-columns: minmax(240px, 1fr) 3fr;
    gap: 40px;
}
.dashboard__menu {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
}

.project-counter {
    margin-bottom: 15px;
}
</style>