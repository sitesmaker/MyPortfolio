<template>
    <div class="image-uploader">
        <!-- Превью изображений -->
        <div 
            v-for="(image, index) in images" 
            :key="image.id || index" 
            class="image-uploader__preview"
            :class="{ 'editing': true }"
        >
            <img
                :src="image.full_url || image.preview"
                :alt="'Изображение ' + (index + 1)"
            >
            
            <!-- Кнопка удаления для существующих изображений -->
            <button 
                v-if="!image.isNew"
                class="image-uploader__delete"
                @click="removeExistingImage(image.id)"
                title="Удалить изображение"
            >
                <i class="fa-solid fa-times"></i>
            </button>
            
            <!-- Кнопка удаления для новых изображений -->
            <button 
                v-else
                class="image-uploader__delete"
                @click="removeNewFile(index)"
                title="Удалить изображение"
            >
                <i class="fa-solid fa-times"></i>
            </button>
            
            <!-- Индикатор нового изображения -->
            <span v-if="image.isNew" class="image-uploader__new">Новое</span>
        </div>

        <!-- Кнопка добавления изображений -->
        <div class="image-uploader__upload">
            <label :for="uploadId" class="upload-btn">
                <i class="fa-solid fa-plus"></i>
                    Добавить изображения
            </label>
            <input
                :id="uploadId"
                type="file"
                multiple
                accept="image/*"
                @change="handleFileSelect"
                style="display: none;"
            >
            <span v-if="newFilesCount > 0" class="upload-count">
                Выбрано: {{ newFilesCount }} файл(ов)
            </span>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
    existingImages: {
        type: Array,
        default: () => []
    },
    componentId: {
        type: String,
        default: 'image-upload'
    }
})

// Новые выбранные файлы
const newFiles = ref([])
// ID удаленных существующих изображений
const deletedImageIds = ref([])

// Генерируем уникальный ID для input
const uploadId = `image-upload-${props.componentId}-${Math.random().toString(36).substr(2, 9)}`

// Вычисляем общее количество новых файлов
const newFilesCount = computed(() => newFiles.value.length)

// Все изображения (существующие + новые)
const images = computed(() => {
    const existing = (props.existingImages || []).map(img => ({
        ...img,
        isNew: false
    }))
    
    const news = newFiles.value.map((file, index) => ({
        id: `new-${index}-${Date.now()}`,
        full_url: URL.createObjectURL(file),
        preview: URL.createObjectURL(file),
        isNew: true,
        file: file
    }))
    
    return [...existing, ...news]
})

// Обработчик выбора файлов
const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    
    files.forEach(file => {
        newFiles.value.push(file)
    })
    
    // Сбрасываем input, чтобы можно было выбрать те же файлы снова
    event.target.value = ''
    
    // Эмитим событие об изменении
    emitImagesChanged()
}

// Удаление нового файла
const removeNewFile = (index) => {
    // Находим реальный индекс в массиве newFiles
    const newFileIndex = index - (props.existingImages?.length || 0)
    if (newFileIndex >= 0) {
        newFiles.value.splice(newFileIndex, 1)
        // Эмитим событие об изменении
        emitImagesChanged()
    }
}

// Удаление существующего изображения
const removeExistingImage = (imageId) => {
    if (imageId && !deletedImageIds.value.includes(imageId)) {
        deletedImageIds.value.push(imageId)
        emit('imageDeleted', imageId)
        // Эмитим событие об изменении
        emitImagesChanged()
    }
}

// Функция для эмита события об изменении
const emitImagesChanged = () => {
    emit('imagesChanged', {
        newFiles: newFiles.value,
        deletedIds: deletedImageIds.value
    })
}

// Очистка всех новых файлов
const clearNewFiles = () => {
    newFiles.value = []
    emitImagesChanged()
}

// Очистка удаленных ID
const clearDeletedIds = () => {
    deletedImageIds.value = []
    emitImagesChanged()
}

// Получение всех данных для отправки на сервер
const getImageData = () => {
    return {
        newFiles: newFiles.value,
        deletedIds: deletedImageIds.value
    }
}

// Эмиты для событий
const emit = defineEmits(['imageDeleted', 'imagesChanged'])

// Экспортируем методы для использования в родительском компоненте
defineExpose({
    clearNewFiles,
    clearDeletedIds,
    getImageData,
    newFiles,
    deletedImageIds
})
</script>

<style lang="scss" scoped>
.image-uploader {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    
    &__preview {
        position: relative;
        width: 100px;
        height: 100px;
        border-radius: 8px;
        overflow: hidden;
        border: 2px solid transparent;
        
        &.editing {
            border-color: #007bff;
        }
        
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    
    &__delete {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgba(255, 0, 0, 0.8);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        padding: 0;
        
        &:hover {
            background: red;
        }
    }
    
    &__new {
        position: absolute;
        bottom: 5px;
        left: 5px;
        background: rgba(0, 123, 255, 0.8);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
    }
    
    &__upload {
        width: 100px;
        height: 100px;
        border: 2px dashed #ccc;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        
        .upload-btn {
            cursor: pointer;
            font-size: 12px;
            color: #666;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            
            i {
                font-size: 24px;
            }
            
            &:hover {
                color: #007bff;
            }
        }
        
        .upload-count {
            font-size: 10px;
            color: #28a745;
            margin-top: 5px;
        }
    }
}
</style>