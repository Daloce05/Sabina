const express = require('express');
const categoryController = require('../controllers/categoryController');
const { auth, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Rutas públicas
router.get('/', categoryController.listar);
router.get('/:id', categoryController.obtener);

// Rutas admin
router.get('/admin/all', auth, adminOnly, categoryController.listarAdmin);
router.post('/', auth, adminOnly, upload.single('imagen'), categoryController.crear);
router.put('/:id', auth, adminOnly, upload.single('imagen'), categoryController.actualizar);
router.delete('/:id', auth, adminOnly, categoryController.eliminar);

module.exports = router;
