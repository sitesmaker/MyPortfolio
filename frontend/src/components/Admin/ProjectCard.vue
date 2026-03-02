<template>
    <div class="project-card">
        <div class="project-card__image">
            <img :src="project.image_url" alt="">
        </div>
        <div class="project-card__content">
            <EditableInput name="title" v-model="project.title" />
            <EditableInput name="description" v-model="project.description" />
            <EditableInput name="content" v-model="project.content" />
            <EditableInput name="technologies" v-model="project.technologies" />
            <EditableInput name="live_url" v-model="project.live_url" />
            <input type="checkbox" v-model="project.is_active">
            <button @click="updateProject">Save</button>
        </div>
    </div>
</template>

<script setup>
import EditableInput from '../EditableInput.vue';

const props = defineProps({
    project: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['updateProject']);

const updateProject = () => {
    console.log('В компоненте')
    emit('updateProject', props.project);
}
</script>

<style lang="scss" scoped>
.project-card {
    padding: 10px;
    border-radius: 12px;
    display: flex;
    gap: 20px;
    border: 1px solid #fafafa;
}

.project-card__image {
    width: 180px;
    min-width: 180px;
    height: 180px;
    background: #000;
    border-radius: 12px;
    overflow: hidden;
}
</style>