import axios from 'axios';

const API_BASE_URL = 'https://real-elo2.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getFilterOptions = async () => {
  const response = await api.get('/sales/filters');
  return response.data;
};

export const getSalesData = async (params) => {
  const response = await api.get('/sales', { params });
  return response.data;
};

export default api;

