// src/routes/profissionalRoutes.js
const express = require('express');
const router = express.Router();
const profissionalController = require('../controllers/profissionalController');

router.post('/cadastro', profissionalController.cadastrarProfissional);
router.get('/especialidade/:especialidadeId', profissionalController.listarProfissionaisPorEspecialidade);

module.exports = router;
