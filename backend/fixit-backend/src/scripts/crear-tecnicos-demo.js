
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { pool } from '../db.js';

const tecnicos = [
  {
    nombre: 'Juan Pérez',
    correo: 'juan.perez.demo@fixit.test',
    telefono: '900000001',
    password: 'DemoFixIT2026!',
    biografia: 'Especialista de demostración en hardware y mantenimiento de computadoras.',
    experiencia: 5,
    tarifaMin: 90,
    tarifaMax: 150,
    calificacion: 4.8,
    resenas: 24,
    especialidades: ['Hardware y mantenimiento de PC'],
    categorias: ['Hardware'],
    equipos: ['PC_ESCRITORIO', 'LAPTOP'],
    modalidades: ['DOMICILIO', 'REMOTO'],
  },
  {
    nombre: 'Carlos López',
    correo: 'carlos.lopez.demo@fixit.test',
    telefono: '900000002',
    password: 'DemoFixIT2026!',
    biografia: 'Técnico de demostración especializado en software y sistemas operativos.',
    experiencia: 4,
    tarifaMin: 60,
    tarifaMax: 120,
    calificacion: 4.7,
    resenas: 19,
    especialidades: ['Software y sistemas operativos'],
    categorias: ['Software'],
    equipos: ['LAPTOP', 'PC_ESCRITORIO', 'TABLET'],
    modalidades: ['REMOTO', 'DOMICILIO'],
  },
  {
    nombre: 'María Torres',
    correo: 'maria.torres.demo@fixit.test',
    telefono: '900000003',
    password: 'DemoFixIT2026!',
    biografia: 'Técnica de demostración especializada en redes y conectividad.',
    experiencia: 6,
    tarifaMin: 50,
    tarifaMax: 100,
    calificacion: 4.9,
    resenas: 42,
    especialidades: ['Redes y conectividad'],
    categorias: ['Redes'],
    equipos: ['PC_ESCRITORIO', 'LAPTOP', 'SMARTPHONE'],
    modalidades: ['DOMICILIO', 'REMOTO'],
  },
];

async function obtenerId(tabla, columna, valor) {
  // Los nombres de tabla y columna proceden exclusivamente
  // de las llamadas internas definidas en este script.
  const [filas] = await pool.execute(
    `SELECT id FROM ${tabla} WHERE ${columna} = ? LIMIT 1`,
    [valor]
  );

  if (filas.length === 0) {
    throw new Error(`No se encontró ${valor} en ${tabla}.${columna}`);
  }

  return filas[0].id;
}

async function crearTecnicos() {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    for (const tecnico of tecnicos) {
      const [existentes] = await connection.execute(
        'SELECT id FROM usuarios WHERE correo = ? LIMIT 1',
        [tecnico.correo]
      );

      if (existentes.length > 0) {
        console.log(`Ya existe ${tecnico.correo}; se omite.`);
        continue;
      }

      const usuarioId = randomUUID();
      const hash = await bcrypt.hash(tecnico.password, 12);

      await connection.execute(
        `INSERT INTO usuarios
          (id, correo, hash_contrasena, nombre_completo, telefono,
           rol, estado)
         VALUES (?, ?, ?, ?, ?, 'TECNICO', 'ACTIVO')`,
        [
          usuarioId,
          tecnico.correo,
          hash,
          tecnico.nombre,
          tecnico.telefono,
        ]
      );

      await connection.execute(
        `INSERT INTO perfiles_tecnico
          (usuario_id, biografia, anios_experiencia, estado_verificacion,
           tarifa_hora_min, tarifa_hora_max, tasa_comision,
           calificacion_prom, nro_reseñas, acepta_reservas)
         VALUES (?, ?, ?, 'PENDIENTE', ?, ?, 10.00, ?, ?, 1)`,
        [
          usuarioId,
          tecnico.biografia,
          tecnico.experiencia,
          tecnico.tarifaMin,
          tecnico.tarifaMax,
          tecnico.calificacion,
          tecnico.resenas,
        ]
      );

      for (const nombre of tecnico.especialidades) {
        const especialidadId = await obtenerId(
          'especialidades', 'nombre', nombre
        );

        await connection.execute(
          `INSERT INTO tecnico_especialidades
            (tecnico_id, especialidad_id) VALUES (?, ?)`,
          [usuarioId, especialidadId]
        );
      }

      for (const nombre of tecnico.categorias) {
        const categoriaId = await obtenerId(
          'categorias_problema', 'nombre', nombre
        );

        await connection.execute(
          `INSERT INTO tecnico_categorias
            (tecnico_id, categoria_id) VALUES (?, ?)`,
          [usuarioId, categoriaId]
        );
      }

      for (const codigo of tecnico.equipos) {
        const tipoEquipoId = await obtenerId(
          'tipos_equipo', 'codigo', codigo
        );

        await connection.execute(
          `INSERT INTO tecnico_tipos_equipo
            (tecnico_id, tipo_equipo_id) VALUES (?, ?)`,
          [usuarioId, tipoEquipoId]
        );
      }

      for (const codigo of tecnico.modalidades) {
        const modalidadId = await obtenerId(
          'modalidades_servicio', 'codigo', codigo
        );

        await connection.execute(
          `INSERT INTO tecnico_modalidades
            (tecnico_id, modalidad_id) VALUES (?, ?)`,
          [usuarioId, modalidadId]
        );
      }

      console.log(`Creado: ${tecnico.nombre} (${tecnico.correo})`);
    }

    await connection.commit();
    console.log('\nProceso terminado.');
  } catch (error) {
    await connection.rollback();
    console.error('Error. Se revirtieron los cambios:', error.message);
    throw error;
  } finally {
    connection.release();
    await pool.end();
  }
}

crearTecnicos().catch(() => {
  process.exitCode = 1;
});
