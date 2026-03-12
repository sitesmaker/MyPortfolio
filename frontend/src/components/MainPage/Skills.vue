<template>
    <div>
        <div
            v-for="skill in skills"
            :key="skill.id"
        >
            {{ skill.name }}
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useSkillStore } from '@/stores/skillStore'

const skillStore = useSkillStore()
const skills = computed(() => skilltStore.projects)

onMounted(() => {
  skillStore.fetchSkills()
})
</script>