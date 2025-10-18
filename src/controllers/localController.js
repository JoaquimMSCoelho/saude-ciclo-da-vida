// src/controllers/localController.js
const { Local } = require('../models');

exports.cadastrarLocal = async (req, res) => {
  try {
    const novoLocal = await Local.create(req.body);
    res.status(201).json(novoLocal);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao cadastrar local', detalhes: error.message });
  }
};

exports.listarLocais = async (req, res) => {
  try {
    const locais = await Local.findAll();
    res.json(locais);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar locais', detalhes: error.message });
  }
};
