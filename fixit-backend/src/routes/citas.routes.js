
import { Router } from 'express';
import { pool } from '../db.js';
import { randomUUID } from 'node:crypto';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Obtener horarios semanales de un técnico
router.get('/disponibilidad/:tecnicoId', async (req, res, next) => {
  try {
    const { tecnicoId } = req.params;

    const [tecnicos] = await pool.execute(
      `SELECT usuario_id
       FROM perfiles_tecnico
       WHERE usuario_id = ?
         AND acepta_reservas = 1`,
      [tecnicoId]
    );

    if (tecnicos.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'Técnico no encontrado o no disponible para reservas.'
      });
    }

    const [horarios] = await pool.execute(
      `SELECT dia_semana, hora_inicio, hora_fin
       FROM reglas_disponibilidad
       WHERE tecnico_id = ?
       ORDER BY dia_semana, hora_inicio`,
      [tecnicoId]
    );

    return res.json({
      ok: true,
      data: horarios
    });
  } catch (error) {
    next(error);
  }
});


 // Obtener modalidades disponibles para un técnico
router.get('/modalidades/:tecnicoId', async (req, res, next) => {
  try {
    const { tecnicoId } = req.params;

    const [modalidades] = await pool.execute(
      `SELECT
         m.id,
         m.codigo,
         m.nombre
       FROM tecnico_modalidades tm
       INNER JOIN modalidades_servicio m
         ON m.id = tm.modalidad_id
       INNER JOIN perfiles_tecnico p
         ON p.usuario_id = tm.tecnico_id
       INNER JOIN usuarios u
         ON u.id = p.usuario_id
       WHERE tm.tecnico_id = ?
         AND p.acepta_reservas = 1
         AND u.estado = 'ACTIVO'
       ORDER BY m.nombre`,
      [tecnicoId]
    );

    return res.json({
      ok: true,
      data: modalidades
    });
  } catch (error) {
    next(error);
  }
});

router.get('/horarios/:tecnicoId', async (req, res, next) => {
  try {
    const { tecnicoId } = req.params;
    const { fecha } = req.query;

    // Validar fecha YYYY-MM-DD
    if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return res.status(400).json({
        ok: false,
        message: 'Debes proporcionar una fecha válida (YYYY-MM-DD).'
      });
    }

    const [anio, mes, dia] = fecha.split('-').map(Number);
    const fechaUTC = new Date(Date.UTC(anio, mes - 1, dia));

    if (
      fechaUTC.getUTCFullYear() !== anio ||
      fechaUTC.getUTCMonth() !== mes - 1 ||
      fechaUTC.getUTCDate() !== dia
    ) {
      return res.status(400).json({
        ok: false,
        message: 'La fecha indicada no existe.'
      });
    }

    // Convención: lunes = 1, domingo = 7
    const diaSemana = fechaUTC.getUTCDay() || 7;

    // Consultar horario habitual
    const [reglas] = await pool.execute(
      `SELECT hora_inicio, hora_fin
       FROM reglas_disponibilidad
       WHERE tecnico_id = ? AND dia_semana = ?
       ORDER BY hora_inicio`,
      [tecnicoId, diaSemana]
    );

    // Consultar excepciones de disponibilidad
    const [excepciones] = await pool.execute(
      `SELECT hora_inicio, hora_fin, disponible
       FROM excepciones_disponibilidad
       WHERE tecnico_id = ? AND fecha = ?`,
      [tecnicoId, fecha]
    );

    // Consultar citas que ocupan el día
    const [citas] = await pool.execute(
      `SELECT inicia_en, termina_en
       FROM citas
       WHERE tecnico_id = ?
         AND inicia_en < DATE_ADD(?, INTERVAL 1 DAY)
         AND termina_en > ?
         AND estado NOT IN ('CANCELADA', 'RECHAZADA')`,
      [tecnicoId, fecha, fecha]
    );

    const minutos = (hora) => {
      const [h, m] = String(hora).split(':').map(Number);
      return h * 60 + m;
    };

    const duracion = 60;
    const horarios = [];

    for (const regla of reglas) {
      const inicio = minutos(regla.hora_inicio);
      const fin = minutos(regla.hora_fin);

      for (let minuto = inicio; minuto + duracion <= fin; minuto += 60) {
        const hora = `${String(Math.floor(minuto / 60)).padStart(2, '0')}:${String(minuto % 60).padStart(2, '0')}`;

        const inicioCandidato = `${fecha} ${hora}:00`;
        const finMinutos = minuto + duracion;
        const horaFin = `${String(Math.floor(finMinutos / 60)).padStart(2, '0')}:${String(finMinutos % 60).padStart(2, '0')}`;
        const finCandidato = `${fecha} ${horaFin}:00`;

        // Se comparan fechas como valores UTC únicamente para
        // preservar los horarios locales guardados en DATETIME.
        const aFecha = (valor) => {
          if (valor instanceof Date) {
            return valor.getTime();
          }
          return Date.parse(String(valor).replace(' ', 'T') + 'Z');
        };

        const inicioMs = aFecha(inicioCandidato);
        const finMs = aFecha(finCandidato);

        const ocupado = citas.some((cita) =>
          inicioMs < aFecha(cita.termina_en) &&
          finMs > aFecha(cita.inicia_en)
        );

        const bloqueado = excepciones.some((ex) => {
          if (Number(ex.disponible) !== 0) return false;

          if (!ex.hora_inicio || !ex.hora_fin) return true;

          return minuto < minutos(ex.hora_fin) &&
            minuto + duracion > minutos(ex.hora_inicio);
        });

        if (!ocupado && !bloqueado) {
          horarios.push(hora);
        }
      }
    }

    return res.json({
      ok: true,
      data: {
        tecnico_id: tecnicoId,
        fecha,
        duracion_minutos: duracion,
        horarios: [...new Set(horarios)].sort()
      }
    });
  } catch (error) {
    next(error);
  }
});


