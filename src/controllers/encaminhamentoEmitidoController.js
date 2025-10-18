// src/controllers/encaminhamentoEmitidoController.js
const { EncaminhamentoEmitido } = require('../models');

exports.emitirEncaminhamento = async (req, res) => {
  try {
    const encaminhamento = await EncaminhamentoEmitido.create(req.body);
    res.status(201).json(encaminhamento);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao emitir encaminhamento', detalhes: error.message });
  }
};

exports.listarPorPaciente = async (req, res) => {
  try {
    const lista = await EncaminhamentoEmitido.findAll({
      where: { PacienteID: req.params.pacienteId }
    });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar encaminhamentos', detalhes: error.message });
  }
};

exports.listarPorAgendamento = async (req, res) => {
  try {
    const lista = await EncaminhamentoEmitido.findAll({
      where: { AgendamentoID: req.params.agendamentoId }
    });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar por agendamento', detalhes: error.message });
  }
};
