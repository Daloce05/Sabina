const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const BUCKET = process.env.SUPABASE_BUCKET || 'images';

/**
 * Sube un archivo a Supabase Storage
 * @param {Object} file - Objeto file de multer (con path, originalname, mimetype)
 * @param {string} folder - Carpeta dentro del bucket (ej: 'products', 'categories')
 * @returns {string} URL pública de la imagen
 */
async function uploadToSupabase(file, folder = 'general') {
  const ext = path.extname(file.originalname);
  const fileName = `${folder}/${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;

  const fileBuffer = fs.readFileSync(file.path);

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, fileBuffer, {
      contentType: file.mimetype,
      upsert: false
    });

  // Eliminar archivo temporal local
  fs.unlinkSync(file.path);

  if (error) {
    throw new Error(`Error al subir imagen: ${error.message}`);
  }

  // Obtener URL pública
  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

/**
 * Elimina un archivo de Supabase Storage por su URL pública
 * @param {string} publicUrl - URL pública del archivo
 */
async function deleteFromSupabase(publicUrl) {
  if (!publicUrl || !publicUrl.includes(BUCKET)) return;

  try {
    // Extraer el path del archivo desde la URL
    const parts = publicUrl.split(`/storage/v1/object/public/${BUCKET}/`);
    if (parts.length < 2) return;

    const filePath = parts[1];
    await supabase.storage.from(BUCKET).remove([filePath]);
  } catch (err) {
    console.error('Error al eliminar imagen de Supabase:', err.message);
  }
}

module.exports = { uploadToSupabase, deleteFromSupabase };
