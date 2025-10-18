// src/routes/localRoutes.js
const express = require('express');
const router = express.Router();
const localController = require('../controllers/localController');

router.post('/cadastro', localController.cadastrarLocal);
router.get('/listar', localController.listarLocais);

module.exports = router;
