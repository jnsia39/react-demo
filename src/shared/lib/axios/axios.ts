import axios from 'axios';
import qs from 'qs';

export const baseURL = import.meta.env.VITE_BASE_URL;

export const cloudApi = axios.create({
  baseURL: import.meta.env.VITE_AWS_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  paramsSerializer: (params) =>
    qs.stringify(params, {
      arrayFormat: 'repeat',
      skipNulls: true,
    }),
});

export const limeApi = axios.create({
  baseURL: import.meta.env.VITE_LIME_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  paramsSerializer: (params) =>
    qs.stringify(params, {
      arrayFormat: 'repeat',
      skipNulls: true,
    }),
});

export const baseApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  paramsSerializer: (params) =>
    qs.stringify(params, {
      arrayFormat: 'repeat',
      skipNulls: true,
    }),
});
