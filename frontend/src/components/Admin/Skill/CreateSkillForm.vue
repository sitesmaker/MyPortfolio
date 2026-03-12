<template>
    <form
        @submit.prevent="createSkill"
        class="form form--create-skill"
    >
        <!-- <ImageUploader 
            ref="imageUploader"
            :existing-images="[]"
            component-id="create"
            @images-changed="handleImagesChanged"
        /> -->

        <div class="form-group">
            <input
                type="text"
                name="name"
                id="name"
                placeholder=" "
                v-model="skillStore.formDataSkill.name"
            >
            <label for="title">Название</label>
        </div>
        <!-- <div class="form-group">
            <textarea
                type="text"
                name="description"
                id="description"
                placeholder=" "
                v-model="skillStore.formDataSkill.description"
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
                v-model="skillStore.formDataSkill.content"
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
                v-model="skillStore.formDataSkill.technologies"
            >
            <label for="technologies">Технологии</label>
        </div>
        <div class="form-group">
            <input
                type="text"
                name="live_url"
                id="live_url"
                placeholder=" "
                v-model="skillStore.formDataSkill.live_url"
            >
            <label for="live_url">Ссылка на проект</label>
        </div> -->
        <button type="submit">Добавить скилл</button>
    </form>
</template>

<script setup>
    import { ref } from 'vue'
    import { useSkillStore } from '@/stores/skillStore'
    // import ImageUploader from '@/components/ImageUploader.vue'

    const skillStore = useSkillStore()
    const imageUploader = ref(null)

    const handleImagesChanged = (imageData) => {
        // Сохраняем данные изображений в store
        skillStore.formDataSkill.files = imageData.newFiles
    }

    const createSkill = async () => {
        // Получаем актуальные данные изображений из компонента
        const imageData = imageUploader.value?.getImageData()
        
        // Обновляем files в store перед отправкой
        if (imageData) {
            skillStore.formDataSkill.files = imageData.newFiles
        }
        
        // Вызываем метод создания проекта из store
        await skillStore.createSkill()
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