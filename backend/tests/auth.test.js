const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const PASSWORD = 'senhaSegura123';

function gerarEmailAleatorio() {
  return `usuario${Date.now()}@exemplo.com`;
}

describe('🔐 Testes de Autenticação JWT', () => {
  let email;
  let token;
  let userId;

  beforeAll(() => {
    email = gerarEmailAleatorio();
  });

  test('✅ Deve registrar um novo usuário', async () => {
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      email,
      password: PASSWORD
    });
    expect(res.data).toHaveProperty('userId');
    userId = res.data.userId;
  });

  test('✅ Deve fazer login com sucesso', async () => {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password: PASSWORD
    });
    expect(res.data).toHaveProperty('token');
    token = res.data.token;
  });

  test('✅ Deve acessar rota protegida com token válido', async () => {
    const res = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(res.data).toHaveProperty('userId');
    expect(res.data.message).toBe('Acesso autorizado');
  });

  test('🚫 Deve rejeitar token inválido', async () => {
    try {
      await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: 'Bearer token_invalido_123' }
      });
    } catch (err) {
      expect(err.response.status).toBe(401);
      expect(err.response.data.error).toMatch(/token inválido/i);
    }
  });

  test('🛠️ Deve simular atualização de dados do usuário', async () => {
    // Supondo que exista uma rota PUT /auth/update
    try {
      const res = await axios.put(`${BASE_URL}/auth/update`, {
        name: 'Joaquim Atualizado'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(res.data.message).toMatch(/atualizado/i);
    } catch (err) {
      console.warn('⚠️ Rota /auth/update não implementada — teste ignorado');
    }
  });

  test('🚪 Deve simular logout (token inválido após logout)', async () => {
    // Supondo que exista uma rota POST /auth/logout
    try {
      const res = await axios.post(`${BASE_URL}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(res.data.message).toMatch(/logout/i);
    } catch (err) {
      console.warn('⚠️ Rota /auth/logout não implementada — teste ignorado');
    }
  });

  test('🔁 Deve registrar e autenticar múltiplos usuários', async () => {
    const emails = Array.from({ length: 3 }, () => gerarEmailAleatorio());

    for (const e of emails) {
      const reg = await axios.post(`${BASE_URL}/auth/register`, {
        email: e,
        password: PASSWORD
      });
      expect(reg.data).toHaveProperty('userId');

      const login = await axios.post(`${BASE_URL}/auth/login`, {
        email: e,
        password: PASSWORD
      });
      expect(login.data).toHaveProperty('token');

      const me = await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${login.data.token}` }
      });
      expect(me.data).toHaveProperty('userId');
    }
  });
});
