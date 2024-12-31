import axios from 'axios'
import { errorHandler } from '@/utils'

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getCandidates = async () => {
  try {
    const { data } = await apiClient.get('/candidates')

    return data
  } catch (err) {
      errorHandler(err)
  }
}

export const addCandidate = async (candidateData) => {
  try {
    const { data } = await apiClient.post('/candidates', candidateData)

    return data
  } catch (err) {
      errorHandler(err)
  }
}

export const removeCandidate = async (id) => {
  try {
    const { data } = await apiClient.delete(`/candidates/${ id }`)

    return data
  } catch (err) {
      errorHandler(err)
  }
}
