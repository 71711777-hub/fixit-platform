import express from 'express';
import { randomUUID } from 'node:crypto';
import { pool } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import multer from 'multer'; // 1. Importamos multer
import path from 'path';

const router = express.Router();

// 2. Configuración de Multer para guardar las imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Las imágenes irán a la carpeta
    cb(null, 'uploads/incidencias/'); 
  },
  filename: function (req, file, cb) {
    // Generamos un nombre único para que no se sobreescriban
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('El archivo no es una imagen'), false);
  }
};

// Middleware configurado (permite hasta 3 imágenes)
const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB por foto
});

// --- RUTAS ---

// Obtener tipos de equipo y categorías desde MySQL
router.get('/catalogos', async (req, res) => {
  try {
    const [tiposEquipo] = await pool.query(`
      SELECT id, codigo, nombre
      FROM tipos_equipo
      ORDER BY 
        CASE 
          WHEN LOWER(nombre) LIKE 'otro%' THEN 1 
          ELSE 0 
        END ASC,
        nombre ASC
    `);

    const [categorias] = await pool.query(`
      SELECT id, codigo, nombre
      FROM categorias_problema
      ORDER BY 
        CASE 
          WHEN LOWER(nombre) LIKE 'otro%' THEN 1
          WHEN LOWER(nombre) LIKE 'no estoy%' THEN 1
          WHEN LOWER(nombre) LIKE '%seguro%' THEN 1
          ELSE 0 
        END ASC,
        nombre ASC
    `);

    res.json({
      success: true,
      data: { tiposEquipo, categorias }
    });
  } catch (error) {
    console.error('Error al obtener catálogos:', error);
    res.status(500).json({
      success: false,
      message: 'No se pudieron cargar los catálogos'
    });
  }
});

// 3. El POST para intercepta las imágenes ('fotos' es el nombre del input en React)
router.post('/', authenticateToken, upload.array('fotos', 3), async (req, res) => {
  const connection = await pool.getConnection(); 
  await connection.beginTransaction();

  try {
    const { tipo_equipo_id, categoria_id, descripcion } = req.body;

    if (!tipo_equipo_id || !descripcion || descripcion.trim() === '') {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Faltan datos obligatorios' });
    }

    const incidenciaId = randomUUID();
    const clienteId = req.user.sub;
    const categoriaId = categoria_id || null;

    await connection.query(
      `INSERT INTO incidencias (id, cliente_id, tipo_equipo_id, categoria_id, descripcion, estado)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [incidenciaId, clienteId, tipo_equipo_id, categoriaId, descripcion.trim(), 'REPORTADA']
    );

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const adjuntoId = randomUUID();
        const urlArchivo = file.path.replace(/\\/g, '/'); 

        await connection.query(
          `INSERT INTO adjuntos_incidencia (id, incidencia_id, url_archivo, tipo_mime, tamano_bytes)
           VALUES (?, ?, ?, ?, ?)`,
          [adjuntoId, incidenciaId, urlArchivo, file.mimetype, file.size]
        );
      }
    }

    await connection.commit();
    connection.release();

    return res.status(201).json({
      success: true,
      message: 'Incidencia y fotos registradas correctamente',
      data: { id: incidenciaId }
    });

  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Error al registrar incidencia con fotos:', error);
    return res.status(500).json({ success: false, message: 'No se pudo registrar la incidencia' });
  }
});

/* Obtener incidencias del cliente autenticado */
router.get('/mis-incidencias', authenticateToken, async (req, res) => {
  try {
    const clienteId = req.user.sub;

    const [incidencias] = await pool.query(
      `SELECT i.id, i.descripcion, i.estado, i.creado_en,
        te.nombre AS tipo_equipo, cp.nombre AS categoria
       FROM incidencias i
       LEFT JOIN tipos_equipo te ON te.id = i.tipo_equipo_id
       LEFT JOIN categorias_problema cp ON cp.id = i.categoria_id
       WHERE i.cliente_id = ?
       ORDER BY i.creado_en DESC`,
      [clienteId]
    );

    return res.json({ success: true, data: incidencias });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener incidencias' });
  }
});

/* Obtener el detalle de una incidencia (con sus fotos) */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const incidenciaId = req.params.id;
    const clienteId = req.user.sub;

    // Obtener la incidencia
    const [incidencias] = await pool.query(
      `SELECT i.id, i.descripcion, i.estado, i.creado_en, i.actualizado_en,
        te.nombre AS tipo_equipo, cp.nombre AS categoria
       FROM incidencias i
       LEFT JOIN tipos_equipo te ON te.id = i.tipo_equipo_id
       LEFT JOIN categorias_problema cp ON cp.id = i.categoria_id
       WHERE i.id = ? AND i.cliente_id = ? LIMIT 1`,
      [incidenciaId, clienteId]
    );

    if (incidencias.length === 0) {
      return res.status(404).json({ success: false, message: 'Incidencia no encontrada' });
    }

    // Obtener las fotos asociadas
    const [fotos] = await pool.query(
      `SELECT url_archivo FROM adjuntos_incidencia WHERE incidencia_id = ?`,
      [incidenciaId]
    );

    const incidenciaData = incidencias[0];
    incidenciaData.fotos = fotos.map(f => f.url_archivo);

    return res.json({ success: true, data: incidenciaData });
  } catch (error) {
    console.error('Error al consultar incidencia:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener detalle' });
  }
});

export default router;