const Setting = require('../models/Setting');

// Obtener todas las configuraciones (público - solo las necesarias)
const obtenerPublicas = async (req, res) => {
  try {
    const settings = await Setting.findAll({
      where: {
        clave: [
          'contacto_metodo',
          'contacto_whatsapp',
          'contacto_telefono',
          'contacto_email',
          'contacto_instagram',
          'nombre_empresa'
        ]
      }
    });

    const config = {};
    settings.forEach(s => {
      config[s.clave] = s.valor;
    });

    res.json({ success: true, data: config });
  } catch (error) {
    console.error('Error al obtener configuraciones:', error);
    res.status(500).json({ success: false, message: 'Error al obtener configuraciones.' });
  }
};

// Obtener todas las configuraciones (admin)
const listar = async (req, res) => {
  try {
    const settings = await Setting.findAll({ order: [['clave', 'ASC']] });
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error al obtener configuraciones:', error);
    res.status(500).json({ success: false, message: 'Error al obtener configuraciones.' });
  }
};

// Actualizar configuraciones (admin)
const actualizar = async (req, res) => {
  try {
    const { settings } = req.body;

    if (!settings || !Array.isArray(settings)) {
      return res.status(400).json({ success: false, message: 'Se requiere un array de configuraciones.' });
    }

    for (const item of settings) {
      if (!item.clave || typeof item.valor === 'undefined') continue;

      await Setting.upsert({
        clave: item.clave,
        valor: String(item.valor),
        descripcion: item.descripcion || null
      });
    }

    const updated = await Setting.findAll({ order: [['clave', 'ASC']] });
    res.json({ success: true, message: 'Configuraciones actualizadas.', data: updated });
  } catch (error) {
    console.error('Error al actualizar configuraciones:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar configuraciones.' });
  }
};

module.exports = { obtenerPublicas, listar, actualizar };
