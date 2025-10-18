// src/routes/parenteRoutes.js
const express = require('express');
const router = express.Router();
const parenteController = require('../controllers/parenteController');

router.post('/cadastro', parenteController.cadastrarParente);
router.get('/paciente/:pacienteId', parenteController.listarParentesPorPaciente);

module.exports = router;
