<template>
    <div class="editable-input">
        <input
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            @blur="handleBlur"
            ref="inputElem"
            :type="type"
            :name="name"
            :disabled="!isEditing"
            :class="{ 'input-disabled': !isEditing, 'input-editing': isEditing }"
        >
        <button @click.prevent="toggleEdit">
            <i class="fa-solid" :class="isEditing ? 'fa-floppy-disk': 'fa-pen'"></i>
        </button>
    </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const inputElem = ref();

const props = defineProps({
    type: {
        type: String,
        default: 'text',
    },
    name: {
        type: String,
        required: true,
    },
    modelValue: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue'])
const isEditing = ref(false)

let blurTimer = null

const toggleEdit = () => {
    if (blurTimer) {
        clearTimeout(blurTimer)
        blurTimer = null
    }
    isEditing.value = !isEditing.value
}

const handleBlur = () => {
    blurTimer = setTimeout(() => {
        isEditing.value = false
        blurTimer = null
    }, 100)
}

watch(isEditing, async() => {
    if (isEditing.value) {
        await nextTick() // Ждем обновления DOM
        inputElem.value.focus();
    }
})
</script>

<style lang="scss" scoped>
.editable-input {
    
    input {
        background: transparent;
        border: none;
        outline: none;
        color: #fff;
        font-size: 1.4rem;
    }

    button {
        background: transparent;
        border: none;
        outline: none;
        cursor: pointer;
        color: #ccc;
    }
}
</style>