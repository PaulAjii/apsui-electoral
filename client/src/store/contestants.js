import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCandidates, addCandidate } from '@/services/apiServices'

export const useCandidatesStore = defineStore('candidateList', () => {
  const candidates = ref(JSON.parse(localStorage.getItem('candidates')) || [])

  const fetchCandidates = async () => {
    if (candidates.value.length === 0) {
      const data = await getCandidates()

      localStorage.setItem('candidates', JSON.stringify(data.candidates))

      candidates.value = data.candidates
    }
  }

  const postCandidate = async (candidateData) => {
    const data = await addCandidate(candidateData)

    candidates.value = [...candidates.value, data.candidate]

    localStorage.setItem('candidates', JSON.stringify(candidates.value))
  }

  return { fetchCandidates, candidates, postCandidate }
})
