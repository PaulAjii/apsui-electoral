import axios from 'axios';
import { errorHandler } from '@/utils';
import { getApiUrl } from '@/config';

const apiClient = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

const authenticatedClient = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

authenticatedClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getCandidates = async (store) => {
  try {
    const { data } = await authenticatedClient.get('/candidates');
    store.setCandidates(data.candidates);

    return data;
  } catch (err) {
    throw errorHandler(err);
  }
};

export const createCandidate = async (candidateData, store) => {
  try {
    const { data } = await authenticatedClient.post('/candidates', candidateData);

    store.addCandidate(data.candidate);

    return data;
  } catch (err) {
    throw errorHandler(err);
  }
};

export const deleteCandidate = async (id, store) => {
  try {
    const { data } = await authenticatedClient.delete(`/candidates/${id}`);

    store.delCandidate(id);

    return data;
  } catch (err) {
    throw errorHandler(err);
  }
};

export const editCandidate = async (id, updates, store) => {
  try {
    const { data } = await authenticatedClient.patch(`/candidates/${id}`, updates);

    store.updateCandidate(id, updates);

    return data;
  } catch (err) {
    throw errorHandler(err);
  }
};

// Voters
export const getVoter = async (id, store) => {
  try {
    const { data } = await authenticatedClient.get(`/users/${id}`);

    store.setVoter(data.user);

    return data;
  } catch (err) {
    throw errorHandler(err);
  }
};

export const getAllVoters = async (store) => {
  try {
    const { data } = await authenticatedClient.get('/users');

    store.setAllVoters(data.users);
  } catch (err) {
    throw errorHandler(err);
  }

  // return data.status;
};

export const updateVoters = async (id, updates, store) => {
  try {
    const { data } = await authenticatedClient.patch(`/users/${id}`, updates);

    store.setVoter(data.user);

    return data;
  } catch (err) {
    throw errorHandler(err);
  }
};

// LOGIN USER
export const loginUser = async (userData, store) => {
  try {
    const { data } = await apiClient.post('/login', userData);

    store.setVoter(data.user);

    return data;
  } catch (err) {
    throw errorHandler(err);
  }
};

export const resetPassword = async (userData) => {
  try {
    const { data } = await authenticatedClient.post('/password-reset', userData);

    return data;
  } catch (err) {
    throw errorHandler(err);
  }
};

export const castVote = async (votes, store) => {
  try {
    const { data } = await authenticatedClient.post('/vote/cast', votes);

    console.log(data);

    store.setVoter(data.voter);

    return data;
  } catch (err) {
    throw errorHandler(err);
  }
};
