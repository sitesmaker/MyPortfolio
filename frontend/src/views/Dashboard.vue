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
                <button @click="openModal">
                    Создать проект
                </button>
                <h3>Проекты</h3>
                <ProjectCard
                    v-for="project in featuredProjects"
                    :key="project.id"
                    :project="project"
                    @updateProject="updateProject"
                />
            </div>
        </div>
        <BaseModal
            :isOpenModal="isOpenModal"
            @closeModal="closeModal"
        >
            <form>
                <input type="text">
                <button type="submit">Отправить</button>
            </form>
        </BaseModal>
    </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import ProjectCard from '@/components/Admin/ProjectCard.vue'
import BaseModal from '@/components/Modal/BaseModal.vue'

const projectStore = useProjectStore()

const isOpenModal = ref(false)

const featuredProjects = computed(() => projectStore.projects.slice(0, 3))

const updateProject = async(data) => {
    console.log('В родителе')
    await projectStore.updateProject(data)
}

const openModal = () => {
    isOpenModal.value = true
}

const closeModal = () => {
    isOpenModal.value = false
}

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