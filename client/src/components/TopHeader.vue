<template>
  <header>
    <div class="wrapper">
      <p>APSUI VOTE</p>
      <span ref="circle1"></span>
      <span ref="circle2"></span>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const circle1 = ref(null)
const circle2 = ref(null)

onMounted(() => {
  const timeline = gsap.timeline({ repeat: -1 })

  timeline
    .to(
      circle1.value,
      {
        y: -5,
        duration: 2,
        ease: 'power1.inOut',
      },
      'sync',
    )
    .to(
      circle2.value,
      {
        y: 5,
        duration: 2,
        ease: 'power1.inOut',
      },
      'sync',
    )
    .to(
      circle1.value,
      {
        y: 5,
        duration: 2,
        ease: 'power1.inOut',
      },
      'sync2',
    )
    .to(
      circle2.value,
      {
        y: -5,
        duration: 2,
        ease: 'power1.inOut',
      },
      'sync2',
    )
    .to([circle1.value, circle2.value], {
      y: 0,
      duration: 2,
      ease: 'power1.inOut',
    })
    .to(
      circle1.value,
      {
        rotationY: '+=360',
        duration: 2,
        ease: 'power2.inOut',
      },
      'flip',
    )
    .to(
      circle2.value,
      {
        rotationX: '+=360',
        duration: 2,
        ease: 'power2.inOut',
      },
      'flip',
    )
})
</script>

<style scoped>
header {
  padding-block: 1rem;
}

.wrapper {
  display: flex;
  gap: 5px;
  align-items: center;
}

.wrapper > p {
  font-size: 24px;
  font-weight: 700;
  margin-right: 8px;
  letter-spacing: 2px;
}

span {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgb(255 152 0);
}

span:last-of-type {
  background-color: rgb(76 175 80);
}
</style>
