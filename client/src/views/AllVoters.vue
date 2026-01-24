<template>
    <SectionLayout customClass="candidates__section" sectionWrapper="candidates__wrapper">
        <nav class="nav__container">
      <BackButton />

      <div class="menu">
        <RouterLink to="/" class="nav__link">Home</RouterLink>
        <p class="nav__link active">Voters</p>
        <RouterLink to="/candidates" class="nav__link">Candidates</RouterLink>
        <RouterLink to="/voters/profile" class="nav__link">Profile</RouterLink>
      </div>
    </nav>
    <header class="voters__header">
      <h2 class="section__title">All Voters</h2>

      <div class="actions">
        <input
          type="text"
          name="search"
          v-model="searchTerm"
          placeholder="Search by name, class, set, level..."
        />
      </div>
    </header>

    <div class="stats">
      <p class="total__candidates">Total Number of Voters: {{ filteredVoters.length }}</p>
      <p class="total__candidates">Verified Voters: {{ filteredVoters.filter(voter => !voter.isFirstTimeLogin).length }}</p>
      <p class="total__candidates">Voted Voters: {{ filteredVoters.filter(voter => voter.hasVoted).length }}</p>
    </div>

    <div class="voters__inner-wrapper">
      <table v-if="filteredVoters.length !== 0">
        <thead>
          <tr>
            <th>S/N</th>
            <th>Matric No.</th>
            <th>Name</th>
            <th>Class</th>
            <th>Set</th>
            <th>Verified</th>
            <th>Has Voted</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(voter, i) in filteredVoters" :key="voter._id">
            <td>{{ i + 1 }}</td>
            <td>{{ voter.studentId }}</td>
            <td>{{ voter.name }}</td>
            <td>{{ voter.level }}</td>
            <td>{{ voter.set }}</td>
            <td>{{ !voter.isFirstTimeLogin ? "Yes" : "No" }}</td>
            <td>{{ voter.hasVoted ? "Yes" : "No" }}</td>
          </tr>
        </tbody>
      </table>

        <div v-else class="not__found">No Voter found</div>
    </div>
    </SectionLayout>
</template>

<script setup>
import SectionLayout from '../layout/SectionLayout.vue';
import BackButton from '@/components/BackButton.vue';
import { useVotersStore } from '@/store/voters.js';
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { getAllVoters } from '@/services/apiServices';

const votersStore = useVotersStore();
const toast = useToast();

const searchTerm = ref('');

const filteredVoters = computed(() => {
    const voters = votersStore.voters.filter((voter) => voter.role !== 'admin');

    if (!searchTerm.value) {
        return voters;
    }
    return voters.filter((voter) =>
        voter.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        voter.level.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        voter.set.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        voter.studentId.includes(searchTerm.value)
    );
});

onMounted(async () => {
    try {
        await getAllVoters(votersStore);
        toast.success('All voters fetched successfully');
    } catch (error) {
     toast.error(error.message || 'Failed to fetch all voters');
    }
})
</script>

<style scoped>
.voters__header {
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

.actions > input {
  width: 300px;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  border: 1px solid rgb(236, 236, 236);
  border-radius: 20px;
}

.stats {
  margin: 0.5rem 0;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.voters__inner-wrapper {
  overflow: auto;
  scroll-behavior: smooth;
  height: calc(100dvh - 290px);
}

.voters__inner-wrapper::-webkit-scrollbar {
  width: 10px;
}

.voters__inner-wrapper::-webkit-scrollbar-track {
  background: rgb(245, 245, 245);
  border-radius: 10px;
}

.voters__inner-wrapper::-webkit-scrollbar-thumb {
  background: rgb(243, 198, 135);
  border-radius: 10px;
  transition: background 0.3s ease;
  cursor: pointer;
}

.voters__inner-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgb(245, 142, 0);
}
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.65rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid rgb(236, 236, 236);
  font-size: 0.75rem;
}

tbody tr:hover {
  background-color: rgb(250, 250, 250);
}

thead {
  position: sticky;
  top: 0;
  z-index: 10;
}

th {
  background-color: rgb(245, 245, 245);
  font-weight: 600;
}

.not__found {
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.15rem;
}

@media screen and (min-width: 800px) {
  .voters__header {
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

  td {
    font-size: 1rem;
  }

  .stats {
    margin: 1rem 0;
    gap: 1rem;
  }

  th, td {
  padding: 0.65rem 1rem;
  font-size: 1rem;
  }

  .actions > input {
    font-size: 1rem;
    width: 400px;
  }
}
</style>