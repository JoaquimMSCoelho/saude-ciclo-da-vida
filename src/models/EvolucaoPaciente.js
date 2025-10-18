// src/models/EvolucaoPaciente.js
module.exports = (sequelize, DataTypes) => {
  const EvolucaoPaciente = sequelize.define('EvolucaoPaciente', {
    EvolucaoID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
    DataRegistro: { type: DataTypes.DATEONLY, allowNull: false },
    Observacoes: { type: DataTypes.TEXT, allowNull: false },
    StatusPaciente: {
      type: DataTypes.ENUM('Estável', 'Melhora', 'Piora', 'Crítico', 'Recuperado'),
      allowNull: false
    }
  }, {
    tableName: 'EvolucoesPaciente',
    timestamps: true
  });

  return EvolucaoPaciente;
};
