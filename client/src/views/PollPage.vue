<template>
  <SectionLayout customClass="candidates__section" sectionWrapper="candidates__wrapper">
    <BackButton />

    <header class="candidate__header">
      <h2 class="section__title">The Polls</h2>

      <p class="votes">
        Number of votes cast:
        <span class="cast__votes">0</span>
        /
        <span class="total__votes-available">
          {{ store.candidates.length }}
        </span>
      </p>
    </header>

    <div class="candidates__layout">
      <fieldset v-for="(candidates, position) in groupedCandidates" :key="position">
        <legend>{{ position }}(s)</legend>
        <div class="candidates__inner-wrapper">
          <div v-for="candidate in candidates" :key="candidate._id" class="candidate">
            <div class="candidate__img">
              <img :src="candidate.imageURL" :alt="candidate.alias" />
            </div>

            <div class="candidate__info">
              <p class="info__field"><span class="label">Name: </span>{{ candidate.name }}</p>
              <p class="info__field"><span class="label">Alias: </span>{{ candidate.alias }}</p>
              <p class="info__field">
                <span class="label">Level: </span>{{ candidate.user.level }}
              </p>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  </SectionLayout>
</template>

<script setup>
import { onMounted, computed } from 'vue';

import SectionLayout from '@/layout/SectionLayout.vue';
import BackButton from '@/components/BackButton.vue';

import { useCandidatesStore } from '@/store/contestants';
const store = useCandidatesStore();

const groupedCandidates = computed(() => {
  return store.candidates.reduce((groups, candidate) => {
    const position = candidate.position;

    if (!groups[position]) {
      groups[position] = [];
    }

    groups[position].push(candidate);

    return groups;
  }, {});
});

onMounted(() => {
  if (store.candidates.length === 0) {
    store.fetchCandidates();
  }
});
</script>

<style scoped>
.candidate__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  border-bottom: 1px solid rgb(236, 236, 236);
  padding-bottom: 0.5rem;
}

.section__title {
  color: transparent;
  background: linear-gradient(90deg, rgb(76 175 80), rgb(255 152 0));
  background-clip: text;
  --webkit-background-clip: text;
  --moz-background-clip: text;
}

.votes {
  font-size: 1.2rem;
  font-weight: 600;
}

.candidates__layout {
  padding-block: 2rem;
  display: grid;
  gap: 2rem;
}

fieldset {
  /* border: 1px solid rgb(236, 236, 236); */
  border: none;
  border-radius: 1rem;
  padding: 1rem 0.5rem;
}

legend {
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 1rem;
}
</style>
