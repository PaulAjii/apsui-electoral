<template>
  <button class="logout__btn" type="button" @click="handleLogout">Logout</button>
</template>

<script setup>
import { useVotersStore } from '@/store/voters';
import { useRouter } from 'vue-router';

const store = useVotersStore();
const router = useRouter();

const handleLogout = async () => {
  await router.push('/auth/login');
  store.logout();
};
</script>

<style lang="css" scoped>
.logout__btn {
  font-size: 0.9rem;
  font-weight: 600;
  color: red;
  cursor: pointer;
}

.logout__btn:hover {
  text-decoration: underline;
}

@media screen and (min-width: 700px) {
  .logout__btn {
    font-size: 1.1rem;
  }
}
</style>
