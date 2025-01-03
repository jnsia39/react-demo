import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
  headers: { 
    accept: '*/*',
    "Content-Type": "application/json;charset=UTF-8"
  },
  withCredentials: true,
});

export default axiosInstance;