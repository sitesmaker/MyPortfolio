<template>
    <div class="image-uploader">
        <!-- В режиме просмотра (не редактирования) показываем только картинку -->
        <template v-if="!isEditing">
            <div v-if="currentImage" class="image-uploader__preview view-mode">
                <img
                    :src="currentImage.full_url || currentImage.preview"
                    alt="Изображение проекта"
                >
            </div>
            <div v-else class="image-uploader__no-image">
                <i class="fa-solid fa-image"></i>
                <span>Нет изображения</span>
            </div>
        </template>

        <!-- В режиме редактирования показываем все элементы управления -->
        <template v-else>
            <!-- Если есть изображение -->
            <div v-if="currentImage" class="image-uploader__preview" :class="{ 'editing': true }">
                <img
                    :src="currentImage.full_url || currentImage.preview"
                    alt="Изображение проекта"
                >
                
                <!-- Кнопка удаления -->
                <button 
                    class="image-uploader__delete"
                    @click="removeImage"
                    title="Удалить изображение"
                >
                    <i class="fa-solid fa-times"></i>
                </button>
                
                <!-- Индикатор нового изображения -->
                <span v-if="currentImage.isNew" class="image-uploader__new">Новое</span>
                <!-- Индикатор удаления для существующего -->
                <span v-if="!currentImage.isNew && isMarkedForDelete" class="image-uploader__deleted">
                    Будет удалено
                </span>
            </div>

            <!-- Кнопка добавления/замены изображения (если не отмечено на удаление) -->
            <div v-if="!isMarkedForDelete" class="image-uploader__upload">
                <label :for="uploadId" class="upload-btn">
                    <i class="fa-solid fa-plus"></i>
                    {{ currentImage ? 'Заменить' : 'Добавить' }} изображение
                </label>
                <input
                    :id="uploadId"
                    type="file"
                    accept="image/*"
                    @change="handleFileSelect"
                    style="display: none;"
                >
            </div>
            
            <!-- Кнопка восстановления если отмечено на удаление -->
            <div v-else class="image-uploader__restore">
                <button @click="restoreImage" class="restore-btn">
                    <i class="fa-solid fa-undo"></i>
                    Восстановить
                </button>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    existingImages: {
        type: Array,
        default: () => []
    },
    componentId: {
        type: String,
        default: 'image-upload'
    },
    isEditing: {
        type: Boolean,
        default: false
    }
})

// Новый выбранный файл
const newFile = ref(null)
// Флаг удаления существующего изображения
const isMarkedForDelete = ref(false)

// Генерируем уникальный ID для input
const uploadId = `image-upload-${props.componentId}-${Math.random().toString(36).substr(2, 9)}`

// Текущее изображение
const currentImage = computed(() => {
    // Если есть новый файл - показываем его
    if (newFile.value) {
        return {
            id: `new-${Date.now()}`,
            full_url: URL.createObjectURL(newFile.value),
            preview: URL.createObjectURL(newFile.value),
            isNew: true,
            file: newFile.value
        }
    }
    
    // Если есть существующее изображение и оно не отмечено на удаление
    if (props.existingImages && props.existingImages.length > 0 && !isMarkedForDelete.value) {
        const existing = props.existingImages[0]
        return {
            ...existing,
            isNew: false
        }
    }
    
    return null
})

// Обработчик выбора файла
const handleFileSelect = (event) => {
    const file = event.target.files[0]
    
    if (file) {
        newFile.value = file
        // Если изображение было отмечено на удаление, снимаем отметку
        isMarkedForDelete.value = false
    }
    
    event.target.value = ''
    emitImagesChanged()
}

// Удаление изображения
const removeImage = () => {
    if (currentImage.value) {
        if (!currentImage.value.isNew) {
            // Если это существующее изображение - помечаем на удаление
            isMarkedForDelete.value = true
        } else {
            // Если это новое изображение - просто убираем файл
            newFile.value = null
        }
        emitImagesChanged()
    }
}

// Восстановление изображения
const restoreImage = () => {
    isMarkedForDelete.value = false
    emitImagesChanged()
}

// Функция для эмита события об изменении
const emitImagesChanged = () => {
    emit('imagesChanged', {
        newFile: newFile.value,
        deletedId: isMarkedForDelete.value && props.existingImages.length > 0 
            ? props.existingImages[0].id 
            : null,
        hasChanges: !!(newFile.value || isMarkedForDelete.value)
    })
}

// Очистка всех данных
const clearImageData = () => {
    newFile.value = null
    isMarkedForDelete.value = false
    emitImagesChanged()
}

// Получение данных для отправки
const getImageData = () => {
    return {
        newFile: newFile.value,
        deletedId: isMarkedForDelete.value && props.existingImages.length > 0 
            ? props.existingImages[0].id 
            : null
    }
}

const emit = defineEmits(['imagesChanged'])

defineExpose({
    clearImageData,
    getImageData,
    newFile,
    isMarkedForDelete
})
</script>

<style lang="scss" scoped>
.image-uploader {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    
    &__preview {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 12px;
        overflow: hidden;
        
        &.editing {
            border: 2px solid #007bff;
        }
        
        &.view-mode {
            border: none;
        }
        
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    
    &__no-image {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #1a1a1a;
        color: #666;
        border-radius: 12px;
        
        i {
            font-size: 40px;
            margin-bottom: 10px;
        }
        
        span {
            font-size: 12px;
        }
    }
    
    &__delete {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: rgba(255, 0, 0, 0.8);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
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
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
    }
    
    &__deleted {
        position: absolute;
        bottom: 5px;
        left: 5px;
        background: rgba(255, 0, 0, 0.8);
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
    }
    
    &__upload {
        margin-top: 5px;
        
        .upload-btn {
            display: block;
            padding: 8px;
            background: #f0f0f0;
            border-radius: 6px;
            text-align: center;
            cursor: pointer;
            font-size: 12px;
            color: #333;
            
            i {
                margin-right: 5px;
            }
            
            &:hover {
                background: #e0e0e0;
            }
        }
    }
    
    &__restore {
        margin-top: 5px;
        
        .restore-btn {
            width: 100%;
            padding: 8px;
            background: #28a745;
            border: none;
            border-radius: 6px;
            color: white;
            cursor: pointer;
            font-size: 12px;
            
            i {
                margin-right: 5px;
            }
            
            &:hover {
                background: #218838;
            }
        }
    }
}
</style>