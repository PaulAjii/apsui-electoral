import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import { useVotersStore } from '@/store/voters';
import { clearToken, getToken } from '@/services/tokenService';

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
      path: '/instructions',
      name: 'instructions',
      component: () => import('../views/InstructionsPage.vue')
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
    },
    {
      path: '/results',
      name: 'Results',
      component: () => import('../views/ResultsView.vue')
    }
  ]
});

router.beforeEach((to, from, next) => {
  const token = getToken();
  const store = useVotersStore();
  const protectedRoutes = ['/voters/profile', '/polls', '/instructions', '/candidates', '/reset-password', '/voters', '/results'];

  if (protectedRoutes.includes(to.path) && !token) {
    clearToken();
    next('/auth/login');
    return;
  }

  if (to.path === '/polls' && localStorage.getItem('hasSeenInstructions') !== 'true') {
    next('/instructions');
    return;
  }

  if ((to.path === '/polls' || to.path === '/instructions') && store.voter?.hasVoted) {
    next('/voters/profile');
    return;
  }

  next();
});

export default router;
