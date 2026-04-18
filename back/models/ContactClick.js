const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ContactClick = sequelize.define('ContactClick', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  metodo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'whatsapp, telefono, email, instagram'
  },
  tipo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'producto',
    comment: 'producto o general'
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  productName: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'contact_clicks',
  timestamps: true,
  updatedAt: false
});

module.exports = ContactClick;
