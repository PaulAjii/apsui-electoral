import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { clearToken } from '@/services/tokenService';

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

  const logout = () => {
    localStorage.removeItem('voterDetails');
    clearToken();
    voter.value = null;
  };

  return { voter, getVoter, setVoter, setAllVoters, voters, logout };
});
