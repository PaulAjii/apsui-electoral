<template>
  <button @click="goBack">
    <v-icon name="md-arrowback-round" scale="1.2" animation="wrench" />
    <span>Back</span>
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.go('-1');
};
</script>

<style scoped>
button {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.95rem;
  color: black;
  border: 1px solid black;
  border-radius: 20px;
  transition: all 0.5s ease;
}

button:hover {
  color: white;
  background-color: black;
}
</style>
