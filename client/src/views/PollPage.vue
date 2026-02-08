<template>
  <SectionLayout
    customClass="candidates__section"
    sectionWrapper="candidates__wrapper"
  >
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

    <div class="poll__main-content">
      <div
        class="candidates__layout"
        v-if="currentPosition"
        :key="currentPosition"
      >
        <div class="sticky__stats">
          <p class="legend">
            {{ currentPosition }}
          </p>
          <p class="total__candidates">
            Number of Candidates: {{ currentCandidates.length }}
          </p>
        </div>

        <div class="candidates__inner-wrapper" ref="pollContainer">
          <div
            v-for="candidate in currentCandidates"
            :key="candidate._id"
            :class="[
              'candidate',
              {
                selected: selectedVotes[currentPosition]?.includes(
                  candidate._id
                ),
              },
            ]"
            @click="selectCandidate(candidate._id)"
          >
            <div class="candidate__img">
              <img :src="candidate.imageURL" :alt="candidate.alias" />
            </div>

            <div class="candidate__info">
              <p class="info__field">
                <span class="label">Name: </span>{{ candidate.name }}
              </p>
              <p class="info__field">
                <span class="label">Alias: </span>{{ candidate.alias }}
              </p>
              <p class="info__field" v-if="candidate.catchPhrase !== ''">
                <span class="label">Catchphrase: </span>{{ candidate.catchPhrase }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="navigation__controls" v-if="currentPosition">
        <div class="navigation__control-btns">
          <button
            class="nav__btn prev"
            @click="prevPosition"
            :disabled="currentIndex === 0"
          >
            Previous
          </button>

          <div class="progress__pagination">
            <button
              v-for="(position, index) in Object.keys(groupedCandidates)"
              :key="index"
              :class="[
                'progress__nums',
                {
                  active: currentIndex === index,
                  completed: votedPositions[position],
                },
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
    </div>
  </SectionLayout>

  <div v-if="showConfirmation" class="confirmation__overlay">
    <div class="confirmation__modal">
      <h3 class="confirmation__title">Confirm Your Votes</h3>
      <p class="confirmation__message">
        You have selected candidates for
        {{ Object.keys(selectedVotes).length }} position(s). Please review your
        selections carefully.
      </p>
      <p class="confirmation__warning">
        ⚠️ Once submitted, you cannot vote again!
      </p>

      <div class="confirmation__actions">
        <button
          class="btn cancel__btn"
          @click="cancelSubmission"
          :disabled="loading"
        >
          Cancel
        </button>
        <button
          class="btn confirm__btn"
          @click="confirmSubmission"
          :disabled="loading"
        >
          {{ loading ? 'Submitting...' : 'Confirm & Submit' }}
        </button>
      </div>
    </div>
  </div>
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

const positionOrder = {
  'Special Duties Officer': 1,
  'Social Director': 2,
  'Financial Secretary': 3,
  'Sports Secretary': 4,
  'Public Relations Officer': 5,
  Treasurer: 6,
  'Assistant General Secretary': 7,
  'General Secretary': 8,
  'Vice President': 9,
  President: 10,
  Senate: 11,
};

const currentIndex = ref(0);
const selectedVotes = ref({});
const votedPositions = ref({});
const pollContainer = ref(null);
const total = ref(null);
const loading = ref(false);
const showConfirmation = ref(false);

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

  const filteredGroups = Object.entries(groups).reduce(
    (acc, [position, candidates]) => {
      if (candidates.length > 0) {
        acc[position] = candidates;
      }
      return acc;
    },
    {}
  );

  const sortedGroups = {};
  const sortedKeys = Object.keys(filteredGroups).sort(
    (a, b) => (positionOrder[a] || 999) - (positionOrder[b] || 999)
  );

  sortedKeys.forEach((key) => {
    sortedGroups[key] = filteredGroups[key];
  });

  total.value = Object.keys(sortedGroups).length;
  return sortedGroups;
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
      selectedVotes.value[position] = senateVotes.filter(
        (id) => id !== candidateId
      );
      votedPositions.value[position] =
        selectedVotes.value[position].length > 0;
      if (selectedVotes.value[position].length === 0) {
        delete selectedVotes.value[position];
      }
    } else if (senateVotes.length < 3) {
      selectedVotes.value[position] = [...senateVotes, candidateId];
      votedPositions.value[position] = true;
    } else {
      toast.error('Maximum of 3 senate votes allowed');
      return;
    }
  } else {
    if (selectedVotes.value[position]?.includes(candidateId)) {
      delete selectedVotes.value[position];
      votedPositions.value[position] = false;
    } else {
      selectedVotes.value[position] = [candidateId];
      votedPositions.value[position] = true;
    }
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
  const formattedVotes = Object.entries(selectedVotes.value)
    .filter(
      ([_, candidateIds]) =>
        Array.isArray(candidateIds) && candidateIds.length > 0
    )
    .map(([position, candidateIds]) => ({
      position,
      candidateIds: Array.isArray(candidateIds) ? candidateIds : [candidateIds],
    }));

  return { votes: formattedVotes };
};

const submitVotes = async () => {
  showConfirmation.value = true;
};

