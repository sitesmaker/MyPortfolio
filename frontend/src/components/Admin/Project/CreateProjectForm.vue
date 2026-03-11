<template>
    <form
        @submit.prevent="createProject"
        class="form form--create-project"
    >
        <ImageUploader 
            ref="imageUploader"
            :existing-images="[]"
            component-id="create"
            @images-changed="handleImagesChanged"
        />

        <div class="form-group">
            <input
                type="text"
                name="title"
                id="title"
                placeholder=" "
                v-model="projectStore.formDataProject.title"
            >
            <label for="title">Название</label>
        </div>
        <div class="form-group">
            <textarea
                type="text"
                name="description"
                id="description"
                placeholder=" "
                v-model="projectStore.formDataProject.description"
            >
            </textarea>
            <label for="description">Краткое описание</label>
        </div>
        <div class="form-group">
            <textarea
                type="text"
                name="content"
                id="content"
                placeholder=" "
                v-model="projectStore.formDataProject.content"
            >
            </textarea>
            <label for="content">Контент</label>
        </div>
        <div class="form-group">
            <input
                type="text"
                name="technologies"
                id="technologies"
                placeholder=" "
                v-model="projectStore.formDataProject.technologies"
            >
            <label for="technologies">Технологии</label>
        </div>
        <div class="form-group">
            <input
                type="text"
                name="live_url"
                id="live_url"
                placeholder=" "
                v-model="projectStore.formDataProject.live_url"
            >
            <label for="live_url">Ссылка на проект</label>
        </div>
        <button type="submit">Создать проект</button>
    </form>
</template>

<script setup>
    import { ref } from 'vue'
    import { useProjectStore } from '@/stores/projectStore'
    import ImageUploader from '@/components/ImageUploader.vue'

    const projectStore = useProjectStore()
    const imageUploader = ref(null)

    const handleImagesChanged = (imageData) => {
        // Сохраняем данные изображений в store
        projectStore.formDataProject.files = imageData.newFiles
    }

    const createProject = async () => {
        // Получаем актуальные данные изображений из компонента
        const imageData = imageUploader.value?.getImageData()
        
        // Обновляем files в store перед отправкой
        if (imageData) {
            projectStore.formDataProject.files = imageData.newFiles
        }
        
        // Вызываем метод создания проекта из store
        await projectStore.createProject()
    }
</script>

<style lang="scss" scoped>
.form {
    display: flex;
    flex-direction: column;
    column-gap: 40px;
    row-gap: 10px;

    button {
        margin: 0 auto;
        padding-left: 36px;
        padding-right: 36px;
    }

    @media screen and (max-width: 767px) {
        
        & > * {
            width: 100%;
        }
    }
}
</style>