<template>
    <div class="project-card">
            <!-- Текущие изображения -->
            <div class="project-card__images">
                <div 
                    v-for="(image, idx) in currentImages" 
                    :key="idx" 
                    class="project-card__image-wrapper"
                    :class="{ 'editing': isEditing }"
                >
                    <img
                        :src="image.full_url || image.preview"
                        :alt="project.title"
                    >
                    <!-- Кнопка удаления изображения (только в режиме редактирования) -->
                    <button 
                        v-if="isEditing && !image.isNew"
                        class="project-card__image-delete"
                        @click="removeExistingImage(image.id)"
                        title="Удалить изображение"
                    >
                        <i class="fa-solid fa-times"></i>
                    </button>
                    <!-- Индикатор нового изображения -->
                    <span v-if="image.isNew" class="project-card__image-new">Новое</span>
                </div>
          

                <!-- Кнопка добавления изображений (только в режиме редактирования) -->
                <div v-if="isEditing" class="project-card__image-upload">
                    <label for="image-upload" class="upload-btn">
                        <i class="fa-solid fa-plus"></i>
                        Добавить изображения
                    </label>
                    <input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        @change="handleImageUpload"
                        style="display: none;"
                    >
                    <span v-if="newFiles.length > 0" class="upload-count">
                        Выбрано: {{ newFiles.length }} файл(ов)
                    </span>
                </div>
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
import { ref, computed } from 'vue'

const props = defineProps({
    project: {
        type: Object,
        required: true
    }
})

const newFiles = ref([])
const deletedImageIds = ref([])

// Текущие изображения (существующие + новые)
const currentImages = computed(() => {
    const existing = (editableProject.value.images || []).map(img => ({
        ...img,
        isNew: false
    }))
    
    const news = newFiles.value.map((file, index) => ({
        id: `new-${index}`,
        full_url: URL.createObjectURL(file),
        preview: URL.createObjectURL(file),
        isNew: true,
        file: file
    }))
    
    return [...existing, ...news]
})

const isEditing = ref(false)
const editableProject = ref({ ...props.project })

const startEditing = () => {
    editableProject.value = JSON.parse(JSON.stringify(props.project))
    isEditing.value = true
}

const cancelEditing = () => {
    isEditing.value = false
    editableProject.value = { ...props.project }
}

const emit = defineEmits(['updateProject', 'deleteProject']);

const updateProject = () => {
    emit('updateProject', editableProject.value);
    isEditing.value = false
}

const deleteProject = (id) => {
    emit('deleteProject', id);
}
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