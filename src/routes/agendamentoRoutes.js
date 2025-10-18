// src/routes/agendamentoRoutes.js
const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');

router.post('/criar', agendamentoController.criarAgendamento);
router.get('/paciente/:pacienteId', agendamentoController.listarAgendamentosPorPaciente);
router.put('/confirmar/:agendamentoId', agendamentoController.confirmarAgendamento);

module.exports = router;
