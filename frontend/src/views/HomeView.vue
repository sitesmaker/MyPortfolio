<template>
  <div class="home">
    <div class="container">
      <Hero/>
    </div>

    <AboutMe />

    <section>
    <div class="projects" v-if="!projectStore.loading">
      <div class="container">
        <h2>Проекты в которых я принимал участие</h2>
        <div class="project-grid">
          <div v-for="project in featuredProjects" :key="project.id" class="project-card">
            <div class="project__images">
              <img
                v-for="(image, idx) in project.images"
                :key="idx"
                :src="image.full_url"
                alt=""
              >
            </div>
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            <p>{{ project.content }}</p>
            <a :href="project.live_url" target="_blank">{{ project.live_url }}</a>
          </div>
        </div>
      </div>
    </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import Hero from '@/components/MainPage/Hero.vue'
import AboutMe from '@/components/MainPage/AboutMe.vue'

const projectStore = useProjectStore()

const featuredProjects = computed(() => projectStore.projects.slice(0, 3))

onMounted(() => {
  projectStore.fetchProjects()
})
</script>

<style lang="scss" scoped>
.project__images {
  display: flex;
  gap: 10px;

  img {
    width: 25%;
  }
}
</style>