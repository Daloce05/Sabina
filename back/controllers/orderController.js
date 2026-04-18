const { Order, OrderItem, Product, User } = require('../models');
const { sequelize } = require('../config/database');

const orderController = {
  // POST /api/orders
  async crear(req, res) {
    const t = await sequelize.transaction();
    try {
      const { items, direccionEnvio, telefono, notas } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ success: false, message: 'El pedido debe tener al menos un producto.' });
      }

      let total = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findByPk(item.productId, { transaction: t });
        if (!product || !product.activo) {
          await t.rollback();
          return res.status(400).json({ success: false, message: `Producto ${item.productId} no disponible.` });
        }

        if (product.stock < item.cantidad) {
          await t.rollback();
          return res.status(400).json({ success: false, message: `Stock insuficiente para ${product.nombre}.` });
        }

        const subtotal = parseFloat(product.precio) * item.cantidad;
        total += subtotal;

        orderItems.push({
          productId: product.id,
          cantidad: item.cantidad,
          precioUnitario: product.precio,
          subtotal
        });

        await product.update(
          { stock: product.stock - item.cantidad },
          { transaction: t }
        );
      }

      const order = await Order.create(
        { userId: req.user.id, total, direccionEnvio, telefono, notas },
        { transaction: t }
      );

      for (const item of orderItems) {
        await OrderItem.create(
          { ...item, orderId: order.id },
          { transaction: t }
        );
      }

      await t.commit();

      const fullOrder = await Order.findByPk(order.id, {
        include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'producto' }] }]
      });

      res.status(201).json({ success: true, message: 'Pedido creado exitosamente.', data: fullOrder });
    } catch (error) {
      await t.rollback();
      console.error('Error al crear pedido:', error);
      res.status(500).json({ success: false, message: 'Error al crear pedido.' });
    }
  },

  // GET /api/orders (usuario - sus pedidos)
  async misOrdenes(req, res) {
    try {
      const orders = await Order.findAll({
        where: { userId: req.user.id },
        include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'producto' }] }],
        order: [['createdAt', 'DESC']]
      });

      res.json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al obtener pedidos.' });
    }
  },

  // GET /api/orders/:id
  async obtener(req, res) {
    try {
      const order = await Order.findByPk(req.params.id, {
        include: [
          { model: OrderItem, as: 'items', include: [{ model: Product, as: 'producto' }] },
          { model: User, as: 'usuario' }
        ]
      });

      if (!order) {
        return res.status(404).json({ success: false, message: 'Pedido no encontrado.' });
      }

      if (req.user.rol !== 'admin' && order.userId !== req.user.id) {
        return res.status(403).json({ success: false, message: 'No autorizado.' });
      }

      res.json({ success: true, data: order });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al obtener pedido.' });
    }
  },

  // PUT /api/orders/:id/estado (admin)
  async actualizarEstado(req, res) {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Pedido no encontrado.' });
      }

      const { estado } = req.body;
      await order.update({ estado });

      res.json({ success: true, message: 'Estado del pedido actualizado.', data: order });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al actualizar pedido.' });
    }
  },

  // GET /api/orders/admin/all (admin)
  async listarAdmin(req, res) {
    try {
      const { page = 1, limit = 20, estado } = req.query;
      const offset = (page - 1) * limit;
      const where = {};
      if (estado) where.estado = estado;

      const { count, rows } = await Order.findAndCountAll({
        where,
        include: [
          { model: User, as: 'usuario', attributes: ['id', 'nombre', 'apellido', 'email'] },
          { model: OrderItem, as: 'items', include: [{ model: Product, as: 'producto' }] }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: { orders: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al obtener pedidos.' });
    }
  },

  // GET /api/orders/admin/stats (admin)
  async estadisticas(req, res) {
    try {
      const totalOrdenes = await Order.count();
      const ordenesPendientes = await Order.count({ where: { estado: 'pendiente' } });
      const totalVentas = await Order.sum('total', { where: { estado: { [require('sequelize').Op.ne]: 'cancelado' } } });
      const totalUsuarios = await User.count({ where: { rol: 'cliente' } });

      res.json({
        success: true,
        data: { totalOrdenes, ordenesPendientes, totalVentas: totalVentas || 0, totalUsuarios }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al obtener estadísticas.' });
    }
  }
};

module.exports = orderController;
