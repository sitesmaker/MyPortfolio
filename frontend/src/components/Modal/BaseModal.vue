<template>
    <Teleport to="body">
        <div
            class="overlay"
            v-if="isOpenModal"
            @click.self="closeModal"
        >
            <div class="modal" :style="`width:${modalWidth}px`">
                <button
                    class="modal__close btn btn--delete"
                    @click="closeModal"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <slot></slot>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { watch } from 'vue';

const props = defineProps({
    isOpenModal: {
        type: Boolean,
        default: false,
    },
    modalWidth: {
        type: Number,
        default: 767,
    }
})
const emit = defineEmits(['closeModal'])

const closeModal = () => {
    emit('closeModal')
}

const handleEscapeKey = (event) => {
    if (event.key === 'Escape') {
        closeModal()
    }
}

watch(() => props.isOpenModal, (newValue) => {
    if (newValue) {
        document.addEventListener('keydown', handleEscapeKey)
    } else {
        document.removeEventListener('keydown', handleEscapeKey)
    }
}, { immediate: true })
</script>

<style lang="scss">
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(#194BFD, .2);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(3px);
}
.modal {
    padding: 40px 30px;
    border-radius: 12px;
    background: #fafafa;
    color: #333;
    max-width: 767px;
    width: 100%;
    margin: 0 40px;
    position: relative;

    &__close {
        position: absolute;
        top: -60px;
        right: 0;
    }
}
</style>
