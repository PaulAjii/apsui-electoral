<template>
  <SectionLayout customClass="results__section" sectionWrapper="results__wrapper">
    <nav class="nav__container">
      <BackButton />
      <div class="menu">
        <RouterLink to="/" class="nav__link">Home</RouterLink>
        <RouterLink to="/candidates" class="nav__link">Candidates</RouterLink>
        <RouterLink to="/voters" class="nav__link">Voters</RouterLink>
        <p class="nav__link active">Results</p>
      </div>
    </nav>

    <header class="results__header">
      <h2 class="section__title">Election Results</h2>
      <div class="results__summary">
        <span v-if="totalVotes > 0" class="summary__badge">Total Votes: {{ totalVotes }}</span>
      </div>
    </header>

    <div v-if="loading" class="loading">
      <p>Loading results...</p>
    </div>

    <div v-else-if="results.length === 0" class="no__results">
      <p>No voting results available yet</p>
    </div>

    <div v-else class="results__container">
      <div v-for="position in results" :key="position._id" class="position__card">
        <h3 class="position__title">{{ position._id }}</h3>
        <p class="position__total">Total Votes: {{ position.positionTotalVotes }}</p>

        <div class="candidates__list">
          <div
            v-for="candidate in sortedCandidates(position.candidates)"
            :key="candidate.alias"
            class="candidate__result"
          >
            <div class="candidate__info">
              <h4 class="candidate__name">{{ candidate.name }}</h4>
              <p class="candidate__alias">{{ candidate.alias }}</p>
            </div>

            <div class="candidate__stats">
              <div class="votes__display">
                <span class="votes__count">{{ candidate.yesVotes }}</span>
                <span class="votes__label">votes</span>
              </div>

              <div class="progress__bar">
                <div
                  class="progress__fill"
                  :style="{ width: getPercentage(candidate.yesVotes, position.positionTotalVotes) + '%' }"
                  :class="{ 'progress__fill--winner': isWinner(candidate, position.candidates) }"
                ></div>
              </div>

              <span class="votes__percentage">{{
                getPercentage(candidate.yesVotes, position.positionTotalVotes).toFixed(1)
              }}%</span>
            </div>

            <div v-if="expandedCandidate === candidate.alias" class="level__breakdown">
              <h5>Breakdown by Class</h5>
              <div class="breakdown__items">
                <div v-for="level in candidate.levelBreakdown" :key="level.level" class="breakdown__item">
                  <span class="breakdown__label">Level {{ level.level }}:</span>
                  <span class="breakdown__votes">{{ level.yesVotes }}</span>
                </div>
              </div>
            </div>

            <button
              class="expand__btn"
              @click="toggleExpanded(candidate.alias)"
              :aria-expanded="expandedCandidate === candidate.alias"
            >
              {{ expandedCandidate === candidate.alias ? '▼' : '▶' }} Details
            </button>
          </div>
        </div>
      </div>
    </div>
  </SectionLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import SectionLayout from '../layout/SectionLayout.vue';
import BackButton from '@/components/BackButton.vue';
import { getVoteResults } from '@/services/apiServices';

const results = ref([]);
const loading = ref(false);
const expandedCandidate = ref(null);
const toast = useToast();

const totalVotes = computed(() => {
  return results.value.reduce((sum, position) => sum + position.positionTotalVotes, 0);
});

const sortedCandidates = (candidates) => {
  return [...candidates].sort((a, b) => b.yesVotes - a.yesVotes);
};

const getPercentage = (votes, total) => {
  return total === 0 ? 0 : (votes / total) * 100;
};

const isWinner = (candidate, candidates) => {
  return candidate.yesVotes === Math.max(...candidates.map((c) => c.yesVotes));
};

const toggleExpanded = (alias) => {
  expandedCandidate.value = expandedCandidate.value === alias ? null : alias;
};

