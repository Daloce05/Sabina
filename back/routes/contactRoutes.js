const express = require('express');
const contactController = require('../controllers/contactController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Público - registrar clic
router.post('/track', contactController.registrar);

// Admin - estadísticas
router.get('/stats', auth, adminOnly, contactController.estadisticas);

module.exports = router;
