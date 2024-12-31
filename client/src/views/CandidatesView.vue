<template>
  <SectionLayout customClass="candidates__section" sectionWrapper="candidates__wrapper">
    <BackButton />
    <header class="candidate__header">
      <h2 class="section__title">Candidates' List</h2>

      <div class="actions">
        <button type="button" @click="showModal = true">
          <v-icon name="bi-plus" scale="1.5" />
          <span>New Candidate</span>
        </button>

        <input type="text" name="search" v-model="searchTerm" placeholder="Search by name, alias, position..." />
      </div>
    </header>

    <div class="candidates__inner-wrapper"
        v-if="filteredCandidates.length !== 0"
    >
      <div
        v-for="candidate in filteredCandidates"
        :key="candidate._id"
        class="candidate"
      >
        <div class="action__btns">
          <button class="action__btn">
            <v-icon name="fa-edit" scale="1.2" fill="black" />
          </button>

          <button 
            class="action__btn" 
            @click="handleDeleteCandidate(candidate._id)"
          >
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

    <div v-else class="not__found">
      No Candidate found
    </div>

    <AddCandidate v-if="showModal" @close="showModal = false" @submit="handleAddCandidate" />
  </SectionLayout>
</template>

<script setup>
import SectionLayout from '../layout/SectionLayout.vue';
import { useCandidatesStore } from '../store/contestants.js';
import { storeToRefs } from 'pinia';
import { onMounted, ref, computed } from 'vue';
import AddCandidate from '@/components/AddCandidate.vue';
import { useToast } from 'vue-toastification';
import BackButton from '@/components/BackButton.vue';

const store = useCandidatesStore();

const { fetchCandidates, postCandidate, deleteCandidate } = store;
const { candidates } = storeToRefs(store);
const toast = useToast()

const showModal = ref(false);

const searchTerm = ref('');

const handleAddCandidate = async (candidateData) => {
  try {
    await postCandidate(candidateData);
    showModal.value = false;
    toast.success("Candidate added successfully")
  } catch (err) {
    showModal.value = false
    toast.error(err)
  }
};

const handleDeleteCandidate = async (id) => {
  if (confirm('Are you sure you want to delete this candidate?')) {
    try {
      await deleteCandidate(id);
      toast.success("Candidate deleted successfully")
    } catch (err) {
      toast.error(err)
      // You might want to add error handling/notification here
    }
  }
};

const filteredCandidates = computed(() => {
  if (!searchTerm.value) return candidates.value;

  return candidates.value.filter((candidate) => {
    const search = searchTerm.value.toLowerCase().trim();
    const name = candidate.name?.toLowerCase() || '';
    const position = candidate.position?.toLowerCase() || '';
    const alias = candidate.alias?.toLowerCase() || '';

    return name.includes(search) || position.includes(search) || alias.includes(search);
  });
});

onMounted(async () => {
  if (store.candidates.length === 0) {
    await fetchCandidates();
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

.actions {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.actions > button {
  padding: 0.35rem 0.75rem;
  color: white;
  background: rgb(52, 52, 248);
  font-size: 1rem;
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
  width: 300px;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid rgb(236, 236, 236);
  border-radius: 20px;
}

.candidates__inner-wrapper {
  height: 100%;
  display: grid;
  /* display: flex; */
  gap: 2rem;
  grid-template-columns: repeat(4, minmax(300px, 1fr));
  padding-left: 2rem;
  padding-top: 2rem;
}

.candidate {
  max-width: 300px;
  max-height: 500px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.07);
  transform-origin: top;
  will-change: transform, opacity;
  transition: all 0.5s ease;
}

.candidate:hover {
  transform: translateY(-2px);
  background-color: whitesmoke;
}

.candidate__img {
  width: 200px;
  height: 200px;
  overflow: hidden;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1px solid rgb(209, 209, 209);
  align-self: center;
}

.candidate__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.candidate__info > .info__field {
  font-size: 1.1rem;
}

.candidate__info > .info__field > .label {
  font-weight: 700;
  letter-spacing: 1px;
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
</style>