const confirmSubmission = async () => {
  try {
    loading.value = true;
    showConfirmation.value = false;
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
    }, 1000);
  }
};

const cancelSubmission = () => {
  showConfirmation.value = false;
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
    toast.error(error.message);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* Main Content vertical scroll wrapper */
.poll__main-content {
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  /* Calculated height to allow scrolling of middle content */
  height: calc(100dvh - 220px);
  padding-top: 0.25rem; /* Reduced top padding */
  padding-bottom: 0.5rem; /* Reduced bottom padding */
}

/* Tiny Gray Scrollbar matching AllVoters style but thinner */
.poll__main-content::-webkit-scrollbar {
  width: 6px;
}

.poll__main-content::-webkit-scrollbar-track {
  background: transparent;
}

.poll__main-content::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

.poll__main-content::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

/* Sticky stats for fixed position info during scroll */
.sticky__stats {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 5;
  padding: 0.25rem 0.75rem; /* Reduced padding */
  border-bottom: 1px solid transparent;
}

.candidate__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  border-bottom: 1px solid rgb(236, 236, 236);
  padding-bottom: 0.5rem;
  gap: 1rem;
}

.section__title {
  color: transparent;
  background: linear-gradient(90deg, rgb(76 175 80), rgb(255 152 0));
  background-clip: text;
  --webkit-background-clip: text;
  --moz-background-clip: text;
  font-size: 1rem;
}

.votes {
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.candidates__layout {
  padding: 0.5rem 0.75rem; /* Reduced vertical padding */
  display: grid;
  gap: 0.25rem;
}

.legend {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-align: left;
  margin-bottom: 0.25rem; /* Reduced */
}

.total__candidates {
  font-size: 0.75rem;
  color: rgb(120, 120, 120);
  margin-bottom: 0.5rem; /* Reduced */
}

.candidates__inner-wrapper {
  height: 280px;
  display: flex;
  gap: 0.75rem;
  padding-inline: 0.75rem;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
}

.candidates__inner-wrapper::-webkit-scrollbar {
  height: 6px;
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

.candidate {
  padding-top: 0.75rem;
  scroll-snap-align: start;
  max-width: 220px;
  min-width: 220px;
  max-height: 260px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.candidate__img {
  width: 100%;
  height: 150px;
  overflow: hidden;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.candidate__img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.candidate__info {
  padding: 0.5rem;
  font-size: 0.7rem;
}

.info__field {
  margin: 0.25rem 0;
  line-height: 1.2;
}

.label {
  font-weight: 600;
  color: rgb(52, 52, 248);
}

.navigation__controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem; /* Reduced padding */
}

.navigation__control-btns {
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.nav__btn {
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  transition: all 0.3s ease;
}

.nav__btn:hover:not(:disabled) {
  background: #f0f0f0;
}

.nav__btn.prev,
.nav__btn.skip {
  flex: 1;
}

.progress__pagination {
  display: flex;
  align-items: center;
  gap: 3px;
  flex: 1.5;
  justify-content: center;
  flex-wrap: wrap;
}

.progress__nums {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid #ddd;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 2px;
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
  border: 2px solid #4caf50;
  transform: scale(0.98);
}

.nav__btn.submit {
  width: 100%;
  padding: 0.75rem;
  background-color: #4caf50;
  color: white;
  font-weight: bold;
  border: none;
  margin-top: 0.25rem; /* Reduced */
}

.nav__btn.submit:hover:not(:disabled) {
  background-color: #45a049;
}

.nav__btn.submit:disabled {
  border: 1px solid #cccccc;
  background-color: #cccccc;
  cursor: not-allowed;
}

.nav__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media screen and (min-width: 480px) {
  .section__title {
    font-size: 1.3rem;
  }
  .votes {
    font-size: 0.85rem;
  }
  .candidates__layout {
    padding: 0.75rem 1rem;
  }
  .poll__main-content {
    height: calc(100dvh - 250px);
  }
}

@media screen and (min-width: 700px) {
  .section__title {
    font-size: 1.8rem;
  }
  .votes {
    font-size: 1.2rem;
  }
  .candidates__layout {
    padding: 0 1rem 1.5rem;
    gap: 1.5rem;
  }
  .nav__btn {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
  .progress__nums {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-size: 0.8rem;
  }
  .candidates__inner-wrapper {
    height: 350px;
  }
}

/* Confirmation Modal Styles kept as provided */
.confirmation__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.confirmation__modal {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.confirmation__title {
  font-size: 1.2rem;
  color: rgb(52, 52, 248);
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.confirmation__message {
  color: rgb(60, 60, 60);
  margin: 0 0 0.5rem 0;
  line-height: 1.6;
}

.confirmation__warning {
  background: rgb(255, 242, 204);
  border-left: 4px solid rgb(255, 152, 0);
  padding: 0.75rem;
  color: rgb(140, 90, 0);
  margin: 1rem 0;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.9rem;
}

.confirmation__actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel__btn {
  background: rgb(240, 240, 240);
  color: rgb(60, 60, 60);
}

.cancel__btn:hover:not(:disabled) {
  background: rgb(220, 220, 220);
}

.confirm__btn {
  background: #4caf50;
  color: white;
}

.confirm__btn:hover:not(:disabled) {
  background: #45a049;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>