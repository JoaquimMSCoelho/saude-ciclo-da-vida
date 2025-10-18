// src/routes/medicamentoPrescritoRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/medicamentoPrescritoController');

router.post('/prescrever', controller.prescreverMedicamento);
router.get('/paciente/:pacienteId', controller.listarPorPaciente);
router.get('/agendamento/:agendamentoId', controller.listarPorAgendamento);

module.exports = router;
