import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getCandidates,
  addCandidate,
  removeCandidate,
  editCandidate
} from '@/services/apiServices';

export const useCandidatesStore = defineStore('candidateList', () => {
  // const candidates = ref(JSON.parse(localStorage.getItem('candidates')) || [])
  const candidates = ref([]);

  const fetchCandidates = async () => {
    if (candidates.value.length === 0) {
      const data = await getCandidates();

      // localStorage.setItem('candidates', JSON.stringify(data.candidates))

      candidates.value = data.candidates;
    }
  };

  const postCandidate = async (candidateData) => {
    const data = await addCandidate(candidateData);

    candidates.value = [data.candidate, ...candidates.value];

    // localStorage.setItem('candidates', JSON.stringify(candidates.value))
  };

  const deleteCandidate = async (id) => {
    const data = await removeCandidate(id);
    candidates.value = candidates.value.filter((candidate) => candidate._id !== id);
    // localStorage.setItem('candidates', JSON.stringify(candidates.value))

    return data;
  };

  const updateCandidate = async (id, updates) => {
    const data = await editCandidate(id, updates);
    const index = candidates.value.findIndex((c) => c._id === id);

    console.log(data, index);

    if (index !== -1) {
      candidates.value[index] = data.candidate;
    }
  };

  return { fetchCandidates, candidates, postCandidate, deleteCandidate, updateCandidate };
});
