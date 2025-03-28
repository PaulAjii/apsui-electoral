import axios from 'axios';
import { errorHandler } from '@/utils';
import { getApiUrl } from '@/config';

const apiClient = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getCandidates = async () => {
  try {
    const { data } = await apiClient.get('/candidates');

    return data;
  } catch (err) {
    errorHandler(err);
  }
};

export const addCandidate = async (candidateData) => {
  try {
    const { data } = await apiClient.post('/candidates', candidateData);

    return data;
  } catch (err) {
    errorHandler(err);
  }
};

export const removeCandidate = async (id) => {
  try {
    const { data } = await apiClient.delete(`/candidates/${id}`);

    return data;
  } catch (err) {
    errorHandler(err);
  }
};

export const editCandidate = async (id, updates) => {
  try {
    const { data } = await apiClient.patch(`/candidates/${id}`, updates);

    return data;
  } catch (err) {
    errorHandler(err);
  }
};

// Voters
export const getVoter = async (id, store) => {
  try {
    const { data } = await apiClient.get(`/users/${id}`);

    store.setVoter(data.user);

    return data;
  } catch (err) {
    errorHandler(err);
  }
};

export const updateVoters = async (id, updates, store) => {
  try {
    const { data } = await apiClient.patch(`/users/${id}`, updates);

    store.setVoter(data.user);

    return data;
  } catch (err) {
    errorHandler(err);
  }
};