onMounted(async () => {
  loading.value = true;
  try {
    const data = await getVoteResults();
    results.value = data.results || [];
    if (results.value.length > 0) {
      toast.success('Election results loaded successfully');
    }
  } catch (error) {
    toast.error(error.message || 'Failed to load election results');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.results__header {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid rgb(236, 236, 236);
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.section__title {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: transparent;
  background: linear-gradient(90deg, rgb(76 175 80), rgb(255 152 0));
  background-clip: text;
  -webkit-background-clip: text;
}

.results__summary {
  display: flex;
  gap: 1rem;
}

.summary__badge {
  background: linear-gradient(90deg, rgb(76 175 80), rgb(255 152 0));
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.results__container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.position__card {
  background: white;
  border: 1px solid rgb(236, 236, 236);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.position__card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.position__title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  color: rgb(52, 52, 248);
}

.position__total {
  font-size: 0.9rem;
  color: rgb(120, 120, 120);
  margin-bottom: 1.2rem;
}

.candidates__list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.candidate__result {
  background: rgb(250, 250, 250);
  border-radius: 0.5rem;
  padding: 1rem;
  transition: background 0.3s ease;
}

.candidate__result:hover {
  background: rgb(245, 245, 245);
}

.candidate__info {
  margin-bottom: 0.75rem;
}

.candidate__name {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0 0 0.2rem 0;
  color: rgb(30, 30, 30);
}

.candidate__alias {
  font-size: 0.85rem;
  color: rgb(100, 100, 100);
  margin: 0;
  font-style: italic;
}

.candidate__stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.votes__display {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50px;
}

.votes__count {
  font-size: 1.3rem;
  font-weight: 700;
  color: rgb(76, 175, 80);
}

.votes__label {
  font-size: 0.75rem;
  color: rgb(120, 120, 120);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.progress__bar {
  flex: 1;
  height: 24px;
  background: rgb(240, 240, 240);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.progress__fill {
  height: 100%;
  background: linear-gradient(90deg, rgb(76, 175, 80), rgb(100, 200, 100));
  transition: width 0.6s ease, background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
}

.progress__fill--winner {
  background: linear-gradient(90deg, rgb(255, 152, 0), rgb(255, 193, 7));
  box-shadow: 0 0 10px rgba(255, 152, 0, 0.3);
}

.votes__percentage {
  min-width: 45px;
  text-align: right;
  font-weight: 600;
  font-size: 0.95rem;
  color: rgb(52, 52, 248);
}

.expand__btn {
  background: none;
  border: none;
  color: rgb(100, 100, 100);
  cursor: pointer;
  padding: 0.4rem 0;
  font-size: 0.85rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.expand__btn:hover {
  color: rgb(76, 175, 80);
}

.level__breakdown {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-left: 3px solid rgb(76, 175, 80);
  border-radius: 0.3rem;
}

.level__breakdown h5 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: rgb(52, 52, 248);
}

.breakdown__items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
}

.breakdown__item {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  padding: 0.4rem 0.5rem;
  background: rgb(245, 250, 245);
  border-radius: 0.3rem;
}

.breakdown__label {
  font-weight: 500;
  color: rgb(80, 80, 80);
}

.breakdown__votes {
  font-weight: 600;
  color: rgb(76, 175, 80);
}

.loading,
.no__results {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  font-size: 1.1rem;
  color: rgb(100, 100, 100);
}

@media screen and (min-width: 800px) {
  .results__header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .section__title {
    font-size: 2rem;
    margin-bottom: 0;
  }

  .position__card {
    padding: 2rem;
  }

  .candidate__stats {
    gap: 1.5rem;
  }

  .breakdown__items {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}

@media screen and (max-width: 600px) {
  .candidate__stats {
    flex-wrap: wrap;
  }

  .votes__percentage {
    order: 3;
    width: 100%;
    margin-top: 0.5rem;
  }

  .progress__bar {
    flex: 1 1 100%;
    order: 2;
  }
}
</style>
