// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://89.111.169.69:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
