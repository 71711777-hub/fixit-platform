
import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Obtener técnicos y sus especialidades para el catálogo público
router.get('/', async (_req, res) => {
  try {
    const [tecnicos] = await pool.query(`
      SELECT
        u.id,
        u.nombre_completo AS nombre,
        u.telefono,
        p.biografia,
        p.anios_experiencia,
        p.estado_verificacion,
        p.tarifa_hora_min,
        p.tarifa_hora_max,
        p.calificacion_prom AS calificacion,
        p.nro_reseñas AS resenas,
        p.acepta_reservas
      FROM usuarios u
      INNER JOIN perfiles_tecnico p
        ON p.usuario_id = u.id
      WHERE u.rol = 'TECNICO'
        AND u.estado = 'ACTIVO'
      ORDER BY p.calificacion_prom DESC, p.nro_reseñas DESC
    `);

    if (tecnicos.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }

    const ids = tecnicos.map((tecnico) => tecnico.id);
    const placeholders = ids.map(() => '?').join(', ');

    const [especialidades] = await pool.query(
      `
        SELECT
          te.tecnico_id,
          e.nombre
        FROM tecnico_especialidades te
        INNER JOIN especialidades e
          ON e.id = te.especialidad_id
        WHERE te.tecnico_id IN (${placeholders})
        ORDER BY e.nombre
      `,
      ids
    );

    const [categorias] = await pool.query(
      `
        SELECT
          tc.tecnico_id,
          c.nombre
        FROM tecnico_categorias tc
        INNER JOIN categorias_problema c
          ON c.id = tc.categoria_id
        WHERE tc.tecnico_id IN (${placeholders})
        ORDER BY c.nombre
      `,
      ids
    );

    const [equipos] = await pool.query(
      `
        SELECT
          tt.tecnico_id,
          t.codigo,
          t.nombre
        FROM tecnico_tipos_equipo tt
        INNER JOIN tipos_equipo t
          ON t.id = tt.tipo_equipo_id
        WHERE tt.tecnico_id IN (${placeholders})
        ORDER BY t.nombre
      `,
      ids
    );

    const [modalidades] = await pool.query(
      `
        SELECT
          tm.tecnico_id,
          m.codigo,
          m.nombre
        FROM tecnico_modalidades tm
        INNER JOIN modalidades_servicio m
          ON m.id = tm.modalidad_id
        WHERE tm.tecnico_id IN (${placeholders})
        ORDER BY m.nombre
      `,
      ids
    );

    const agrupar = (filas, idCampo, transformar) => {
      const resultado = {};

      for (const fila of filas) {
        if (!resultado[fila[idCampo]]) {
          resultado[fila[idCampo]] = [];
        }

        resultado[fila[idCampo]].push(transformar(fila));
      }

      return resultado;
    };

    const especialidadesPorTecnico = agrupar(
      especialidades,
      'tecnico_id',
      (fila) => fila.nombre
    );

    const categoriasPorTecnico = agrupar(
      categorias,
      'tecnico_id',
      (fila) => fila.nombre
    );

    const equiposPorTecnico = agrupar(
      equipos,
      'tecnico_id',
      (fila) => ({
        codigo: fila.codigo,
        nombre: fila.nombre
      })
    );

    const modalidadesPorTecnico = agrupar(
      modalidades,
      'tecnico_id',
      (fila) => ({
        codigo: fila.codigo,
        nombre: fila.nombre
      })
    );

    const resultado = tecnicos.map((tecnico) => ({
      ...tecnico,
      calificacion: Number(tecnico.calificacion),
      resenas: Number(tecnico.resenas),
      tarifa_hora_min: tecnico.tarifa_hora_min === null
        ? null
        : Number(tecnico.tarifa_hora_min),
      tarifa_hora_max: tecnico.tarifa_hora_max === null
        ? null
        : Number(tecnico.tarifa_hora_max),
      especialidades: especialidadesPorTecnico[tecnico.id] || [],
      categorias: categoriasPorTecnico[tecnico.id] || [],
      equipos: equiposPorTecnico[tecnico.id] || [],
      modalidades: modalidadesPorTecnico[tecnico.id] || []
    }));

    return res.json({
      success: true,
      data: resultado
    });
  } catch (error) {
    console.error('Error al obtener técnicos:', error);

    return res.status(500).json({
      success: false,
      message: 'No se pudo cargar el catálogo de técnicos'
    });
  }
});

export default router;
