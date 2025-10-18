// src/controllers/diagnosticoEmitidoController.js
const { DiagnosticoEmitido } = require('../models');

exports.emitirDiagnostico = async (req, res) => {
  try {
    const diagnostico = await DiagnosticoEmitido.create(req.body);
    res.status(201).json(diagnostico);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao emitir diagnóstico', detalhes: error.message });
  }
};

exports.listarPorPaciente = async (req, res) => {
  try {
    const lista = await DiagnosticoEmitido.findAll({
      where: { PacienteID: req.params.pacienteId }
    });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar diagnósticos', detalhes: error.message });
  }
};

exports.listarPorAgendamento = async (req, res) => {
  try {
    const lista = await DiagnosticoEmitido.findAll({
      where: { AgendamentoID: req.params.agendamentoId }
    });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar por agendamento', detalhes: error.message });
  }
};
