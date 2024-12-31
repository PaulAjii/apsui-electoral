import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCandidates, addCandidate, removeCandidate } from '@/services/apiServices'

export const useCandidatesStore = defineStore('candidateList', () => {
  // const candidates = ref(JSON.parse(localStorage.getItem('candidates')) || [])
  const candidates = ref([])

  const fetchCandidates = async () => {
    if (candidates.value.length === 0) {
      const data = await getCandidates()

      // localStorage.setItem('candidates', JSON.stringify(data.candidates))

      candidates.value = data.candidates
    }
  }

  const postCandidate = async (candidateData) => {
    const data = await addCandidate(candidateData)

    candidates.value = [data.candidate, ...candidates.value]

    // localStorage.setItem('candidates', JSON.stringify(candidates.value))
  }

  const deleteCandidate = async (id) => {
    const data = await removeCandidate(id)
    candidates.value = candidates.value.filter(candidate => candidate._id !== id)
    // localStorage.setItem('candidates', JSON.stringify(candidates.value))

    return data
  }

  return { fetchCandidates, candidates, postCandidate, deleteCandidate }
})
