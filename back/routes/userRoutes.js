const express = require('express');
const userController = require('../controllers/userController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, adminOnly, userController.listar);
router.put('/:id/toggle', auth, adminOnly, userController.toggleActivo);
router.put('/:id/rol', auth, adminOnly, userController.cambiarRol);

module.exports = router;
