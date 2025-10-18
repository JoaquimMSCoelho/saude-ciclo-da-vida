// src/routes/atestadoEmitidoRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/atestadoEmitidoController');

router.post('/emitir', controller.emitirAtestado);
router.get('/paciente/:pacienteId', controller.listarPorPaciente);
router.get('/agendamento/:agendamentoId', controller.listarPorAgendamento);

module.exports = router;
