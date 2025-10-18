// src/controllers/historicoController.js
const { gerarHistoricoCompleto } = require('../services/HistoricoCompletoPaciente');

exports.obterHistorico = async (req, res) => {
  try {
    const historico = await gerarHistoricoCompleto(req.params.pacienteId);
    res.json(historico);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar histórico', detalhes: error.message });
  }
};
