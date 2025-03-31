import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useVotersStore = defineStore('voters', () => {
  const voter = ref(JSON.parse(localStorage.getItem('voterDetails')) || null);
  const voters = ref([]);

  const getVoter = computed(() => voter.value);

  const setVoter = (data) => {
    voter.value = data;
    localStorage.setItem('voterDetails', JSON.stringify(voter.value));
  };

  const setAllVoters = (data) => {
    voters.value = data;
  };

  return { voter, getVoter, setVoter, setAllVoters, voters };
});
