// src/models/MedicamentoPrescrito.js
module.exports = (sequelize, DataTypes) => {
  const MedicamentoPrescrito = sequelize.define('MedicamentoPrescrito', {
    PrescricaoID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
    NomeMedicamento: { type: DataTypes.STRING, allowNull: false },
    Dosagem: { type: DataTypes.STRING },
    Frequencia: { type: DataTypes.STRING },
    Duracao: { type: DataTypes.STRING },
    Observacoes: { type: DataTypes.TEXT }
  }, {
    tableName: 'MedicamentosPrescritos',
    timestamps: true
  });

  return MedicamentoPrescrito;
};
