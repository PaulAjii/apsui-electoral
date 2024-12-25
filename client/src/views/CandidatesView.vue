<template>
  <SectionLayout customClass="candidates__section" sectionWrapper="candidates__wrapper">
    <header class="candidate__header">
      <h2 class="section__title">Candidates' List</h2>

      <div class="actions">
        <button type="button" @click="showModal = true">
          <v-icon name="bi-plus" scale="1.5" />
          <span>New Candidate</span>
        </button>

        <input type="text" name="search" v-model="searchTerm" placeholder="Search Candidate..." />
      </div>
    </header>

    <div class="candidates__inner-wrapper">
      <div v-for="candidate in filteredCandidates" :key="candidate._id" class="candidate">
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

    <AddCandidate v-if="showModal" @close="showModal = false" @submit="handleAddCandidate" />
  </SectionLayout>
</template>

<script setup>
import SectionLayout from '../layout/SectionLayout.vue'
import { useCandidatesStore } from '../store/contestants.js'
import { storeToRefs } from 'pinia'
import { onMounted, ref, computed } from 'vue'
import AddCandidate from '@/components/AddCandidate.vue'

const store = useCandidatesStore()

const { fetchCandidates, postCandidate } = store
const { candidates } = storeToRefs(store)

const showModal = ref(false)

const searchTerm = ref('')

const handleAddCandidate = async (candidateData) => {
  await postCandidate(candidateData)
  showModal.value = false
}

const filteredCandidates = computed(() => {
  if (!searchTerm.value) return candidates.value

  return candidates.value.filter((candidate) => {
    const search = searchTerm.value.toLowerCase().trim()
    const name = candidate.name?.toLowerCase() || ''
    const position = candidate.position?.toLowerCase() || ''
    const alias = candidate.alias?.toLowerCase() || ''

    return name.includes(search) || position.includes(search) || alias.includes(search)
  })
})

onMounted(async () => {
  if (store.candidates.length === 0) {
    await fetchCandidates()
  }
})
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
  gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
  transition: transform 0.2s ease;
}

.candidate:hover {
  transform: translateY(-2px);
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
</style>
