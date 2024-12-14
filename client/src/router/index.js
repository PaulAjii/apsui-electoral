import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import PollPage from '../views/PollPage.vue'
import InstructionsPage from '../views/InstructionsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },

    {
      path: '/instructions',
      name: 'instructions',
      component: InstructionsPage,
    },

    {
      path: '/polls',
      name: 'polls',
      component: PollPage,
    },

    {
      path: '/candidates',
      name: 'candidates',
      component: () => import('../views/CandidatesView.vue'),
    },
  ],
})

export default router
