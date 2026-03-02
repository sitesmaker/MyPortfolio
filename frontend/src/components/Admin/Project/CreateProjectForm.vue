<template>
    <form @submit.prevent="projectStore.createProject">
        {{ projectStore.formDataProject }}
        <input type="text" name="title" v-model="projectStore.formDataProject.title">
        <input type="text" name="title" v-model="projectStore.formDataProject.description">
        <input type="text" name="title" v-model="projectStore.formDataProject.content">
        <input type="text" name="title" v-model="projectStore.formDataProject.technologies">
        <input type="text" name="title" v-model="projectStore.formDataProject.live_url">
        <button type="submit">Отправить</button>
    </form>
</template>

<script setup>
    import { useProjectStore } from '@/stores/projectStore'

    const projectStore = useProjectStore()
</script>