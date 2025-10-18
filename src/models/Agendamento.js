// src/models/Agendamento.js
module.exports = (sequelize, DataTypes) => {
  const Agendamento = sequelize.define('Agendamento', {
    AgendamentoID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
    EspecialidadeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Especialidades', key: 'EspecialidadeID' }
    },
    LocalID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'LocaisExameConsultas', key: 'LocalID' }
    },
    DataHora: { type: DataTypes.DATE, allowNull: false },
    TipoAgendamento: {
      type: DataTypes.ENUM('Consulta', 'Exame', 'Retorno'),
      allowNull: false
    },
    Confirmado: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'Agendamentos',
    timestamps: true
  });

  return Agendamento;
};
