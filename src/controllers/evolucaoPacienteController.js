// src/controllers/evolucaoPacienteController.js
const { EvolucaoPaciente } = require('../models');

exports.registrarEvolucao = async (req, res) => {
  try {
    const evolucao = await EvolucaoPaciente.create(req.body);
    res.status(201).json(evolucao);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao registrar evolução', detalhes: error.message });
  }
};

exports.listarPorPaciente = async (req, res) => {
  try {
    const evolucoes = await EvolucaoPaciente.findAll({
      where: { PacienteID: req.params.pacienteId }
    });
    res.json(evolucoes);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar evoluções', detalhes: error.message });
  }
};

exports.listarPorAgendamento = async (req, res) => {
  try {
    const evolucoes = await EvolucaoPaciente.findAll({
      where: { AgendamentoID: req.params.agendamentoId }
    });
    res.json(evolucoes);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar por agendamento', detalhes: error.message });
  }
};
