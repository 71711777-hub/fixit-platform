import { Router } from 'express';
import { pool } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, correo, nombre_completo, telefono,
              tipo_documento, nro_documento, rol, estado,
              correo_verificado_en, creado_en, actualizado_en
       FROM usuarios WHERE id = ? LIMIT 1`,
      [req.user.sub]
    );

    if (!rows.length) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado.'
      });
    }

    return res.json({ ok: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});
router.put('/me', authenticateToken, async (req, res, next) => {
  try {
    const {
      nombre_completo,
      telefono,
      tipo_documento,
      nro_documento
    } = req.body;

    if (!nombre_completo || !tipo_documento || !nro_documento) {
      return res.status(400).json({
        ok: false,
        message: 'Nombre completo, tipo de documento y número de documento son obligatorios.'
      });
    }

    await pool.execute(
      `UPDATE usuarios
       SET nombre_completo = ?,
           telefono = ?,
           tipo_documento = ?,
           nro_documento = ?
       WHERE id = ?`,
      [
        nombre_completo,
        telefono || null,
        tipo_documento,
        nro_documento,
        req.user.sub
      ]
    );

    const [rows] = await pool.execute(
      `SELECT id, correo, nombre_completo, telefono,
              tipo_documento, nro_documento, rol, estado,
              correo_verificado_en, creado_en, actualizado_en
       FROM usuarios
       WHERE id = ?
       LIMIT 1`,
      [req.user.sub]
    );

    return res.json({
      ok: true,
      message: 'Datos actualizados correctamente.',
      data: rows[0]
    });
  } catch (error) {
    next(error);
  }
});

export default router;
