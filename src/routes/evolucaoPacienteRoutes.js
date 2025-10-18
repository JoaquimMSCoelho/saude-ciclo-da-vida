// src/routes/evolucaoPacienteRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/evolucaoPacienteController');

router.post('/registrar', controller.registrarEvolucao);
router.get('/paciente/:pacienteId', controller.listarPorPaciente);
router.get('/agendamento/:agendamentoId', controller.listarPorAgendamento);

module.exports = router;
