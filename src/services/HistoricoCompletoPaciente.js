// src/services/HistoricoCompletoPaciente.js
const {
  MeusDados,
  Parente,
  Agendamento,
  ExameRealizado,
  DiagnosticoEmitido,
  MedicamentoPrescrito,
  EvolucaoPaciente,
  EncaminhamentoEmitido
} = require('../models');

exports.gerarHistoricoCompleto = async (pacienteId) => {
  try {
    const dados = await MeusDados.findByPk(pacienteId);
    const parentes = await Parente.findAll({ where: { PacienteID: pacienteId } });
    const agendamentos = await Agendamento.findAll({ where: { PacienteID: pacienteId } });
    const exames = await ExameRealizado.findAll({ where: { PacienteID: pacienteId } });
    const diagnosticos = await DiagnosticoEmitido.findAll({ where: { PacienteID: pacienteId } });
    const medicamentos = await MedicamentoPrescrito.findAll({ where: { PacienteID: pacienteId } });
    const evolucoes = await EvolucaoPaciente.findAll({ where: { PacienteID: pacienteId } });
    const encaminhamentos = await EncaminhamentoEmitido.findAll({ where: { PacienteID: pacienteId } });

    return {
      dados,
      parentes,
      agendamentos,
      exames,
      diagnosticos,
      medicamentos,
      evolucoes,
      encaminhamentos
    };
  } catch (error) {
    throw new Error('Erro ao gerar histórico completo: ' + error.message);
  }
};
