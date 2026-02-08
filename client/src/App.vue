<template>
  <TopHeader />
  <router-view />
  <Analytics />
</template>

<script setup>
import TopHeader from './components/TopHeader.vue'
import { Analytics } from '@vercel/analytics/vue';
</script>
