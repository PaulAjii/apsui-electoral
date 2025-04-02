<template>
  <SectionLayout customClass="candidates__section" sectionWrapper="candidates__wrapper">
    <nav class="nav__container">
      <BackButton />

      <div class="menu">
        <RouterLink to="/" class="nav__link">Home</RouterLink>
        <p class="nav__link active">Candidates</p>
        <!-- <RouterLink to="/polls" class="nav__link">Poll</RouterLink> -->
      </div>
    </nav>
    <header class="candidate__header">
      <h2 class="section__title">Candidates</h2>

      <div class="actions">
        <button type="button" @click="showModal = true">
          <v-icon name="bi-plus" scale="1.5" />
          <span>New</span>
        </button>

        <input
          type="text"
          name="search"
          v-model="searchTerm"
          placeholder="Search by name, alias, position..."
        />
      </div>
    </header>

    <p class="total__candidates">Total Number of Candidates: {{ filteredCandidates.length }}</p>

    <div class="candidates__inner-wrapper" v-if="filteredCandidates.length !== 0">
      <div v-for="candidate in filteredCandidates" :key="candidate._id" class="candidate">
        <div class="action__btns">
          <button class="action__btn" @click="handleEditClick(candidate)">
            <v-icon name="fa-edit" scale="1.2" fill="black" />
          </button>

          <button class="action__btn" @click="handleDeleteCandidate(candidate._id)">
            <v-icon name="md-deleteoutline-sharp" scale="1.2" fill="red" />
          </button>
        </div>
        <div class="candidate__img">
          <img :src="candidate.imageURL" :alt="candidate.alias" />
        </div>

        <div class="candidate__info">
          <p class="info__field"><span class="label">Name: </span>{{ candidate.name }}</p>
          <p class="info__field"><span class="label">Alias: </span>{{ candidate.alias }}</p>
          <p class="info__field"><span class="label">Level: </span>{{ candidate.user.level }}</p>
          <p class="info__field"><span class="label">Position: </span>{{ candidate.position }}</p>
          <p class="info__field">
            <span class="label">Catchphrase: </span>{{ candidate.catchPhrase }}
          </p>
        </div>
      </div>
    </div>

    <div v-else class="not__found">No Candidate found</div>

    <AddCandidate
      v-if="showModal"
      @close="showModal = false"
      @submit="handleAddCandidate"
      :loading="loading"
    />
    <EditCandidate
      v-if="showEditModal"
      :candidate="selectedCandidate"
      @close="showEditModal = false"
      @submit="handleEditCandidate"
    />
  </SectionLayout>
</template>

<script setup>
import SectionLayout from '../layout/SectionLayout.vue';
import { useCandidatesStore } from '../store/contestants.js';
import { onMounted, ref, computed } from 'vue';
import AddCandidate from '@/components/AddCandidate.vue';
import EditCandidate from '@/components/EditCandidate.vue';
import { useToast } from 'vue-toastification';
import BackButton from '@/components/BackButton.vue';
import {
  getCandidates,
  createCandidate,
  deleteCandidate,
  editCandidate
} from '@/services/apiServices';

const store = useCandidatesStore();

const toast = useToast();
const loading = ref(false);

const showModal = ref(false);
const showEditModal = ref(false);
const selectedCandidate = ref(null);

const searchTerm = ref('');

const handleAddCandidate = async (candidateData) => {
  try {
    loading.value = true;
    const response = await createCandidate(candidateData, store);

    if (response.status === 'success') {
      showModal.value = false;
      toast.success('Candidate added successfully');
    }
  } catch (err) {
    showModal.value = false;
    toast.error(err.message);
  } finally {
    loading.value = false;
  }
};

const handleDeleteCandidate = async (id) => {
  if (confirm('Are you sure you want to delete this candidate?')) {
    try {
      loading.value = true;
      const response = await deleteCandidate(id, store);

      if (response.status === 'success') {
        toast.success(response.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      loading.value = false;
    }
  }
};

const handleEditClick = (candidate) => {
  selectedCandidate.value = candidate;
  showEditModal.value = true;
};

const handleEditCandidate = async (updates) => {
  try {
    loading.value = true;
    const response = await editCandidate(selectedCandidate.value._id, updates, store);

    if (response.status === 'success') {
      showEditModal.value = false;
      selectedCandidate.value = null;
      toast.success('Candidate updated successfully');
    }
  } catch (err) {
    toast.error(err.message);
  } finally {
    loading.value = true;
  }
};

const filteredCandidates = computed(() => {
  if (!searchTerm.value) return store.candidates;

  return store.candidates.filter((candidate) => {
    const search = searchTerm.value.toLowerCase().trim();
    const name = candidate.name?.toLowerCase() || '';
    const position = candidate.position?.toLowerCase() || '';
    const alias = candidate.alias?.toLowerCase() || '';

    return name.includes(search) || position.includes(search) || alias.includes(search);
  });
});

onMounted(async () => {
  try {
    await getCandidates(store);
    toast.success('Candidates fetched successfully');
  } catch (err) {
    toast.error(err.message);
  }
});
</script>

<style scoped>
.candidate__header {
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

.actions {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}

.actions > button {
  width: 40%;
  padding: 0.35rem 0.5rem;
  color: white;
  background: rgb(52, 52, 248);
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: border-radius 0.5s ease;
  cursor: pointer;
  font-weight: 500;
}

.actions > button:hover {
  border-radius: 0.75rem;
}

.actions > input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid rgb(236, 236, 236);
  border-radius: 20px;
}

.candidates__inner-wrapper {
  overflow-x: scroll;
  scroll-behavior: smooth;
}

.candidate {
  scroll-snap-align: start;
}

.candidate > .action__btns {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.candidate:hover > .action__btns {
  opacity: 1;
}

.not__found {
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.15rem;
}

@media screen and (min-width: 800px) {
  .candidate__header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }

  .section__title {
    font-size: 2rem;
    margin-bottom: 0;
  }

  .actions > button {
    font-size: 1rem;
  }
}
</style>
