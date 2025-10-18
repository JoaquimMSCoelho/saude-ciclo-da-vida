// src/routes/meusDadosRoutes.js
const express = require('express');
const router = express.Router();
const meusDadosController = require('../controllers/meusDadosController');

router.post('/cadastro', meusDadosController.cadastrarDados);
router.get('/cpf/:cpf', meusDadosController.buscarDadosPorCPF);

module.exports = router;
