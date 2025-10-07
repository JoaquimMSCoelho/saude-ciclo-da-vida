// src/app.js
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Rotas serão adicionadas aqui futuramente

app.listen(3000, () => {
  console.log('🩺 Saúde Ciclo da Vida rodando na porta 3000');
});
