<template>
  <section :class="['section', customClass]">
    <div class="wrapper">
      <div :class="sectionWrapper">
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  customClass: {
    type: String,
    required: true,
  },

  sectionWrapper: {
    type: String,
    required: true,
  },
})
</script>
