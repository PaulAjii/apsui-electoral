<template>
  <SectionLayout customClass="poll__section" sectionWrapper="poll__wrapper">
    <nav class="nav__container">
      <BackButton />

      <div class="menu">
        <RouterLink to="/" class="nav__link">Home</RouterLink>
        <RouterLink to="/candidates" class="nav__link">Candidates</RouterLink>
        <p class="nav__link active">Poll</p>
        <RouterLink to="/results" class="nav__link">Results</RouterLink>
      </div>
    </nav>

    <header class="poll__header">
      <h2 class="section__title">Poll</h2>
    </header>

    <div v-if="hasSenatePosition" class="senate-votes-info">
      <p>Senate Votes Remaining: {{ remainingSenateVotes }}/3</p>
    </div>

    <div class="candidates__wrapper">
      <div v-for="position in positions" :key="position" class="position-group">
        <h3>{{ position }}</h3>
        <div class="candidates-list">
          <div
            v-for="candidate in getFilteredCandidates(position)"
            :key="candidate._id"
            class="candidate-card"
            :class="{ disabled: isVotingDisabled(candidate) }"
          >
            <div class="candidate__img">
              <img :src="candidate.imageURL" :alt="candidate.alias" />
            </div>
            <div class="candidate__info">
              <p class="info__field"><span class="label">Name: </span>{{ candidate.name }}</p>
              <p class="info__field"><span class="label">Alias: </span>{{ candidate.alias }}</p>
              <p class="info__field">
                <span class="label">Position: </span>{{ candidate.position }}
              </p>
            </div>
            <button @click="handleVote(candidate)" :disabled="isVotingDisabled(candidate)">
              Vote
            </button>
          </div>
        </div>
      </div>
    </div>
  </SectionLayout>
</template>

<script setup>
import SectionLayout from '../layout/SectionLayout.vue';
import BackButton from '@/components/BackButton.vue';
import { ref, computed } from 'vue';
import { useAuthStore } from '../store/auth';
import { useCandidatesStore } from '../store/contestants';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const candidatesStore = useCandidatesStore();
const toast = useToast();

const positions = ref(['President', 'Vice President', 'Senate']);
const senateVotes = ref([]);

const remainingSenateVotes = computed(() => {
  return 3 - senateVotes.value.length;
});

const hasSenatePosition = computed(() => {
  return positions.value.includes('Senate');
});

const getFilteredCandidates = (position) => {
  return candidatesStore.candidates.filter((candidate) => {
    if (candidate.position === 'Senate') {
      return candidate.user.level === authStore.user.level;
    }
    return candidate.position === position;
  });
};

const isVotingDisabled = (candidate) => {
  if (candidate.position === 'Senate') {
    return senateVotes.value.length >= 3 && !senateVotes.value.includes(candidate._id);
  }
  return false;
};

const handleVote = async (candidate) => {
  try {
    if (candidate.position === 'Senate') {
      if (senateVotes.value.includes(candidate._id)) {
        senateVotes.value = senateVotes.value.filter((id) => id !== candidate._id);
      } else if (senateVotes.value.length < 3) {
        senateVotes.value.push(candidate._id);
      } else {
        toast.error('You can only vote for up to 3 Senate candidates');
        return;
      }
    }
    toast.success(`Vote recorded for ${candidate.name}`);
  } catch (error) {
    toast.error(error.message);
  }
};
</script>

<style scoped>
.poll__header {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid rgb(236, 236, 236);
  padding-bottom: 0.5rem;
}

.section__title {
  font-size: 1.2rem;
  margin-bottom: 0.9rem;
  color: transparent;
  background: linear-gradient(90deg, rgb(76 175 80), rgb(255 152 0));
  background-clip: text;
  --webkit-background-clip: text;
  --moz-background-clip: text;
}

.senate-votes-info {
  background: #f5f5f5;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-weight: 500;
}

.candidates__wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.position-group {
  margin-bottom: 1rem;
}

.candidates-list {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.candidate-card {
  border: 1px solid rgb(236, 236, 236);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.3s ease;
}

.candidate-card:hover {
  transform: translateY(-5px);
}

.candidate-card.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.candidate-card button {
  padding: 0.5rem 1rem;
  background: rgb(76 175 80);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.candidate-card button:hover {
  background: rgb(56 142 60);
}

.candidate-card button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.candidate__img {
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1px solid rgb(209, 209, 209);
}

.candidate__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.candidate__info > .info__field {
  font-size: 0.875rem;
}

.candidate__info > .info__field > .label {
  font-weight: 700;
  letter-spacing: 1px;
}
</style>
