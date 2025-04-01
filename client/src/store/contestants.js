import { defineStore } from 'pinia';
import { ref } from 'vue';
// import {
//   getCandidates,
//   addCandidate,
//   removeCandidate,
//   editCandidate
// } from '@/services/apiServices';

export const useCandidatesStore = defineStore('candidates', () => {
  // const candidates = ref(JSON.parse(localStorage.getItem('candidates')) || [])
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
    const data = await editCandidate(id, updates);
    const index = candidates.value.findIndex((c) => c._id === id);

    console.log(data, index);

    if (index !== -1) {
      candidates.value[index] = data.candidate;
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
