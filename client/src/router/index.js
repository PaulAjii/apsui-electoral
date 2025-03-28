import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import InstructionsPage from '../views/InstructionsPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },

    // {
    //   path: '/instructions',
    //   name: 'instructions',
    //   component: InstructionsPage
    // },

    // {
    //   path: '/polls',
    //   name: 'polls',
    //   component: () => import('../views/PollPage.vue')
    // },

    {
      path: '/candidates',
      name: 'candidates',
      component: () => import('../views/CandidatesView.vue')
    },
    {
      path: '/voters',
      name: 'Voters',
      component: () => import('../views/VotersProfile.vue')
    }
  ]
});

export default router;
