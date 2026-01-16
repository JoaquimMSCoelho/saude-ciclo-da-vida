// ARQUIVO: mobile/src/services/api.ts
import axios from 'axios';

const api = axios.create({
  // SUBSTITUA O IP ABAIXO PELO SEU IPV4 DO PASSO 1
  // Mantenha o :3000 no final.
  // Exemplo correto: 'http://192.168.0.10:3000'
  baseURL: 'http://192.168.15.8:3000', 
});

export default api;
