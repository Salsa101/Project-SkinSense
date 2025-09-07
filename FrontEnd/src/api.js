import axios from 'axios';

const API_BASE_URL = 'http://10.0.2.2:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
