import axios from 'axios'

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
    console.error('Error Fetching Data...', err.message)
    throw err
  }
}

export const addCandidate = async (candidateData) => {
  try {
    const { data } = await apiClient.post('/candidates', candidateData)

    return data
  } catch (err) {
    console.error('Error adding candidate...', err.message)
    throw err
  }
}
