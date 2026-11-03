import express from 'express';
import { randomUUID } from 'node:crypto';
import { pool } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Obtener preguntas activas con sus opciones
router.get('/preguntas', authenticateToken, async (req, res) => {
  try {
    const [preguntas] = await pool.query(`
      SELECT id, texto, nro_orden
      FROM preguntas_triaje
      WHERE activa = 1
      ORDER BY nro_orden
    `);

    const [opciones] = await pool.query(`
      SELECT id, pregunta_id, texto, siguiente_pregunta_id,
             categoria_id, peso
      FROM opciones_triaje
      ORDER BY peso
    `);

    const preguntasConOpciones = preguntas.map((pregunta) => ({
      id: pregunta.id,
      titulo: pregunta.texto,
      opciones: opciones
        .filter((opcion) => opcion.pregunta_id === pregunta.id)
        .map((opcion) => ({
          id: opcion.id,
          texto: opcion.texto,
          siguiente_pregunta_id: opcion.siguiente_pregunta_id,
          categoria_id: opcion.categoria_id,
          peso: opcion.peso
        }))
    }));

    res.json({
      success: true,
      data: preguntasConOpciones
    });
  } catch (error) {
    console.error('Error al obtener preguntas:', error);
    res.status(500).json({
      success: false,
      message: 'No se pudieron cargar las preguntas del triaje'
    });
  }
});

