import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.15.8:3000', // Seu IP atualizado
  timeout: 5000,
});

export default api;