const express = require('express');
const productController = require('../controllers/productController');
const { auth, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Rutas admin (antes de /:id para evitar conflicto)
router.get('/admin/all', auth, adminOnly, productController.listarAdmin);
router.post('/', auth, adminOnly, upload.single('imagen'), productController.crear);
router.put('/:id', auth, adminOnly, upload.single('imagen'), productController.actualizar);

// Eliminación lógica
router.delete('/:id', auth, adminOnly, productController.eliminar);
// Eliminación permanente
router.delete('/:id/permanent', auth, adminOnly, productController.eliminarPermanentemente);

// Rutas públicas
router.get('/', productController.listar);
router.get('/:id', productController.obtener);

module.exports = router;
