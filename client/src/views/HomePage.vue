<template>
  <SectionLayout customClass="hero" sectionWrapper="hero__wrapper">
    <div class="text">
      <h1 class="hero__text">
        <span>
          your VOTE
          <v-icon name="gi-vote" animation="float" scale="2" fill="rgb(255 152 0)" />
        </span>
        <br />
        <span>
          your POWER
          <v-icon name="gi-muscle-up" animation="float" scale="2" fill="rgb(76 175 80)" />
        </span>
      </h1>

      <p class="subtitle">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laudantium ratione itaque, vel
        eius temporibus suscipit similique distinctio maxime cupiditate voluptatem.
      </p>

      <div class="cta__btns">
        <CtaButton link="/candidates" text="Candidates List" />
        <CtaButton link="/polls" text="Go to Poll" btnClass="cta__btn-alt" />
      </div>
    </div>
    <!-- <div class="img__bg"></div> -->
  </SectionLayout>

  <div
    v-for="(box, i) in boxes"
    :key="i"
    ref="boxesRefs"
    :class="'box'"
    :style="{
      width: box.size + 'rem',
      height: box.size + 'rem',
      background: box.color,
      borderRadius: box.borderRadius,
      top: box.top + 'dvh',
      left: box.left + 'dvh',
    }"
  ></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

import SectionLayout from '@/layout/SectionLayout.vue'
import CtaButton from '@/components/CtaButton.vue'

const boxesRefs = ref([])

const generateRandom = (min, max) => Math.random() * (max - min) + min
const generateColour = () =>
  `linear-gradient(135deg, hsla(${generateRandom(0, 360)}, 80%, 60%, 0.5), hsla(${generateRandom(0, 360)}, 80%, 60%, 0.5))`

const boxes = Array.from({ length: 50 }, () => ({
  size: generateRandom(2, 8),
  color: generateColour(),
  borderRadius: `${generateRandom(10, 80)}% ${generateRandom(10, 80)}% ${generateRandom(10, 80)}% ${generateRandom(10, 80)}% / ${generateRandom(10, 80)}% ${generateRandom(10, 80)}% ${generateRandom(10, 80)}% ${generateRandom(10, 80)}%`,
  top: generateRandom(-10, 170),
  left: generateRandom(-10, 170),
}))

onMounted(() => {
  boxesRefs.value.forEach((box) => {
    const duration = generateRandom(2, 5)
    const xMove = generateRandom(0, 50)
    const yMove = generateRandom(0, 60)
    const zMove = generateRandom(-30, 70)

    gsap.to(box, {
      x: xMove + 'rem',
      y: yMove + 'rem',
      z: zMove + 'rem',
      duration,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
    })
  })
})
</script>

<style scoped>
.text {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 50%;
}

.text > .hero__text {
  font-size: 40px;
  text-transform: capitalize;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 1.5rem;
  line-height: 100%;
}

.hero__text > span {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.text > .subtitle {
  font-size: 20px;
  width: 80%;
  line-height: 200%;
  margin-bottom: 1rem;
}

.text > .cta__btns {
  display: flex;
  gap: 2.5rem;
}

.box {
  position: absolute;
  z-index: -1;
}
</style>
