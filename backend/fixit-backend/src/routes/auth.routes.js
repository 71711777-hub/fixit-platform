import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { pool } from '../db.js';

const router = Router();

function publicUser(user) {
  return {
    id: user.id,
    correo: user.correo,
    nombre_completo: user.nombre_completo,
    telefono: user.telefono,
    tipo_documento: user.tipo_documento,
    nro_documento: user.nro_documento,
    rol: user.rol,
    estado: user.estado,
    correo_verificado_en: user.correo_verificado_en,
    creado_en: user.creado_en,
    actualizado_en: user.actualizado_en
  };
}

function createToken(user) {
  return jwt.sign(
    { sub: user.id, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
  );
}

// Registro de usuario
router.post('/register', async (req, res, next) => {
  try {
    const {
      correo,
      contrasena,
      nombre_completo,
      telefono = null,
      tipo_documento = null,
      nro_documento = null
    } = req.body;

    if (!correo || !contrasena || !nombre_completo) {
      return res.status(400).json({
        ok: false,
        message: 'correo, contrasena y nombre_completo son obligatorios.'
      });
    }

    if (contrasena.length < 8) {
      return res.status(400).json({
        ok: false,
        message: 'La contraseña debe tener al menos 8 caracteres.'
      });
    }

    const normalizedEmail = String(correo).trim().toLowerCase();
    const [existing] = await pool.execute(
      'SELECT id FROM usuarios WHERE correo = ? LIMIT 1',
      [normalizedEmail]
    );

    if (existing.length) {
      return res.status(409).json({
        ok: false,
        message: 'El correo ya está registrado.'
      });
    }

    const id = randomUUID();
    const hash = await bcrypt.hash(contrasena, 12);

    await pool.execute(
      `INSERT INTO usuarios
       (id, correo, hash_contrasena, nombre_completo, telefono,
        tipo_documento, nro_documento, rol, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'CLIENTE', 'ACTIVO')`,
      [id, normalizedEmail, hash, nombre_completo.trim(), telefono, tipo_documento, nro_documento]
    );

    const [rows] = await pool.execute(
      `SELECT id, correo, nombre_completo, telefono, tipo_documento,
              nro_documento, rol, estado, correo_verificado_en,
              creado_en, actualizado_en
       FROM usuarios WHERE id = ?`,
      [id]
    );

    const user = rows[0];
    const token = createToken(user);

    return res.status(201).json({
      ok: true,
      message: 'Usuario registrado correctamente.',
      data: { user: publicUser(user), token }
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({
        ok: false,
        message: 'correo y contrasena son obligatorios.'
      });
    }

    const normalizedEmail = String(correo).trim().toLowerCase();
    const [rows] = await pool.execute(
      `SELECT id, correo, hash_contrasena, nombre_completo, telefono,
              tipo_documento, nro_documento, rol, estado,
              correo_verificado_en, creado_en, actualizado_en
       FROM usuarios WHERE correo = ? LIMIT 1`,
      [normalizedEmail]
    );

    const user = rows[0];
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: 'Correo o contraseña incorrectos.'
      });
    }

    if (String(user.estado).toUpperCase() !== 'ACTIVO') {
      return res.status(403).json({
        ok: false,
        message: 'La cuenta no está activa.'
      });
    }

    const validPassword = await bcrypt.compare(contrasena, user.hash_contrasena);
    if (!validPassword) {
      return res.status(401).json({
        ok: false,
        message: 'Correo o contraseña incorrectos.'
      });
    }

    const token = createToken(user);
    return res.json({
      ok: true,
      message: 'Inicio de sesión correcto.',
      data: { user: publicUser(user), token }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
