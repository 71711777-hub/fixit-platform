import express from 'express';
import { randomUUID } from 'node:crypto';
import { pool } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Obtener tipos de equipo y categorías desde MySQL
router.get('/catalogos', async (req, res) => {
  try {
    const [tiposEquipo] = await pool.query(`
      SELECT id, codigo, nombre
      FROM tipos_equipo
      ORDER BY nombre
    `);

    const [categorias] = await pool.query(`
      SELECT id, codigo, nombre
      FROM categorias_problema
      ORDER BY nombre
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

// Registrar una incidencia para el usuario autenticado
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { tipo_equipo_id, categoria_id, descripcion } = req.body;

    if (
      typeof tipo_equipo_id !== 'string' ||
      !tipo_equipo_id.trim() ||
      typeof descripcion !== 'string' ||
      !descripcion.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Selecciona un tipo de equipo e ingresa una descripción'
      });
    }

    if (descripcion.trim().length > 500) {
      return res.status(400).json({
        success: false,
        message: 'La descripción no puede superar los 500 caracteres'
      });
    }

    if (
      categoria_id !== undefined &&
      categoria_id !== null &&
      (typeof categoria_id !== 'string' || !categoria_id.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: 'La categoría seleccionada no es válida'
      });
    }

    const [tipos] = await pool.query(
      'SELECT id FROM tipos_equipo WHERE id = ?',
      [tipo_equipo_id]
    );

    if (tipos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El tipo de equipo seleccionado no existe'
      });
    }

    const categoriaId = categoria_id || null;

    if (categoriaId) {
      const [categorias] = await pool.query(
        'SELECT id FROM categorias_problema WHERE id = ?',
        [categoriaId]
      );

      if (categorias.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'La categoría seleccionada no existe'
        });
      }
    }

    const incidenciaId = randomUUID();
    const clienteId = req.user.sub;

    await pool.query(
      `INSERT INTO incidencias
        (id, cliente_id, tipo_equipo_id, categoria_id, descripcion, estado)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        incidenciaId,
        clienteId,
        tipo_equipo_id,
        categoriaId,
        descripcion.trim(),
        'REPORTADA'
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Incidencia registrada correctamente',
      data: {
        id: incidenciaId,
        estado: 'REPORTADA'
      }
    });
  } catch (error) {
    console.error('Error al registrar incidencia:', error);

    return res.status(500).json({
      success: false,
      message: 'No se pudo registrar la incidencia'
    });
  }
});


/* Obtener incidencias del cliente autenticado */
router.get('/mis-incidencias', authenticateToken, async (req, res) => {
  try {
    const clienteId = req.user.sub;

    const [incidencias] = await pool.query(
      `SELECT
        i.id,
        i.descripcion,
        i.estado,
        i.creado_en,
        te.nombre AS tipo_equipo,
        cp.nombre AS categoria
      FROM incidencias i
      LEFT JOIN tipos_equipo te
        ON te.id = i.tipo_equipo_id
      LEFT JOIN categorias_problema cp
        ON cp.id = i.categoria_id
      WHERE i.cliente_id = ?
      ORDER BY i.creado_en DESC`,
      [clienteId]
    );

    return res.json({
      success: true,
      data: incidencias
    });
  } catch (error) {
    console.error(
      'Error al obtener incidencias del cliente:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'No se pudieron obtener tus incidencias'
    });
  }
});


/* Obtener el detalle de una incidencia del cliente */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const incidenciaId = req.params.id;
    const clienteId = req.user.sub;

    const [incidencias] = await pool.query(
      `SELECT
        i.id,
        i.descripcion,
        i.estado,
        i.creado_en,
        i.actualizado_en,
        te.nombre AS tipo_equipo,
        cp.nombre AS categoria
      FROM incidencias i
      LEFT JOIN tipos_equipo te
        ON te.id = i.tipo_equipo_id
      LEFT JOIN categorias_problema cp
        ON cp.id = i.categoria_id
      WHERE i.id = ?
        AND i.cliente_id = ?
      LIMIT 1`,
      [incidenciaId, clienteId]
    );

    if (incidencias.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Incidencia no encontrada'
      });
    }

    return res.json({
      success: true,
      data: incidencias[0]
    });
  } catch (error) {
    console.error('Error al consultar incidencia:', error);

    return res.status(500).json({
      success: false,
      message: 'No se pudo obtener el detalle de la incidencia'
    });
  }
});


export default router;

