// src/routes/encaminhamentoEmitidoRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/encaminhamentoEmitidoController');

router.post('/emitir', controller.emitirEncaminhamento);
router.get('/paciente/:pacienteId', controller.listarPorPaciente);
router.get('/agendamento/:agendamentoId', controller.listarPorAgendamento);

module.exports = router;
