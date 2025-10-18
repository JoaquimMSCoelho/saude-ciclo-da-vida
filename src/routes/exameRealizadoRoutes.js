// src/routes/exameRealizadoRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/exameRealizadoController');

router.post('/registrar', controller.registrarExame);
router.get('/paciente/:pacienteId', controller.listarPorPaciente);
router.get('/agendamento/:agendamentoId', controller.listarPorAgendamento);

module.exports = router;
