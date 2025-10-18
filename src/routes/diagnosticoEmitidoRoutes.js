// src/routes/diagnosticoEmitidoRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/diagnosticoEmitidoController');

router.post('/emitir', controller.emitirDiagnostico);
router.get('/paciente/:pacienteId', controller.listarPorPaciente);
router.get('/agendamento/:agendamentoId', controller.listarPorAgendamento);

module.exports = router;
