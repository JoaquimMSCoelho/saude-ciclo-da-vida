// src/controllers/exameRealizadoController.js
const { ExameRealizado } = require('../models');

exports.registrarExame = async (req, res) => {
  try {
    const exame = await ExameRealizado.create(req.body);
    res.status(201).json(exame);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao registrar exame', detalhes: error.message });
  }
};

exports.listarPorPaciente = async (req, res) => {
  try {
    const exames = await ExameRealizado.findAll({
      where: { PacienteID: req.params.pacienteId }
    });
    res.json(exames);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar exames', detalhes: error.message });
  }
};

exports.listarPorAgendamento = async (req, res) => {
  try {
    const exames = await ExameRealizado.findAll({
      where: { AgendamentoID: req.params.agendamentoId }
    });
    res.json(exames);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar exames por agendamento', detalhes: error.message });
  }
};
