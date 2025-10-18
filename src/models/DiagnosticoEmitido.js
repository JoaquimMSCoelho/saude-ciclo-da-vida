// src/models/DiagnosticoEmitido.js
module.exports = (sequelize, DataTypes) => {
  const DiagnosticoEmitido = sequelize.define('DiagnosticoEmitido', {
    DiagnosticoID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
    Diagnostico: { type: DataTypes.TEXT, allowNull: false },
    CID10: { type: DataTypes.STRING },
    DataEmissao: { type: DataTypes.DATEONLY, allowNull: false },
    Observacoes: { type: DataTypes.TEXT }
  }, {
    tableName: 'DiagnosticosEmitidos',
    timestamps: true
  });

  return DiagnosticoEmitido;
};
