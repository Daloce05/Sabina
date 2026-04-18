const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/registro', [
  body('nombre').notEmpty().withMessage('El nombre es requerido.'),
  body('apellido').notEmpty().withMessage('El apellido es requerido.'),
  body('email').isEmail().withMessage('Email inválido.'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.')
], authController.registro);

router.post('/login', [
  body('email').isEmail().withMessage('Email inválido.'),
  body('password').notEmpty().withMessage('La contraseña es requerida.')
], authController.login);

router.get('/perfil', auth, authController.perfil);
router.put('/perfil', auth, authController.actualizarPerfil);

module.exports = router;