router.post('/', authenticateToken, async (req, res, next) => {
  let connection;

  try {
    const {
      incidencia_id,
      tecnico_id,
      modalidad_id,
      direccion_id,
      fecha,
      hora
    } = req.body;

    const cliente_id = req.user.sub;

    const fechaValida = /^\d{4}-\d{2}-\d{2}$/.test(fecha || '');
    const horaValida = /^([01]\d|2[0-3]):[0-5]\d$/.test(hora || '');

    if (!incidencia_id || !tecnico_id || !modalidad_id ||
        !fechaValida || !horaValida) {
      return res.status(400).json({
        ok: false,
        message: 'Los datos de la reserva están incompletos o son inválidos.'
      });
    }

    const [anio, mes, dia] = fecha.split('-').map(Number);
    const fechaUTC = new Date(Date.UTC(anio, mes - 1, dia));

    if (
      fechaUTC.getUTCFullYear() !== anio ||
      fechaUTC.getUTCMonth() !== mes - 1 ||
      fechaUTC.getUTCDate() !== dia
    ) {
      return res.status(400).json({
        ok: false,
        message: 'La fecha indicada no existe.'
      });
    }

    const diaSemana = fechaUTC.getUTCDay() || 7;
    const [h, m] = hora.split(':').map(Number);
    const inicioMinutos = h * 60 + m;
    const finMinutos = inicioMinutos + 60;

    const formatoHora = (total) =>
      `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}:00`;

    const inicia_en = `${fecha} ${formatoHora(inicioMinutos)}`;
    const termina_en = `${fecha} ${formatoHora(finMinutos)}`;

    // Evitar reservar en el pasado, usando la hora de Perú.
    const ahoraPeru = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'America/Lima',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).format(new Date()).replace(',', '');

    if (inicia_en.slice(0, 16) <= ahoraPeru.slice(0, 16)) {
      return res.status(400).json({
        ok: false,
        message: 'Debes seleccionar una fecha y hora futura.'
      });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Bloquear al técnico para serializar las reservas.
    const [tecnicos] = await connection.execute(
      `SELECT p.usuario_id, p.tarifa_hora_min, p.tarifa_hora_max
       FROM perfiles_tecnico p
       INNER JOIN usuarios u ON u.id = p.usuario_id
       WHERE p.usuario_id = ?
         AND p.acepta_reservas = 1
         AND u.estado = 'ACTIVO'
       FOR UPDATE`,
      [tecnico_id]
    );

    if (!tecnicos.length) {
      await connection.rollback();
      return res.status(404).json({
        ok: false,
        message: 'El técnico no está disponible para reservas.'
      });
    }

    const [incidencias] = await connection.execute(
      `SELECT id
       FROM incidencias
       WHERE id = ? AND cliente_id = ?`,
      [incidencia_id, cliente_id]
    );

    if (!incidencias.length) {
      await connection.rollback();
      return res.status(403).json({
        ok: false,
        message: 'La incidencia no pertenece al cliente.'
      });
    }

    const [modalidades] = await connection.execute(
      `SELECT m.codigo
       FROM tecnico_modalidades tm
       INNER JOIN modalidades_servicio m
         ON m.id = tm.modalidad_id
       WHERE tm.tecnico_id = ? AND tm.modalidad_id = ?`,
      [tecnico_id, modalidad_id]
    );

    if (!modalidades.length) {
      await connection.rollback();
      return res.status(400).json({
        ok: false,
        message: 'El técnico no ofrece esa modalidad.'
      });
    }

    let direccionFinal = null;

    if (modalidades[0].codigo === 'DOMICILIO') {
      if (!direccion_id) {
        await connection.rollback();
        return res.status(400).json({
          ok: false,
          message: 'Debes seleccionar una dirección.'
        });
      }

      const [direcciones] = await connection.execute(
        `SELECT id FROM direcciones
         WHERE id = ? AND usuario_id = ?`,
        [direccion_id, cliente_id]
      );

      if (!direcciones.length) {
        await connection.rollback();
        return res.status(400).json({
          ok: false,
          message: 'La dirección no pertenece al cliente.'
        });
      }

      direccionFinal = direccion_id;
    }

    // Verificar horario semanal.
    const [reglas] = await connection.execute(
      `SELECT hora_inicio, hora_fin
       FROM reglas_disponibilidad
       WHERE tecnico_id = ? AND dia_semana = ?`,
      [tecnico_id, diaSemana]
    );

    const aMinutos = (valor) => {
      const [horas, minutos] = String(valor).split(':').map(Number);
      return horas * 60 + minutos;
    };

    const dentroHorario = reglas.some((regla) =>
      inicioMinutos >= aMinutos(regla.hora_inicio) &&
      finMinutos <= aMinutos(regla.hora_fin)
    );

    if (!dentroHorario) {
      await connection.rollback();
      return res.status(409).json({
        ok: false,
        message: 'El horario está fuera de la disponibilidad del técnico.'
      });
    }

    // Verificar bloqueos excepcionales.
    const [excepciones] = await connection.execute(
      `SELECT hora_inicio, hora_fin
       FROM excepciones_disponibilidad
       WHERE tecnico_id = ?
         AND fecha = ?
         AND disponible = 0`,
      [tecnico_id, fecha]
    );

    const bloqueado = excepciones.some((ex) =>
      !ex.hora_inicio || !ex.hora_fin ||
      (
        inicioMinutos < aMinutos(ex.hora_fin) &&
        finMinutos > aMinutos(ex.hora_inicio)
      )
    );

    if (bloqueado) {
      await connection.rollback();
      return res.status(409).json({
        ok: false,
        message: 'El técnico no está disponible en ese horario.'
      });
    }

    // Evitar citas superpuestas.
    const [ocupadas] = await connection.execute(
      `SELECT id FROM citas
       WHERE tecnico_id = ?
         AND inicia_en < ?
         AND termina_en > ?
         AND estado NOT IN ('CANCELADA', 'RECHAZADA')
       LIMIT 1`,
      [tecnico_id, termina_en, inicia_en]
    );

    if (ocupadas.length) {
      await connection.rollback();
      return res.status(409).json({
        ok: false,
        message: 'Ese horario ya fue reservado.'
      });
    }

    const precioMin = tecnicos[0].tarifa_hora_min;
    const precioMax = tecnicos[0].tarifa_hora_max;

    if (
      precioMin == null ||
      precioMax == null ||
      Number(precioMin) < 0 ||
      Number(precioMax) < Number(precioMin)
    ) {
      await connection.rollback();
      return res.status(400).json({
        ok: false,
        message: 'El técnico no tiene tarifas válidas configuradas.'
      });
    }

    const id = randomUUID();

    await connection.execute(
      `INSERT INTO citas (
        id, incidencia_id, cliente_id, tecnico_id,
        modalidad_id, direccion_id, inicia_en, termina_en,
        estado, precio_est_min, precio_est_max
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, incidencia_id, cliente_id, tecnico_id,
        modalidad_id, direccionFinal, inicia_en, termina_en,
        'PENDIENTE', precioMin, precioMax
      ]
    );

    await connection.execute(
      `INSERT INTO historial_estado_cita (
        id, cita_id, estado_anterior, estado_nuevo,
        cambiado_por, cambiado_en
       ) VALUES (?, ?, NULL, 'PENDIENTE', ?, NOW(3))`,
      [randomUUID(), id, cliente_id]
    );

    await connection.commit();

    return res.status(201).json({
      ok: true,
      message: 'Reserva registrada correctamente.',
      data: {
        id,
        incidencia_id,
        tecnico_id,
        modalidad_id,
        inicia_en,
        termina_en,
        estado: 'PENDIENTE',
        precio_est_min: precioMin,
        precio_est_max: precioMax
      }
    });

  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('Error al revertir reserva:', rollbackError);
      }
    }
    next(error);
  } finally {
    if (connection) connection.release();
  }
});


// Obtener las reservas del cliente autenticado
router.get('/mis-reservas', authenticateToken, async (req, res, next) => {
  try {
    const clienteId = req.user.sub;

    const [reservas] = await pool.execute(
      `SELECT
         c.id,
         c.incidencia_id,
         i.descripcion AS incidencia_descripcion,
         c.tecnico_id,
         u.nombre_completo AS tecnico_nombre,
         m.nombre AS modalidad,
         m.codigo AS modalidad_codigo,
         c.inicia_en,
         c.termina_en,
         c.estado,
         c.precio_est_min,
         c.precio_est_max,
         c.creado_en
       FROM citas c
       INNER JOIN incidencias i
         ON i.id = c.incidencia_id
       INNER JOIN usuarios u
         ON u.id = c.tecnico_id
       INNER JOIN modalidades_servicio m
         ON m.id = c.modalidad_id
       WHERE c.cliente_id = ?
       ORDER BY c.inicia_en DESC`,
      [clienteId]
    );

    return res.json({
      ok: true,
      data: reservas
    });
  } catch (error) {
    next(error);
  }
});


export default router;
