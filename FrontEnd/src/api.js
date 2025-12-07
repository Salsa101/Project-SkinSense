import axios from 'axios';

const API_BASE_URL = 'https://project-skinsense-production.up.railway.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 50000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
