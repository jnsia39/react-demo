import axios from 'axios';

export const cloudApi = axios.create({
  baseURL: import.meta.env.VITE_AWS_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const baseApi = axios.create({
  baseURL: import.meta.env.VITE_AWS_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
