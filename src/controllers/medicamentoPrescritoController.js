// src/controllers/medicamentoPrescritoController.js
const { MedicamentoPrescrito } = require('../models');

exports.prescreverMedicamento = async (req, res) => {
  try {
    const prescricao = await MedicamentoPrescrito.create(req.body);
    res.status(201).json(prescricao);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao prescrever medicamento', detalhes: error.message });
  }
};

exports.listarPorPaciente = async (req, res) => {
  try {
    const lista = await MedicamentoPrescrito.findAll({
      where: { PacienteID: req.params.pacienteId }
    });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar medicamentos', detalhes: error.message });
  }
};

exports.listarPorAgendamento = async (req, res) => {
  try {
    const lista = await MedicamentoPrescrito.findAll({
      where: { AgendamentoID: req.params.agendamentoId }
    });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar por agendamento', detalhes: error.message });
  }
};
