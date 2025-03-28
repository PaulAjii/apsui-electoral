import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useVotersStore = defineStore('voters', () => {
  const voter = ref(JSON.parse(localStorage.getItem('voterDetails')) || null);

  const getVoter = computed(() => voter.value);

  const setVoter = (data) => {
    voter.value = data;
    localStorage.setItem('voterDetails', JSON.stringify(voter.value));
  };

  return { voter, getVoter, setVoter };
});
