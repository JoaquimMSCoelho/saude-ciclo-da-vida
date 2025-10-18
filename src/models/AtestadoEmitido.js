// src/models/AtestadoEmitido.js
module.exports = (sequelize, DataTypes) => {
  const AtestadoEmitido = sequelize.define('AtestadoEmitido', {
    AtestadoID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
    DiagnosticoID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'DiagnosticosEmitidos', key: 'DiagnosticoID' }
    },
    DataEmissao: { type: DataTypes.DATEONLY, allowNull: false },
    InicioAfastamento: { type: DataTypes.DATEONLY, allowNull: false },
    FimAfastamento: { type: DataTypes.DATEONLY, allowNull: false },
    Motivo: { type: DataTypes.TEXT },
    CID10: { type: DataTypes.STRING }
  }, {
    tableName: 'AtestadosEmitidos',
    timestamps: true
  });

  return AtestadoEmitido;
};
