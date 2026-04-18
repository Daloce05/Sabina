const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Acceso denegado. Token no proporcionado.' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user || !user.activo) {
      return res.status(401).json({ success: false, message: 'Token inválido o usuario desactivado.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token inválido.' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ success: false, message: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
  next();
};

module.exports = { auth, adminOnly };
