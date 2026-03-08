<template>
    <div class="project-card">
        <div class="project-card__image">
            <img :src="project.image_url" alt="">
        </div>
        <div class="project-card__content">
            <EditableInput
                name="title"
                v-model="project.title"
            />
            <EditableInput
                name="description"
                v-model="project.description"
            />
            <EditableInput
                name="content"
                v-model="project.content"
            />
            <EditableInput
                name="technologies"
                v-model="project.technologies"
            />
            <EditableInput
                name="live_url"
                v-model="project.live_url"
            />
            <input
                type="checkbox"
                v-model="project.is_active"
            >
        </div>
        <div class="project-card__ations">
            <button @click="updateProject">
                <i class="fa-solid fa-floppy-disk"></i>
            </button>
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
import EditableInput from '../../EditableInput.vue';

const props = defineProps({
    project: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['updateProject', 'deleteProject']);

const updateProject = () => {
    emit('updateProject', props.project);
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

    &__image {
        width: 180px;
        min-width: 180px;
        height: 180px;
        background: #000;
        border-radius: 12px;
        overflow: hidden;
    }

    &__content {
        width: 100%;
    }

    &__ations {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: auto;
    }
}
</style>