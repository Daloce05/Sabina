const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const { obtenerPublicas, listar, actualizar } = require('../controllers/settingController');

// Público - obtener configuraciones de contacto
router.get('/public', obtenerPublicas);

// Admin - listar todas
router.get('/', auth, adminOnly, listar);

// Admin - actualizar configuraciones
router.put('/', auth, adminOnly, actualizar);

module.exports = router;
