<template>
  <router-link :to="link" :class="['cta__btn', btnClass]">
    {{ text }}
    <v-icon name="bi-arrow-up-right" animation="float" />
  </router-link>
</template>

<script setup>
defineProps({
  link: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  btnClass: String
});
</script>

<style scoped>
a {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

@media screen and (min-width: 700px) {
  a {
    font-size: 1.1rem;
  }
}
</style>
