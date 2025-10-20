const axios = require('axios');

describe('Autenticação JWT', () => {
  const email = `teste${Date.now()}@exemplo.com`;
  const password = 'senhaSegura123';
  let token;

  test('Deve registrar um novo usuário', async () => {
    const res = await axios.post('http://localhost:3000/auth/register', { email, password });
    expect(res.data).toHaveProperty('userId');
  });

  test('Deve fazer login com sucesso', async () => {
    const res = await axios.post('http://localhost:3000/auth/login', { email, password });
    expect(res.data).toHaveProperty('token');
    token = res.data.token;
  });

  test('Deve acessar rota protegida com token', async () => {
    const res = await axios.get('http://localhost:3000/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(res.data).toHaveProperty('userId');
    expect(res.data.message).toBe('Acesso autorizado');
  });
});
