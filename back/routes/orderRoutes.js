const express = require('express');
const orderController = require('../controllers/orderController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Rutas admin (antes de /:id para evitar conflicto)
router.get('/admin/all', auth, adminOnly, orderController.listarAdmin);
router.get('/admin/stats', auth, adminOnly, orderController.estadisticas);
router.put('/:id/estado', auth, adminOnly, orderController.actualizarEstado);

// Rutas de usuario autenticado
router.post('/', auth, orderController.crear);
router.get('/mis-ordenes', auth, orderController.misOrdenes);
router.get('/:id', auth, orderController.obtener);

module.exports = router;
