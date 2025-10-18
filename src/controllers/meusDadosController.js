// src/controllers/meusDadosController.js
const { MeusDados } = require('../models');

exports.cadastrarDados = async (req, res) => {
  try {
    const dados = await MeusDados.create(req.body);
    res.status(201).json(dados);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao cadastrar dados', detalhes: error.message });
  }
};

exports.buscarDadosPorCPF = async (req, res) => {
  try {
    const dados = await MeusDados.findOne({
      where: { CPF: req.params.cpf }
    });
    res.json(dados);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar dados', detalhes: error.message });
  }
};
