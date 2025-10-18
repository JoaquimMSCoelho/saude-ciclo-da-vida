// src/models/ExameRealizado.js
module.exports = (sequelize, DataTypes) => {
  const ExameRealizado = sequelize.define('ExameRealizado', {
    ExameID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    PacienteID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'MeusDados', key: 'PacienteID' }
    },
    AgendamentoID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Agendamentos', key: 'AgendamentoID' }
    },
    ProfissionalID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Profissionais', key: 'ProfissionalID' }
    },
    LocalID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'LocaisExameConsultas', key: 'LocalID' }
    },
    TipoExame: { type: DataTypes.STRING, allowNull: false },
    DataRealizacao: { type: DataTypes.DATEONLY, allowNull: false },
    Resultado: { type: DataTypes.TEXT },
    Observacoes: { type: DataTypes.TEXT }
  }, {
    tableName: 'ExamesRealizados',
    timestamps: true
  });

  return ExameRealizado;
};
