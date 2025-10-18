// src/models/MeusDados.js
module.exports = (sequelize, DataTypes) => {
  const MeusDados = sequelize.define('MeusDados', {
    PacienteID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    NomeCompleto: { type: DataTypes.STRING, allowNull: false },
    CPF: { type: DataTypes.STRING, allowNull: false, unique: true },
    DataNascimento: { type: DataTypes.DATEONLY, allowNull: false },
    Genero: {
      type: DataTypes.ENUM('Masculino', 'Feminino', 'Outro', 'Prefere não dizer'),
      allowNull: false
    },
    VinculoInstitucional: { type: DataTypes.STRING },
    Observacoes: { type: DataTypes.TEXT }
  }, {
    tableName: 'MeusDados',
    timestamps: true
  });

  return MeusDados;
};
