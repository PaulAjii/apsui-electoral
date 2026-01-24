import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import { useVotersStore } from '@/store/voters';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },

    {
      path: '/polls',
      name: 'polls',
      component: () => import('../views/PollPage.vue')
    },

    {
      path: '/candidates',
      name: 'candidates',
      component: () => import('../views/CandidatesView.vue')
    },
    {
      path: '/voters/profile',
      name: 'Voters',
      component: () => import('../views/VotersProfile.vue')
    },
    {
      path: '/auth/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/reset-password',
      name: 'Reset Password',
      component: () => import('../views/ResetPassword.vue')
    },
    {
      path: '/voters',
      name: 'All Voters',
      component: () => import('../views/AllVoters.vue')
    }
  ]
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const store = useVotersStore();
  const protectedRoutes = ['/voters/profile', '/polls', '/candidates'];

  if (protectedRoutes.includes(to.path) && !token) {
    next('/');
    return;
  }
  if (to.path === '/polls' && store.voter?.hasVoted) {
    next('/voters/profile');
    return;
  }

  next();
});

export default router;
