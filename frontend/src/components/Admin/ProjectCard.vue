<template>
    <div class="project-card">
        <div class="project-card__image">
            <img :src="project.image_url" alt="">
        </div>
        <div class="project-card__content">
            {{ project.title }}
            <div>
                {{ project }}
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    project: {
        type: Object,
        required: true
    }
})
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