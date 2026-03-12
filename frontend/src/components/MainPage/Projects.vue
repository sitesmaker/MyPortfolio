<template>
    <section>
      <div class="projects" v-if="!projectStore.loading">
        <div class="container">
          <h2>Проекты в которых я принимал участие</h2>
          <div class="project-grid">
            <a
                v-for="project in featuredProjects"
                :key="project.id"
                class="project-card"
                :href="project.live_url"
                target="_blank"
            >
                <img
                    :key="idx"
                    :src="project.images[0].full_url"
                    alt=""
                    class="project-card__image"
                >
              <div class="project-card__content">
                <h3>{{ project.title }}</h3>
                <p>{{ project.description }}</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore'

const projectStore = useProjectStore()
const featuredProjects = computed(() => projectStore.projects)

onMounted(() => {
  projectStore.fetchProjects()
})
</script>

<style lang="scss" scoped>
.project-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.project-card {
    position: relative;
    background: var(--accent-color);
    overflow: hidden;
    border-radius: 12px;
    text-decoration: none;
    color: inherit;
    
    &__image {
        width: 100%;
        aspect-ratio: 1/1;
        object-fit: cover;
        transition: all 0.4s ease-in-out;
        display: block;
    }

    &__content {
        padding: 20px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.4s ease-in-out;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        overflow-y: auto;
    }

    &:hover {
        .project-card__image {
            opacity: 0.6;
            transform: scale(1.1);
        }

        .project-card__content {
            opacity: 1;
            visibility: visible;
        }
    }
}
</style>