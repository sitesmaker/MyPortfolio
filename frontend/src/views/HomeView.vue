<template>
  <div class="home">
    <div class="container">
      <Hero/>
    </div>
    
    <div class="featured-projects" v-if="!projectStore.loading">
      <h2>Мои работы</h2>
      <div class="project-grid">
        <div v-for="project in featuredProjects" :key="project.id" class="project-card">
          <img :src="project.image_url" :alt="project.title">
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
          <p>{{ project.content }}</p>
          <a :href="project.live_url" target="_blank">{{ project.live_url }}</a>
          <!-- <router-link :to="`/projects/${project.slug}`">Подробнее</router-link> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import Hero from '@/components/MainPage/Hero.vue'

const projectStore = useProjectStore()

const featuredProjects = computed(() => projectStore.projects.slice(0, 3))

onMounted(() => {
  projectStore.fetchProjects()
})
</script>