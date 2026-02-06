import axios from 'axios';
import { errorHandler } from '@/utils';
import { getApiUrl } from '@/config';
import { getToken, clearToken } from './tokenService';

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
    const token = getToken();

    if (!token) {
      clearToken();
      window.location.href = '/auth/login';
      return Promise.reject(new Error("Token expired, please log in again."));
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

authenticatedClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
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

    if (data.user.isFirstTimeLogin) { 
      store.setVoter({
        studentId: data.user.studentId
    }) 
    } else {
      store.setVoter(data.user);
    }

    return data;
  } catch (err) {
    throw errorHandler(err);
  }
};

export const resetPassword = async (userData, store) => {
  try {
    const { data } = await authenticatedClient.post('/password-reset', userData);

    store.setVoter(data.user)

    return data;
  } catch (err) {
    throw errorHandler(err);
  }
};

export const castVote = async (votes, store) => {
  try {
    const { data } = await authenticatedClient.post('/vote/cast', votes);

    // console.log(data);

    store.setVoter(data.voter);

    return data;
  } catch (err) {
    throw errorHandler(err);
  }
};

export const getVoteResults = async () => {
  try {
    const { data } = await authenticatedClient.get('/vote/results');

    return data;
  } catch (err) {
    throw errorHandler(err);
  }
};
