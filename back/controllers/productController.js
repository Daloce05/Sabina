const { Op } = require('sequelize');
const { Product, Category } = require('../models');

const productController = {
  // GET /api/products
  async listar(req, res) {
    try {
      const { page = 1, limit = 12, search, categoryId, destacado } = req.query;
      const offset = (page - 1) * limit;
      const where = { activo: true };

      if (search) {
        where[Op.or] = [
          { nombre: { [Op.iLike]: `%${search}%` } },
          { descripcion: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (categoryId) where.categoryId = categoryId;
      if (destacado === 'true') where.destacado = true;

      const { count, rows } = await Product.findAndCountAll({
        where,
        include: [{ model: Category, as: 'categoria', attributes: ['id', 'nombre'] }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          products: rows,
          total: count,
          page: parseInt(page),
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Error al listar productos:', error);
      res.status(500).json({ success: false, message: 'Error al obtener productos.' });
    }
  },

  // GET /api/products/:id
  async obtener(req, res) {
    try {
      const product = await Product.findByPk(req.params.id, {
        include: [{ model: Category, as: 'categoria' }]
      });

      if (!product) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
      }

      res.json({ success: true, data: product });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al obtener producto.' });
    }
  },

  // POST /api/products (admin)
  async crear(req, res) {
    try {
      const { nombre, descripcion, precio, stock, categoryId, destacado } = req.body;
      const imagen = req.file ? `/uploads/${req.file.filename}` : null;

      const product = await Product.create({
        nombre, descripcion, precio, stock, categoryId, destacado, imagen
      });

      res.status(201).json({ success: true, message: 'Producto creado.', data: product });
    } catch (error) {
      console.error('Error al crear producto:', error);
      res.status(500).json({ success: false, message: 'Error al crear producto.' });
    }
  },

  // PUT /api/products/:id (admin)
  async actualizar(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
      }

      const { nombre, descripcion, precio, stock, categoryId, destacado, activo } = req.body;
      const updateData = { nombre, descripcion, precio, stock, categoryId, destacado, activo };

      if (req.file) {
        updateData.imagen = `/uploads/${req.file.filename}`;
      }

      await product.update(updateData);
      res.json({ success: true, message: 'Producto actualizado.', data: product });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al actualizar producto.' });
    }
  },

  // DELETE /api/products/:id (admin)
  async eliminar(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
      }

      await product.update({ activo: false });
      res.json({ success: true, message: 'Producto eliminado.' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al eliminar producto.' });
    }
  },

  // GET /api/products/admin/all (admin - incluye inactivos)
  async listarAdmin(req, res) {
    try {
      const { page = 1, limit = 20, search } = req.query;
      const offset = (page - 1) * limit;
      const where = {};

      if (search) {
        where[Op.or] = [
          { nombre: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { count, rows } = await Product.findAndCountAll({
        where,
        include: [{ model: Category, as: 'categoria', attributes: ['id', 'nombre'] }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: { products: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al obtener productos.' });
    }
  }
};

module.exports = productController;
