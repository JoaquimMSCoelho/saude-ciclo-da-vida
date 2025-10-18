// src/models/Parente.js
module.exports = (sequelize, DataTypes) => {
  const Parente = sequelize.define('Parente', {
    ParenteID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    PacienteID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'MeusDados', key: 'PacienteID' }
    },
    NomeCompleto: { type: DataTypes.STRING, allowNull: false },
    GrauParentesco: {
      type: DataTypes.ENUM('Pai', 'Mãe', 'Filho', 'Filha', 'Irmão', 'Irmã', 'Tio', 'Tia', 'Avô', 'Avó', 'Outro'),
      allowNull: false
    },
    Telefone: { type: DataTypes.STRING },
    Email: { type: DataTypes.STRING },
    ResponsavelLegal: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'Parentes',
    timestamps: true
  });

  return Parente;
};
