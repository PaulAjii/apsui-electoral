import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCandidatesStore = defineStore('candidates', () => {
  const candidates = ref([]);

  const setCandidates = (data) => {
    candidates.value = data;
  };

  const addCandidate = (data) => {
    candidates.value.push(data);
  };

  const delCandidate = (id) => {
    candidates.value = candidates.value.filter((candidate) => candidate._id !== id);

    setCandidates(candidates.value);
  };

  const updateCandidate = async (id, updates) => {
    const index = candidates.value.findIndex((c) => c._id === id);

    if (index !== -1) {
      candidates.value[index] = { ...candidates.value[index], ...updates };
    }
  };

  return {
    setCandidates,
    addCandidate,
    candidates,
    delCandidate,
    updateCandidate
  };
});
