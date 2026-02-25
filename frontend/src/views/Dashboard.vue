<template>
    <div class="container">
        <div class="dashboard">
            <div class="panel">
                <h2>Меню</h2>
                <nav class="dashboard__menu">
                    <RouterLink to="">Настройки</RouterLink>
                    <RouterLink to="">Работы</RouterLink>
                    <RouterLink to="">Скилы</RouterLink>
                    <RouterLink to=""></RouterLink>
                </nav>
            </div>
            <div class="panel">
                <h3>Проекты</h3>
                <ProjectCard
                    v-for="project in featuredProjects"
                    :key="project.id"
                    :project="project"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useProjectStore } from '@/stores/projectStore'
import ProjectCard from '@/components/Admin/ProjectCard.vue';

const projectStore = useProjectStore()

const featuredProjects = computed(() => projectStore.projects.slice(0, 3))

onMounted(() => {
  projectStore.fetchProjects()
})
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
    gap: 10px;
}
</style>