// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// ARQUITETURA: INTEGRATION LAYER
// -------------------------------------------------------------------------
import axios from 'axios';

const api = axios.create({
  // ATUALIZADO EM 19/01/2026:
  baseURL: 'http://192.168.15.11:4000', 
  timeout: 10000,
});

export default api;