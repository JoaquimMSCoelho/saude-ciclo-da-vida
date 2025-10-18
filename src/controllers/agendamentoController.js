// src/controllers/agendamentoController.js
const { Agendamento } = require('../models');

exports.criarAgendamento = async (req, res) => {
  try {
    const agendamento = await Agendamento.create(req.body);
    res.status(201).json(agendamento);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao agendar', detalhes: error.message });
  }
};

exports.listarAgendamentosPorPaciente = async (req, res) => {
  try {
    const agendamentos = await Agendamento.findAll({
      where: { PacienteID: req.params.pacienteId }
    });
    res.json(agendamentos);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar agendamentos', detalhes: error.message });
  }
};

exports.confirmarAgendamento = async (req, res) => {
  try {
    const atualizado = await Agendamento.update(
      { Confirmado: true },
      { where: { AgendamentoID: req.params.agendamentoId } }
    );
    res.json({ sucesso: true, atualizado });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao confirmar agendamento', detalhes: error.message });
  }
};
