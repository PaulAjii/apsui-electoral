<template>
  <SectionLayout customClass="candidates__section" sectionWrapper="candidates__wrapper">
    <nav class="nav__container">
      <BackButton />

      <div class="menu">
        <RouterLink to="/" class="nav__link">Home</RouterLink>
        <RouterLink to="/voters/profile" class="nav__link">Profile</RouterLink>
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

    <div class="candidates__layout" v-if="currentPosition" :key="currentPosition">
      <p class="legend">
        {{ currentCandidates.length > 1 ? `${currentPosition}s` : currentPosition }}
      </p>
      <p class="total__candidates">Number of Candidates: {{ currentCandidates.length }}</p>
      <div class="candidates__inner-wrapper" ref="pollContainer">
        <div
          v-for="candidate in currentCandidates"
          :key="candidate._id"
          :class="[
            'candidate',
            {
              selected: selectedVotes[currentPosition]?.includes(candidate._id)
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
            <p class="info__field" v-if="candidate.catchPhrase !== ''">
              <span class="label">Catchphrase: </span>{{ candidate.catchPhrase }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="navigation__controls" v-if="currentPosition">
      <div class="navigation__control-btns">
        <button class="nav__btn prev" @click="prevPosition" :disabled="currentIndex === 0">
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

        <button class="nav__btn skip" @click="nextPosition">
          {{ hasSelection ? 'Continue' : 'Skip' }}
        </button>
      </div>

      <button
        v-if="
          (currentIndex === Object.keys(groupedCandidates).length - 1 &&
            voterStore.voter.hasVoted === false) ||
          voterStore.voter.role !== 'admin'
        "
        class="nav__btn submit"
        @click="submitVotes"
        :disabled="loading || !hasAnyVotes || voterStore.voter.hasVoted"
      >
        {{ loading ? 'Submitting...' : 'Submit Votes' }}
      </button>
    </div>
  </SectionLayout>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';

import SectionLayout from '@/layout/SectionLayout.vue';
import BackButton from '@/components/BackButton.vue';
import gsap from 'gsap';
import { useToast } from 'vue-toastification';

import { getCandidates, castVote } from '@/services/apiServices';
import { useCandidatesStore } from '@/store/contestants';
import { useVotersStore } from '@/store/voters';
import router from '@/router';

const store = useCandidatesStore();
const voterStore = useVotersStore();
const toast = useToast();

const currentIndex = ref(0);
const selectedVotes = ref({});
const votedPositions = ref({});
const pollContainer = ref(null);
const total = ref(null);
const loading = ref(false);

const groupedCandidates = computed(() => {
  const groups = store.candidates.reduce((acc, candidate) => {
    const position = candidate.position;

    if (!acc[position]) {
      acc[position] = [];
    }

    if (position === 'Senate') {
      if (candidate.user.level === voterStore.voter.level) {
        acc[position].push(candidate);
      }
    } else {
      acc[position].push(candidate);
    }

    return acc;
  }, {});

  const filteredGroups = Object.entries(groups).reduce((acc, [position, candidates]) => {
    if (candidates.length > 0) {
      acc[position] = candidates;
    }
    return acc;
  }, {});

  total.value = Object.keys(filteredGroups).length;
  return filteredGroups;
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
  const position = currentPosition.value;
  const votes = selectedVotes.value[position];

  if (position === 'Senate') {
    return votes?.length > 0 && votes.length <= 3;
  }

  return votes?.length === 1;
});

const selectCandidate = (candidateId) => {
  const position = currentPosition.value;

  if (position === 'Senate') {
    if (!selectedVotes.value[position]) {
      selectedVotes.value[position] = [];
    }

    const senateVotes = selectedVotes.value[position];

    if (senateVotes.includes(candidateId)) {
      selectedVotes.value[position] = senateVotes.filter((id) => id !== candidateId);
      votedPositions.value[position] = selectedVotes.value[position].length > 0;
    } else if (senateVotes.length < 3) {
      selectedVotes.value[position] = [...senateVotes, candidateId];
      votedPositions.value[position] = true;
    } else {
      toast.error('Maximum of 3 senate votes allowed');
      return;
    }
  } else {
    selectedVotes.value[position] = [candidateId];
    votedPositions.value[position] = true;
  }
};

const hasAnyVotes = computed(() => {
  return Object.values(selectedVotes.value).some(
    (votes) => Array.isArray(votes) && votes.length > 0
  );
});

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

const formatVotes = () => {
  const formattedVotes = Object.entries(selectedVotes.value).map(([position, candidateIds]) => ({
    position,
    candidateIds: Array.isArray(candidateIds) ? candidateIds : [candidateIds]
  }));

  return { votes: formattedVotes };
};

const submitVotes = async () => {
  try {
    loading.value = true;
    const voteData = formatVotes();

    const response = await castVote(voteData, voterStore);

    if (response.status === 'success') {
      toast.success(response.message);
    }
  } catch (err) {
    toast.error(err.message);
  } finally {
    loading.value = false;

    setTimeout(() => {
      router.push('/voters/profile');
    }, 3000);
  }
};
onMounted(async () => {
  try {
    loading.value = true;
    if (store.candidates.length === 0) {
      const response = await getCandidates(store);

      if (response.status === 'success') {
        toast.success('Candidates fetched successfully');
      }
    }
  } catch (error) {
    toast.err(error.message);
  } finally {
    loading.value = false;
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
  font-size: 0.875rem;
  font-weight: 600;
}

.candidates__layout {
  padding: 1rem;
  display: grid;
  gap: 2rem;
}

.legend {
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: left;
  margin-bottom: 0.5rem;
  padding-inline: 1rem;
}

.candidates__inner-wrapper {
  height: 300px;
  display: flex;
  gap: 1rem;
  padding-inline: 1rem;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
}

.candidates__inner-wrapper::-webkit-scrollbar {
  height: 8px;
}

.candidates__inner-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}

.candidates__inner-wrapper::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 8px;
  border: 2px solid #f1f1f1;
}

.candidates__inner-wrapper::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.candidate {
  padding-top: 1rem;
  scroll-snap-align: start;
  max-width: 250px;
  max-height: 250px;
}

.navigation__controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.navigation__control-btns {
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav__btn {
  width: 20%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.progress__pagination {
  display: flex;
  align-items: center;
  gap: 5px;
  position: relative;
}

.progress__nums {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
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

.candidate.selected {
  border: 1px solid #4caf50;
  transform: scale(1.01);
}

.nav__btn.submit {
  width: 100%;
  padding-block: 0.5rem;
  background-color: #4caf50;
  color: white;
  font-weight: bold;
}

.nav__btn.submit:disabled {
  border: 1px solid #cccccc;
  background-color: #cccccc;
  cursor: not-allowed;
}

@media screen and (min-width: 700px) {
  .votes {
    font-size: 1.2rem;
  }

  .candidates__layout {
    padding: 0 1rem 2rem;
  }

  .legend {
    font-size: 1.1rem;
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

  .nav__btn {
    font-size: 1rem;
  }

  .progress__nums {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

  .candidates__inner-wrapper {
    height: 350px;
    gap: 2rem;
  }

  .candidate {
    max-width: 320px;
    max-height: 320px;
  }

  .total__candidates {
    margin-bottom: 0;
  }
}
</style>
