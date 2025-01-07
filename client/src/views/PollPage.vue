<template>
  <SectionLayout customClass="candidates__section" sectionWrapper="candidates__wrapper">
    <nav class="nav__container">
      <BackButton />

      <div class="menu">
        <RouterLink to="/" class="nav__link">Home</RouterLink>
        <RouterLink to="/candidates" class="nav__link">Candidates</RouterLink>
        <p class="nav__link active">Poll</p>
      </div>
    </nav>

    <header class="candidate__header">
      <h2 class="section__title">The Poll</h2>

      <p class="votes">
        Number of votes cast:
        <span class="cast__votes">{{ currentPosition ? votes : 0 }}</span>
        /
        <span class="total__votes-available">
          {{ currentPosition ? total : 0 }}
        </span>
      </p>
    </header>

    <div class="candidates__layout" ref="pollContainer">
      <fieldset v-if="currentPosition" :key="currentPosition">
        <legend>
          {{ currentCandidates.length > 1 ? `${currentPosition}s` : currentPosition }}
        </legend>
        <p class="total__candidates">Number of Candidates: {{ currentCandidates.length }}</p>
        <div class="candidates__inner-wrapper">
          <div
            v-for="candidate in currentCandidates"
            :key="candidate._id"
            :class="[
              'candidate',
              {
                selected: selectedVotes[currentPosition] === candidate._id
              }
            ]"
            @click="selectCandidate(candidate._id)"
          >
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

    <div class="navigation-controls" v-if="currentPosition">
      <button class="nav-btn prev" @click="prevPosition" :disabled="currentIndex === 0">
        Previous
      </button>

      <!-- Progress Indicators -->
      <div class="progress__pagination">
        <button
          v-for="(position, index) in Object.keys(groupedCandidates)"
          :key="index"
          :class="[
            'progress__nums',
            {
              active: currentIndex === index,
              completed: votedPositions[position]
            }
          ]"
          @click="navigateToPosition(index)"
        >
          {{ index + 1 }}
        </button>
      </div>

      <button class="nav-btn skip" @click="nextPosition">
        {{ hasSelection ? 'Continue' : 'Skip' }}
      </button>
    </div>
  </SectionLayout>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';

import SectionLayout from '@/layout/SectionLayout.vue';
import BackButton from '@/components/BackButton.vue';
import gsap from 'gsap';

import { useCandidatesStore } from '@/store/contestants';
const store = useCandidatesStore();

const currentIndex = ref(0);
const selectedVotes = ref({});
const votedPositions = ref({});
const pollContainer = ref(null);
const total = ref(null);

const groupedCandidates = computed(() => {
  return store.candidates.reduce((groups, candidate) => {
    const position = candidate.position;

    if (!groups[position]) {
      groups[position] = [];
    }

    groups[position].push(candidate);

    total.value = Object.keys(groups).length;
    return groups;
  }, {});
});

const votes = computed(() => {
  return Object.keys(selectedVotes.value).length;
});

const currentPosition = computed(() => {
  return Object.keys(groupedCandidates.value)[currentIndex.value];
});

const currentCandidates = computed(() => {
  return groupedCandidates.value[currentPosition.value] || [];
});

const hasSelection = computed(() => {
  return selectedVotes.value[currentPosition.value] !== undefined;
});

const selectCandidate = (candidateId) => {
  selectedVotes.value[currentPosition.value] = candidateId;
  votedPositions.value[currentPosition.value] = true;
};

const animateTransition = (direction) => {
  const container = pollContainer.value;
  gsap.fromTo(
    container,
    { x: direction === 'next' ? '100%' : '-100%', opacity: 0 },
    { x: '0%', opacity: 1, duration: 0.5, ease: 'power2.out' }
  );
};

const nextPosition = () => {
  if (currentIndex.value < Object.keys(groupedCandidates.value).length - 1) {
    animateTransition('next');
    currentIndex.value++;
  }
};

const prevPosition = () => {
  if (currentIndex.value > 0) {
    animateTransition('prev');
    currentIndex.value--;
  }
};

const navigateToPosition = (index) => {
  const direction = index > currentIndex.value ? 'next' : 'prev';
  animateTransition(direction);
  currentIndex.value = index;
};

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
  border: 1px solid rgb(220, 220, 220);
  border-radius: 1rem;
  padding: 0 1rem 1.5rem;
}

legend {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 1rem;
  padding-inline: 1rem;
}

.progress__pagination {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-block: 1rem 0;
  position: relative;
}

.progress__pagination::after,
.progress__pagination::before {
  content: '';
  position: absolute;
  top: 50%;

  background-color: green;
  width: 100px;
  height: 2.5px;
}

.progress__pagination::after {
  right: 50%;
  transform: translateX(-80%);
}

.progress__pagination::before {
  left: 50%;
  transform: translateX(80%);
}

.progress__nums {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.15rem 0.45rem;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.progress__nums.active {
  border-color: #4caf50;
  background: #4caf50;
  color: white;
}

.progress__nums.completed {
  background: #2196f3;
  border-color: #2196f3;
  color: white;
}

.navigation-controls {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.nav-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.candidate.selected {
  border: 1px solid #4caf50;
  transform: scale(1.01);
}
</style>
