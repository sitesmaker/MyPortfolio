import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  // {
  //   path: '/projects',
  //   name: 'Projects',
  //   component: () => import('@/views/ProjectsView.vue')
  // },
  // {
  //   path: '/projects/:slug',
  //   name: 'ProjectDetail',
  //   component: () => import('@/views/ProjectDetailView.vue')
  // },
  // {
  //   path: '/skills',
  //   name: 'Skills',
  //   component: () => import('@/views/SkillsView.vue')
  // },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/ContactView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router