const { Category } = require('../models');
const { uploadToSupabase } = require('../config/supabaseStorage');

const categoryController = {
  // GET /api/categories
  async listar(req, res) {
    try {
      const categories = await Category.findAll({
        where: { activo: true },
        order: [['nombre', 'ASC']]
      });
      res.json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al obtener categorías.' });
    }
  },

  // GET /api/categories/:id
  async obtener(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Categoría no encontrada.' });
      }
      res.json({ success: true, data: category });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al obtener categoría.' });
    }
  },

  // POST /api/categories (admin)
  async crear(req, res) {
    try {
      const { nombre, descripcion } = req.body;
      let imagen = null;

      if (req.file) {
        imagen = await uploadToSupabase(req.file, 'categories');
      }

      const category = await Category.create({ nombre, descripcion, imagen });
      res.status(201).json({ success: true, message: 'Categoría creada.', data: category });
    } catch (error) {
      console.error('Error al crear categoría:', error);
      res.status(500).json({ success: false, message: 'Error al crear categoría.' });
    }
  },

  // PUT /api/categories/:id (admin)
  async actualizar(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Categoría no encontrada.' });
      }

      const { nombre, descripcion, activo } = req.body;
      const updateData = { nombre, descripcion, activo };

      if (req.file) {
        updateData.imagen = await uploadToSupabase(req.file, 'categories');
      }

      await category.update(updateData);
      res.json({ success: true, message: 'Categoría actualizada.', data: category });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al actualizar categoría.' });
    }
  },

  // DELETE /api/categories/:id (admin)
  async eliminar(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Categoría no encontrada.' });
      }

      await category.update({ activo: false });
      res.json({ success: true, message: 'Categoría eliminada.' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al eliminar categoría.' });
    }
  },

  // GET /api/categories/admin/all
  async listarAdmin(req, res) {
    try {
      const categories = await Category.findAll({ order: [['nombre', 'ASC']] });
      res.json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al obtener categorías.' });
    }
  }
};

module.exports = categoryController;
