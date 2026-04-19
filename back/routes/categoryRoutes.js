const express = require('express');
const categoryController = require('../controllers/categoryController');
const { auth, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Rutas admin (antes de /:id para evitar conflicto)
router.get('/admin/all', auth, adminOnly, categoryController.listarAdmin);
router.post('/', auth, adminOnly, upload.single('imagen'), categoryController.crear);
router.put('/:id', auth, adminOnly, upload.single('imagen'), categoryController.actualizar);

// Eliminación lógica
router.delete('/:id', auth, adminOnly, categoryController.eliminar);
// Eliminación permanente
router.delete('/:id/permanent', auth, adminOnly, categoryController.eliminarPermanentemente);

// Rutas públicas
router.get('/', categoryController.listar);
router.get('/:id', categoryController.obtener);

module.exports = router;
