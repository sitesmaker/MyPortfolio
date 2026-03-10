<template>
  <div class="home">
    <div class="container">
      <Hero/>
    </div>
    <AboutMe />
    <Projects />
  </div>
</template>

<script setup>
import Hero from '@/components/MainPage/Hero.vue'
import AboutMe from '@/components/MainPage/AboutMe.vue'
import Projects from '@/components/MainPage/Projects.vue'
</script>