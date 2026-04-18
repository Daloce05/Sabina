const { User } = require('../models');

const userController = {
  // GET /api/users (admin)
  async listar(req, res) {
    try {
      const users = await User.findAll({
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['password'] }
      });
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al obtener usuarios.' });
    }
  },

  // PUT /api/users/:id/toggle (admin)
  async toggleActivo(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
      }
      await user.update({ activo: !user.activo });
      res.json({ success: true, message: 'Estado del usuario actualizado.', data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al actualizar usuario.' });
    }
  },

  // PUT /api/users/:id/rol (admin)
  async cambiarRol(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
      }
      const { rol } = req.body;
      await user.update({ rol });
      res.json({ success: true, message: 'Rol del usuario actualizado.', data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al actualizar rol.' });
    }
  }
};

module.exports = userController;
