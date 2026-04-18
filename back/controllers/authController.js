const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { User } = require('../models');

const generarToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const authController = {
  // POST /api/auth/registro
  async registro(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { nombre, apellido, email, password, telefono, direccion } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'El email ya está registrado.' });
      }

      const user = await User.create({ nombre, apellido, email, password, telefono, direccion });
      const token = generarToken(user);

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente.',
        data: { user, token }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ success: false, message: 'Error al registrar usuario.' });
    }
  },

  // POST /api/auth/login
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
      }

      if (!user.activo) {
        return res.status(401).json({ success: false, message: 'Cuenta desactivada.' });
      }

      const isValid = await user.validarPassword(password);
      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
      }

      const token = generarToken(user);

      res.json({
        success: true,
        message: 'Login exitoso.',
        data: { user, token }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ success: false, message: 'Error al iniciar sesión.' });
    }
  },

  // GET /api/auth/perfil
  async perfil(req, res) {
    try {
      res.json({ success: true, data: req.user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al obtener perfil.' });
    }
  },

  // PUT /api/auth/perfil
  async actualizarPerfil(req, res) {
    try {
      const { nombre, apellido, telefono, direccion } = req.body;
      await req.user.update({ nombre, apellido, telefono, direccion });
      res.json({ success: true, message: 'Perfil actualizado.', data: req.user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al actualizar perfil.' });
    }
  }
};

module.exports = authController;
