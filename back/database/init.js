require('dotenv').config();
const { sequelize } = require('../config/database');
const { User, Category, Product, Setting } = require('../models');
const bcrypt = require('bcryptjs');

async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida.');

    await sequelize.sync({ force: true });
    console.log('Tablas creadas.');

    // Crear admin por defecto
    const salt = await bcrypt.genSalt(10);
    await User.create({
      nombre: 'Admin',
      apellido: 'Sabina',
      email: 'admin@sabina.com',
      password: 'admin123',
      rol: 'admin',
      telefono: '0000000000'
    });

    // Crear categorías iniciales
    const categorias = await Category.bulkCreate([
      { nombre: 'Hongos Frescos', descripcion: 'Hongos frescos recién cosechados de nuestros cultivos.' },
      { nombre: 'Hongos Deshidratados', descripcion: 'Hongos deshidratados para mayor conservación y sabor concentrado.' },
      { nombre: 'Suplementos', descripcion: 'Suplementos naturales a base de hongos medicinales.' },
      { nombre: 'Extractos', descripcion: 'Extractos concentrados de hongos con propiedades medicinales.' },
      { nombre: 'Comestibles Gourmet', descripcion: 'Productos gourmet elaborados con hongos selectos.' }
    ]);

    // Crear productos de ejemplo
    await Product.bulkCreate([
      { nombre: 'Shiitake Fresco 250g', descripcion: 'Hongos shiitake frescos, perfectos para salteados y sopas. Rico en vitaminas del grupo B y minerales.', precio: 8.50, stock: 100, categoryId: categorias[0].id, destacado: true },
      { nombre: 'Portobello Premium 500g', descripcion: 'Hongos portobello de gran tamaño, ideales para asar o rellenar.', precio: 12.00, stock: 80, categoryId: categorias[0].id, destacado: true },
      { nombre: 'Champiñón Orgánico 300g', descripcion: 'Champiñones orgánicos cultivados sin pesticidas.', precio: 6.50, stock: 150, categoryId: categorias[0].id },
      { nombre: 'Mix Hongos Deshidratados 100g', descripcion: 'Mezcla de hongos deshidratados: shiitake, maitake y reishi.', precio: 15.00, stock: 60, categoryId: categorias[1].id, destacado: true },
      { nombre: 'Reishi Deshidratado 50g', descripcion: 'Hongo reishi deshidratado, conocido como el hongo de la inmortalidad.', precio: 22.00, stock: 40, categoryId: categorias[1].id },
      { nombre: 'Cápsulas de Melena de León', descripcion: '60 cápsulas de extracto de melena de león para salud cognitiva.', precio: 35.00, stock: 30, categoryId: categorias[2].id, destacado: true },
      { nombre: 'Cordyceps en Polvo 100g', descripcion: 'Polvo de cordyceps para energía y rendimiento deportivo.', precio: 28.00, stock: 45, categoryId: categorias[2].id },
      { nombre: 'Extracto de Chaga 30ml', descripcion: 'Extracto líquido de chaga, potente antioxidante natural.', precio: 40.00, stock: 25, categoryId: categorias[3].id },
      { nombre: 'Tintura de Reishi 50ml', descripcion: 'Tintura concentrada de reishi para sistema inmunológico.', precio: 45.00, stock: 20, categoryId: categorias[3].id },
      { nombre: 'Paté de Hongos Silvestres', descripcion: 'Paté artesanal elaborado con hongos silvestres selectos.', precio: 18.00, stock: 35, categoryId: categorias[4].id },
      { nombre: 'Risotto de Hongos Kit', descripcion: 'Kit completo para preparar risotto de hongos gourmet en casa.', precio: 14.00, stock: 50, categoryId: categorias[4].id },
    ]);

    // Crear configuraciones por defecto
    await Setting.bulkCreate([
      { clave: 'nombre_empresa', valor: 'Sabina Medicina', descripcion: 'Nombre de la empresa' },
      { clave: 'contacto_metodo', valor: 'whatsapp', descripcion: 'Método de contacto principal (whatsapp, telefono, email, instagram)' },
      { clave: 'contacto_whatsapp', valor: '573195631384', descripcion: 'Número de WhatsApp (con código de país)' },
      { clave: 'contacto_telefono', valor: '', descripcion: 'Número de teléfono' },
      { clave: 'contacto_email', valor: '', descripcion: 'Correo electrónico de contacto' },
      { clave: 'contacto_instagram', valor: '', descripcion: 'Usuario de Instagram (sin @)' },
    ]);

    console.log('Datos iniciales creados exitosamente.');
    console.log('Admin: admin@sabina.com / admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  }
}

initDatabase();
