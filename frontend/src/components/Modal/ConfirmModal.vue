<script setup lang="ts">
import BaseModal from '@/components/Modal/BaseModal.vue'

const emit = defineEmits(['giveResponse'])

const successResponse = () => {
    emit('giveResponse', true)
}

const cancelResponse = () => {
    emit('giveResponse', false)
}
</script>

<template>
    <BaseModal>
        <slot></slot>
        <button @click="successResponse">Да</button>
        <button
            @click="cancelResponse"
            class="btn btn--delete"
        >
            Нет
        </button>
    </BaseModal>
</template>