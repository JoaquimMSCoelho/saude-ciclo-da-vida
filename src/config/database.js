// src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

module.exports = new Sequelize(process.env.SUPABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  }
});
