// src/controllers/parenteController.js
const { Parente } = require('../models');

exports.cadastrarParente = async (req, res) => {
  try {
    const parente = await Parente.create(req.body);
    res.status(201).json(parente);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao cadastrar parente', detalhes: error.message });
  }
};

exports.listarParentesPorPaciente = async (req, res) => {
  try {
    const parentes = await Parente.findAll({
      where: { PacienteID: req.params.pacienteId }
    });
    res.json(parentes);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar parentes', detalhes: error.message });
  }
};
