// src/models/Local.js
module.exports = (sequelize, DataTypes) => {
  const Local = sequelize.define('Local', {
    LocalID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    NomeLocal: { type: DataTypes.STRING, allowNull: false },
    Endereco: { type: DataTypes.STRING },
    Telefone: { type: DataTypes.STRING },
    TipoLocal: {
      type: DataTypes.ENUM('Clínica', 'Hospital', 'Laboratório', 'Outro'),
      allowNull: false
    }
  }, {
    tableName: 'LocaisExameConsultas',
    timestamps: true
  });

  return Local;
};
