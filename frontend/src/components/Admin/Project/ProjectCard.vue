<template>
    <div class="project-card">
        <div class="project-card__images">
            <ImageUploaderSingle 
                ref="imageUploader"
                :existing-images="editableProject.images || []"
                :component-id="'project-' + project.id"
                :is-editing="isEditing"
                @images-changed="handleImagesChanged"
            />
        </div>
        <div class="project-card__content">
            <div class="form-group">
                <input
                    type="text"
                    name="title"
                    id="title"
                    v-model="editableProject.title"
                    :disabled="!isEditing"
                >
                <label for="title">Название</label>
            </div>
            <div class="form-group">
                <textarea
                    type="text"
                    name="description"
                    id="description"
                    v-model="editableProject.description"
                    :disabled="!isEditing"
                ></textarea>
                <label for="description">Краткое описание</label>
            </div>
            <div class="form-group">
                <textarea
                    type="text"
                    name="content"
                    id="content"
                    v-model="editableProject.content"
                    :disabled="!isEditing"
                ></textarea>
                <label for="content">Полное описание</label>
            </div>
            <div class="form-group">
                <input
                    type="text"
                    name="technologies"
                    id="technologies"
                    v-model="editableProject.technologies"
                    :disabled="!isEditing"
                >
                <label for="technologies">Технологии</label>
            </div>
            <div class="form-group">
                <input
                    type="text"
                    name="live_url"
                    id="live_url"
                    v-model="editableProject.live_url"
                    :disabled="!isEditing"
                >
                <label for="live_url">Ссылка на проект</label>
            </div>
            <div>
                <label>Опубликовать</label>
                <input
                    type="checkbox"
                    :disabled="!isEditing"
                    v-model="editableProject.is_published"
                >
            </div>
        </div>
        <div class="project-card__ations">
            <button 
                v-if="!isEditing"
                @click="startEditing"
            >
                <i class="fa-solid fa-pencil"></i>
            </button>

            <template v-else>
                <button
                    @click="updateProject"
                >
                    <i class="fa-solid fa-floppy-disk"></i>
                </button>
                <button 
                    @click="cancelEditing"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </template>

            <button
                class="btn btn--delete"
                @click="deleteProject(project.id)"
            >
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import ImageUploaderSingle from '@/components/ImageUploaderSingle.vue'

const props = defineProps({
    project: {
        type: Object,
        required: true
    }
})

// Состояния
const isEditing = ref(false)
const isUpdating = ref(false)
const editableProject = ref({ ...props.project })
const imageData = ref({
    newFile: null,
    deletedId: null,
    hasChanges: false
})
const localProject = ref({ ...props.project }) // Локальная копия

// Ссылка на компонент ImageUploader
const imageUploader = ref(null)

// ВАЖНО: Следим за изменениями пропса и обновляем локальные данные
watch(() => props.project, async (newProject) => {
    console.log('Project prop changed:', newProject)
    
    // Создаем глубокую копию для обновления реактивности
    localProject.value = JSON.parse(JSON.stringify(newProject))
    
    if (!isEditing.value) {
        editableProject.value = { ...localProject.value }
    }
    
    // Принудительно обновляем компонент изображения
    await nextTick()
})

// Обработчик изменений изображений
const handleImagesChanged = (data) => {
    imageData.value = data
}

// Начало редактирования
const startEditing = () => {
    editableProject.value = JSON.parse(JSON.stringify(localProject.value))
    isEditing.value = true
}

// Отмена редактирования
const cancelEditing = () => {
    isEditing.value = false
    editableProject.value = { ...localProject.value }
    if (imageUploader.value) {
        imageUploader.value.clearImageData()
    }
    imageData.value = { newFile: null, deletedId: null, hasChanges: false }
}

const deleteProject = async () => {
    emit('deleteProject', localProject.value.id)
}

// Обновление проекта
const updateProject = async () => {
    isUpdating.value = true
    
    try {
        const projectData = {
            id: props.project.id,
            title: editableProject.value.title || '',
            description: editableProject.value.description || '',
            content: editableProject.value.content || '',
            technologies: editableProject.value.technologies || '',
            live_url: editableProject.value.live_url || '',
            is_published: editableProject.value.is_published,
            imageData: {
                newFile: imageData.value.newFile,
                deletedId: imageData.value.deletedId
            }
        }

        const updatedProject = await emit('updateProject', projectData)
        
        if (updatedProject) {
            localProject.value = { ...updatedProject }
            editableProject.value = { ...updatedProject }
        }
        
        isEditing.value = false
        
        if (imageUploader.value) {
            imageUploader.value.clearImageData()
        }

    } catch (error) {
        console.error('Error updating project:', error)
    } finally {
        isUpdating.value = false
    }
}

const emit = defineEmits(['updateProject', 'deleteProject']);
</script>

<style lang="scss" scoped>
.project-card {
    padding: 10px;
    border-radius: 12px;
    display: flex;
    gap: 20px;
    border: 1px solid #fafafa;

    &__images {
        width: 180px;
        min-width: 180px;
        height: 180px;
        background: #000;
        border-radius: 12px;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    &__content {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    input:disabled,
    textarea:disabled {
        background: transparent;
        color: #fff;
    }

    &__ations {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: auto;
    }
}
</style>