// Guardar respuestas y generar resultado preliminar
router.post('/respuestas', authenticateToken, async (req, res) => {
  const { incidencia_id, respuestas } = req.body;

  if (
    typeof incidencia_id !== 'string' ||
    !Array.isArray(respuestas) ||
    respuestas.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: 'Debes indicar la incidencia y las respuestas del triaje'
    });
  }

  const conexion = await pool.getConnection();

  try {
    await conexion.beginTransaction();

    // Verificar que la incidencia pertenece al usuario autenticado
    const [incidencias] = await conexion.query(
      `SELECT id
       FROM incidencias
       WHERE id = ? AND cliente_id = ?
       FOR UPDATE`,
      [incidencia_id, req.user.sub]
    );

    if (incidencias.length === 0) {
      await conexion.rollback();
      return res.status(404).json({
        success: false,
        message: 'No se encontró la incidencia para este usuario'
      });
    }

    // Comprobar preguntas activas y opciones válidas
    const [preguntas] = await conexion.query(`
      SELECT id
      FROM preguntas_triaje
      WHERE activa = 1
    `);

    const [opciones] = await conexion.query(`
      SELECT o.id, o.pregunta_id, o.categoria_id
      FROM opciones_triaje o
      INNER JOIN preguntas_triaje p ON p.id = o.pregunta_id
      WHERE p.activa = 1
    `);

    const mapaOpciones = new Map(
      opciones.map((opcion) => [opcion.id, opcion])
    );

    const mapaRespuestas = new Map();

    for (const respuesta of respuestas) {
      if (
        !respuesta ||
        typeof respuesta.pregunta_id !== 'string' ||
        typeof respuesta.opcion_id !== 'string'
      ) {
        await conexion.rollback();
        return res.status(400).json({
          success: false,
          message: 'Hay respuestas con un formato inválido'
        });
      }

      const opcion = mapaOpciones.get(respuesta.opcion_id);

      if (!opcion || opcion.pregunta_id !== respuesta.pregunta_id) {
        await conexion.rollback();
        return res.status(400).json({
          success: false,
          message: 'Una de las opciones no corresponde a su pregunta'
        });
      }

      if (mapaRespuestas.has(respuesta.pregunta_id)) {
        await conexion.rollback();
        return res.status(400).json({
          success: false,
          message: 'No puedes responder dos veces la misma pregunta'
        });
      }

      mapaRespuestas.set(respuesta.pregunta_id, opcion);
    }

    if (
      mapaRespuestas.size !== preguntas.length ||
      preguntas.some((pregunta) => !mapaRespuestas.has(pregunta.id))
    ) {
      await conexion.rollback();
      return res.status(400).json({
        success: false,
        message: 'Debes responder todas las preguntas activas'
      });
    }

    // Contar categorías elegidas y calcular una categoría preliminar.
    const conteoCategorias = new Map();

    for (const opcion of mapaRespuestas.values()) {
      if (opcion.categoria_id) {
        conteoCategorias.set(
          opcion.categoria_id,
          (conteoCategorias.get(opcion.categoria_id) || 0) + 1
        );
      }
    }

    const categoriaId = [...conteoCategorias.entries()]
      .sort((a, b) => b[1] - a[1])[0]?.[0];

    if (!categoriaId) {
      await conexion.rollback();
      return res.status(400).json({
        success: false,
        message: 'No se pudo determinar una categoría preliminar'
      });
    }

    const [categorias] = await conexion.query(
      `SELECT id, nombre
       FROM categorias_problema
       WHERE id = ?`,
      [categoriaId]
    );

    if (categorias.length === 0) {
      await conexion.rollback();
      return res.status(400).json({
        success: false,
        message: 'La categoría del diagnóstico no existe'
      });
    }

    // Regla inicial de estimación; deberá calibrarse con precios reales.
    const precios = {
      HARDWARE: [90, 150],
      SOFTWARE: [60, 120],
      REDES: [50, 100],
      SIN_CLASIFICAR: [50, 150]
    };

    const [categoriaCodigo] = await conexion.query(
      `SELECT codigo
       FROM categorias_problema
       WHERE id = ?`,
      [categoriaId]
    );

    const [precioMin, precioMax] =
      precios[categoriaCodigo[0]?.codigo] || [50, 150];

    const recomendacion =
      `El triaje preliminar apunta a la categoría ${categorias[0].nombre}. ` +
      'Un técnico deberá evaluar el equipo para confirmar la causa y el costo de reparación.';

    // Guardar las respuestas seleccionadas.
    // Si se vuelve a procesar la incidencia, se reemplazan sus respuestas.
    await conexion.query(
      'DELETE FROM respuestas_triaje WHERE incidencia_id = ?',
      [incidencia_id]
    );

    for (const [preguntaId, opcion] of mapaRespuestas) {
      await conexion.query(
        `INSERT INTO respuestas_triaje
          (id, incidencia_id, pregunta_id, opcion_id, respondida_en)
         VALUES (?, ?, ?, ?, NOW(3))`,
        [randomUUID(), incidencia_id, preguntaId, opcion.id]
      );
    }

    // La tabla permite un solo resultado por incidencia.
    await conexion.query(
      `INSERT INTO resultados_triaje
        (id, incidencia_id, categoria_id, recomendacion,
         precio_min, precio_max, version_reglas)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         categoria_id = VALUES(categoria_id),
         recomendacion = VALUES(recomendacion),
         precio_min = VALUES(precio_min),
         precio_max = VALUES(precio_max),
         version_reglas = VALUES(version_reglas),
         creado_en = NOW(3)`,
      [
        randomUUID(),
        incidencia_id,
        categoriaId,
        recomendacion,
        precioMin,
        precioMax,
        'reglas-iniciales-v1'
      ]
    );

    const [resultados] = await conexion.query(
      `SELECT
         r.id,
         r.incidencia_id,
         r.categoria_id,
         c.nombre AS categoria_nombre,
         r.recomendacion,
         r.precio_min,
         r.precio_max
       FROM resultados_triaje r
       INNER JOIN categorias_problema c ON c.id = r.categoria_id
       WHERE r.incidencia_id = ?`,
      [incidencia_id]
    );

    await conexion.commit();

    return res.json({
      success: true,
      message: 'Triaje guardado correctamente',
      data: resultados[0]
    });
  } catch (error) {
    await conexion.rollback();
    console.error('Error al guardar el triaje:', error);

    return res.status(500).json({
      success: false,
      message: 'No se pudo guardar el triaje'
    });
  } finally {
    conexion.release();
  }
});

export default router;
