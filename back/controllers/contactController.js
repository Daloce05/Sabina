const { ContactClick, Product } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

const contactController = {
  // POST /api/contacts/track - registrar clic de contacto (público)
  async registrar(req, res) {
    try {
      const { metodo, tipo, productId, productName } = req.body;

      if (!metodo) {
        return res.status(400).json({ success: false, message: 'Método de contacto requerido.' });
      }

      await ContactClick.create({
        metodo,
        tipo: tipo || 'general',
        productId: productId || null,
        productName: productName || null
      });

      res.json({ success: true });
    } catch (error) {
      console.error('Error al registrar contacto:', error);
      res.status(500).json({ success: false, message: 'Error al registrar contacto.' });
    }
  },

  // GET /api/contacts/stats - estadísticas de contacto (admin)
  async estadisticas(req, res) {
    try {
      const totalClics = await ContactClick.count();

      // Clics hoy
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const clicsHoy = await ContactClick.count({
        where: { createdAt: { [Op.gte]: hoy } }
      });

      // Clics esta semana
      const inicioSemana = new Date();
      inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
      inicioSemana.setHours(0, 0, 0, 0);
      const clicsSemana = await ContactClick.count({
        where: { createdAt: { [Op.gte]: inicioSemana } }
      });

      // Clics este mes
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      const clicsMes = await ContactClick.count({
        where: { createdAt: { [Op.gte]: inicioMes } }
      });

      // Por método
      const porMetodo = await ContactClick.findAll({
        attributes: ['metodo', [fn('COUNT', col('id')), 'total']],
        group: ['metodo'],
        order: [[literal('total'), 'DESC']]
      });

      // Productos más consultados (top 10)
      const productosTop = await ContactClick.findAll({
        attributes: ['productId', 'productName', [fn('COUNT', col('id')), 'total']],
        where: { productId: { [Op.ne]: null } },
        group: ['productId', 'productName'],
        order: [[literal('total'), 'DESC']],
        limit: 10
      });

      // Clics por día (últimos 7 días)
      const hace7dias = new Date();
      hace7dias.setDate(hace7dias.getDate() - 7);
      const porDia = await ContactClick.findAll({
        attributes: [
          [fn('DATE', col('createdAt')), 'fecha'],
          [fn('COUNT', col('id')), 'total']
        ],
        where: { createdAt: { [Op.gte]: hace7dias } },
        group: [fn('DATE', col('createdAt'))],
        order: [[fn('DATE', col('createdAt')), 'ASC']]
      });

      res.json({
        success: true,
        data: {
          totalClics,
          clicsHoy,
          clicsSemana,
          clicsMes,
          porMetodo,
          productosTop,
          porDia
        }
      });
    } catch (error) {
      console.error('Error al obtener estadísticas de contacto:', error);
      res.status(500).json({ success: false, message: 'Error al obtener estadísticas.' });
    }
  }
};

module.exports = contactController;
