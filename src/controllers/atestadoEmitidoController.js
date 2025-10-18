// src/controllers/atestadoEmitidoController.js
const { AtestadoEmitido } = require('../models');

exports.emitirAtestado = async (req, res) => {
  try {
    const atestado = await AtestadoEmitido.create(req.body);
    res.status(201).json(atestado);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao emitir atestado', detalhes: error.message });
  }
};

exports.listarPorPaciente = async (req, res) => {
  try {
    const lista = await AtestadoEmitido.findAll({
      where: { PacienteID: req.params.pacienteId }
    });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar atestados', detalhes: error.message });
  }
};

exports.listarPorAgendamento = async (req, res) => {
  try {
    const lista = await AtestadoEmitido.findAll({
      where: { AgendamentoID: req.params.agendamentoId }
    });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar por agendamento', detalhes: error.message });
  }
};
