const axios = require('axios');

(async () => {
  try {
    // 1. Tentar registrar
    try {
      const register = await axios.post('http://localhost:3000/auth/register', {
        email: 'joaquim@exemplo.com',
        password: 'senhaSegura123'
      });
      console.log('Registro:', register.data);
    } catch (err) {
      if (err.response?.data?.error === 'Usuário já existe') {
        console.log('Registro: usuário já existe — continuando...');
      } else {
        throw err;
      }
    }

    // 2. Login
    const login = await axios.post('http://localhost:3000/auth/login', {
      email: 'joaquim@exemplo.com',
      password: 'senhaSegura123'
    });
    console.log('Login:', login.data);

    const token = login.data.token;

    // 3. Rota protegida
    const me = await axios.get('http://localhost:3000/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Rota protegida:', me.data);
  } catch (err) {
    console.error('Erro:', err.response?.data || err.message);
  }
})();
