const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Setting = require('./Setting');
const ContactClick = require('./ContactClick');

// Relaciones

// Category - Product (1:N)
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'productos' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'categoria' });

// User - Order (1:N)
User.hasMany(Order, { foreignKey: 'userId', as: 'ordenes' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'usuario' });

// Order - OrderItem (1:N)
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'orden' });

// Product - OrderItem (1:N)
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'producto' });

module.exports = {
  User,
  Product,
  Category,
  Order,
  OrderItem,
  Setting,
  ContactClick
};
