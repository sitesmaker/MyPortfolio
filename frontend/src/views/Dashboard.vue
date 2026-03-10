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
                <div class="panel__header">
                    <h3>Проекты</h3>
                    <button @click="openModal">
                        Создать проект
                    </button>
                </div>
                <div class="project-counter">
                    <span>Всего проектов: </span>
                    <b>{{ featuredProjects?.length }}</b>
                </div>
                <div class="panel__content">
                    <ProjectCard
                        v-for="project in featuredProjects"
                        :key="project.id"
                        :project="project"
                        @updateProject="updateProject"
                        @deleteProject="id => deleteProject(id)"
                    />
                </div>
            </div>
        </div>
        <BaseModal
            :modalWidth="480"
            :isOpenModal="isOpenModal"
            @closeModal="closeModal"
        >
            <CreateProjectForm />
        </BaseModal>
        <ConfirmModal
            :isOpenModal="isOpenConfirmModal"
            @closeModal="closeConfirmModal"
            @giveResponse="event => confirmAction(event)"
        >
            <div class="h3">Вы действительно хотите удалить проект?</div>
        </ConfirmModal>
    </div>
</template>

<script setup>
import { onMounted, computed, ref, reactive } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import ProjectCard from '@/components/Admin/Project/ProjectCard.vue'
import BaseModal from '@/components/Modal/BaseModal.vue'
import CreateProjectForm from '@/components/Admin/Project/CreateProjectForm.vue'
import ConfirmModal from '@/components/Modal/ConfirmModal.vue'

const projectStore = useProjectStore()

const isOpenModal = ref(false)
const isOpenConfirmModal = ref(false);
const projectIdForDelete = ref();

const featuredProjects = computed(() => projectStore.projects)

const updateProject = async(data) => {
    await projectStore.updateProject(data)
}

const deleteProject = (id) => {
    projectIdForDelete.value = id
    isOpenConfirmModal.value = true
}

const confirmAction = async (event) => {
    if(event) {
        await projectStore.deleteProject(projectIdForDelete.value)
        isOpenConfirmModal.value = false;
    } else {
        isOpenConfirmModal.value = false;
    }
}

const openModal = () => {
    isOpenModal.value = true
}

const closeModal = () => {
    isOpenModal.value = false
}

const closeConfirmModal = () => {
    isOpenConfirmModal.value = false;
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

.project-counter {
    margin-bottom: 15px;
}
</style>