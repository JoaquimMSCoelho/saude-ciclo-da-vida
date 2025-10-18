// src/models/EncaminhamentoEmitido.js
module.exports = (sequelize, DataTypes) => {
  const EncaminhamentoEmitido = sequelize.define('EncaminhamentoEmitido', {
    EncaminhamentoID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    PacienteID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'MeusDados', key: 'PacienteID' }
    },
    ProfissionalID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Profissionais', key: 'ProfissionalID' }
    },
    AgendamentoID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Agendamentos', key: 'AgendamentoID' }
    },
    EspecialidadeDestino: { type: DataTypes.STRING, allowNull: false },
    InstituicaoDestino: { type: DataTypes.STRING },
    MotivoEncaminhamento: { type: DataTypes.TEXT },
    DataEncaminhamento: { type: DataTypes.DATEONLY, allowNull: false }
  }, {
    tableName: 'EncaminhamentosEmitidos',
    timestamps: true
  });

  return EncaminhamentoEmitido;
};
