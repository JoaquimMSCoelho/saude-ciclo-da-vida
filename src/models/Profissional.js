// src/models/Profissional.js
module.exports = (sequelize, DataTypes) => {
  const Profissional = sequelize.define('Profissional', {
    ProfissionalID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    NomeCompleto: { type: DataTypes.STRING, allowNull: false },
    EspecialidadeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Especialidades', key: 'EspecialidadeID' }
    },
    RegistroProfissional: { type: DataTypes.STRING, allowNull: false },
    Telefone: { type: DataTypes.STRING },
    Email: { type: DataTypes.STRING },
    Ativo: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'Profissionais',
    timestamps: true
  });

  return Profissional;
};
