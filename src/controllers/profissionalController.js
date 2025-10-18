// src/controllers/profissionalController.js
const { Profissional } = require('../models');

exports.cadastrarProfissional = async (req, res) => {
  try {
    const profissional = await Profissional.create(req.body);
    res.status(201).json(profissional);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao cadastrar profissional', detalhes: error.message });
  }
};

exports.listarProfissionaisPorEspecialidade = async (req, res) => {
  try {
    const profissionais = await Profissional.findAll({
      where: { EspecialidadeID: req.params.especialidadeId, Ativo: true }
    });
    res.json(profissionais);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar profissionais', detalhes: error.message });
  }
};
