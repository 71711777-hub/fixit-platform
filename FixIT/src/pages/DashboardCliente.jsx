
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  obtenerUsuarioActual,
  obtenerMisIncidencias,
} from '../services/api'
import './DashboardCliente.css'

function DashboardCliente() {
  
  const [usuario, setUsuario] = useState(null)
  const [pestanaActiva, setPestanaActiva] = useState('incidencias')
  const [incidencias, setIncidencias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorIncidencias, setErrorIncidencias] = useState('')

  const [reservas, setReservas] = useState([])
  const [cargandoReservas, setCargandoReservas] = useState(true)
  const [errorReservas, setErrorReservas] = useState('')

  useEffect(() => {
    let activo = true

    async function cargarDashboard() {
      try {
        const resultadoUsuario = await obtenerUsuarioActual()

        if (activo) {
          const datosUsuario =
            resultadoUsuario?.data?.usuario ??
            resultadoUsuario?.data?.user ??
            resultadoUsuario?.data ??
            resultadoUsuario?.usuario ??
            resultadoUsuario

          setUsuario(datosUsuario)
        }
      } catch (error) {
        console.error('Error al obtener el usuario:', error)
      }

      try {
        const datosIncidencias = await obtenerMisIncidencias()

        if (activo) {
          setIncidencias(
            Array.isArray(datosIncidencias) ? datosIncidencias : []
          )
        }
      } catch (error) {
        console.error('Error al obtener incidencias:', error)

        if (activo) {
          setErrorIncidencias(
            'No se pudo cargar tu historial. Intenta actualizar la página.'
          )
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    async function cargarReservas() {
      try {
        const token = localStorage.getItem('fixit_token')

        if (!token) {
          throw new Error('Debes iniciar sesión para consultar tus reservas.')
        }

        const respuesta = await fetch(
          'http://localhost:3000/api/citas/mis-reservas',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const resultado = await respuesta.json()

        if (!respuesta.ok || resultado.ok !== true) {
          throw new Error(
            resultado.message || 'No se pudieron cargar las reservas.'
          )
        }

        if (activo) {
          setReservas(
            Array.isArray(resultado.data) ? resultado.data : []
          )
        }
      } catch (error) {
        console.error('Error al obtener reservas:', error)

        if (activo) {
          setErrorReservas('No se pudieron cargar tus reservas.')
        }
      } finally {
        if (activo) {
          setCargandoReservas(false)
        }
      }
    }

    cargarDashboard()
    cargarReservas()

    return () => {
      activo = false
    }
  }, [])

  const nombreUsuario =
    usuario?.nombre_completo ||
    usuario?.nombre ||
    usuario?.nombres ||
    'cliente'

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible'

    const fechaValida = new Date(fecha)

    if (Number.isNaN(fechaValida.getTime())) {
      return 'Fecha no disponible'
    }

    return fechaValida.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  // Para fechas de citas que llegan desde MySQL:
  // "2026-11-13 11:00:00"
  // Evitamos convertirlas a Date para no alterar la zona horaria.
  const formatearFechaReserva = (fecha) => {
    if (!fecha || typeof fecha !== 'string') {
      return 'Fecha no disponible'
    }

    const partes = fecha.slice(0, 10).split('-')

    if (partes.length !== 3) {
      return 'Fecha no disponible'
    }

    const [anio, mes, dia] = partes

    return `${dia}/${mes}/${anio}`
  }

  const formatearHoraReserva = (fecha) => {
    if (!fecha || typeof fecha !== 'string') {
      return '--:--'
    }

    return fecha.slice(11, 16)
  }

  const formatearEstado = (estado) => {
    if (!estado) return 'Sin estado'

    return estado
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letra) => letra.toUpperCase())
  }

  const obtenerClaseEstado = (estado) => {
    const valor = (estado || '').toUpperCase()

    if (valor.includes('REPORT')) return 'reportada'

    if (
      valor.includes('EN_PROCESO') ||
      valor.includes('ASIGNAD') ||
      valor.includes('ATENCION') ||
      valor.includes('ATENCIÓN')
    ) {
      return 'proceso'
    }

    if (
      valor.includes('RESUELT') ||
      valor.includes('COMPLET') ||
      valor.includes('FINALIZ')
    ) {
      return 'resuelta'
    }

    if (valor.includes('CANCEL')) return 'cancelada'

    return 'pendiente'
  }

  return (
    <div className="dashboard-cliente">

      {/* BIENVENIDA */}
      <section className="dashboard-bienvenida">
        <div>
          <span className="dashboard-etiqueta">
            PANEL DEL CLIENTE
          </span>

          <h1>¡Bienvenido, {nombreUsuario}!</h1>

          <p>
            Administra tus solicitudes y encuentra el soporte técnico
            que necesitas.
          </p>
        </div>

        <Link
          to="/registrar-incidencia"
          className="dashboard-boton-principal"
        >
          + Reportar un problema
        </Link>
      </section>

      {/* ACCESOS RÁPIDOS */}
      <section className="dashboard-accesos">
        <Link
          to="/registrar-incidencia"
          className="dashboard-card"
        >
          <span className="dashboard-icono">＋</span>

          <h2>Reportar incidencia</h2>

          <p>
            Describe el problema de tu equipo y comienza el diagnóstico.
          </p>

          <span className="dashboard-enlace">
            Crear solicitud →
          </span>
        </Link>

        <Link
          to="/technicians"
          className="dashboard-card"
        >
          <span className="dashboard-icono">⌕</span>

          <h2>Buscar técnicos</h2>

          <p>
            Consulta los especialistas, sus servicios y sus tarifas.
          </p>

          <span className="dashboard-enlace">
            Ver técnicos →
          </span>
        </Link>

        <Link
          to="/mi-cuenta"
          className="dashboard-card"
        >
          <span className="dashboard-icono">♙</span>

          <h2>Mi perfil</h2>

          <p>
            Consulta y administra la información de tu cuenta.
          </p>

          <span className="dashboard-enlace">
            Ver mi perfil →
          </span>
        </Link>
      </section>
      <div className="dashboard-tabs" role="tablist" aria-label="Historial del cliente">
        <button
          type="button"
          role="tab"
          aria-selected={pestanaActiva === 'incidencias'}
          className={`dashboard-tab ${pestanaActiva === 'incidencias' ? 'activo' : ''}`}
          onClick={() => setPestanaActiva('incidencias')}
        >
          Mis incidencias
          <span>{incidencias.length}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={pestanaActiva === 'reservas'}
          className={`dashboard-tab ${pestanaActiva === 'reservas' ? 'activo' : ''}`}
          onClick={() => setPestanaActiva('reservas')}
        >
          Mis reservas
          <span>{reservas.length}</span>
        </button>
      </div>

      {/* MIS INCIDENCIAS */}
      {pestanaActiva === 'incidencias' && (
      <section className="dashboard-incidencias">
        <div className="dashboard-seccion-header">
          <div>
            <h2>Mis incidencias</h2>

            <p>
              Consulta el estado de tus solicitudes de soporte.
            </p>
          </div>

          {!cargando && (
            <span className="dashboard-proximamente">
              {incidencias.length}{' '}
              {incidencias.length === 1
                ? 'solicitud registrada'
                : 'solicitudes registradas'}
            </span>
          )}
        </div>

        {cargando ? (
          <div className="dashboard-vacio">
            <h3>Cargando tu información...</h3>

            <p>
              Estamos consultando tus datos y solicitudes.
            </p>
          </div>
        ) : errorIncidencias ? (
          <div className="dashboard-vacio">
            <h3>No pudimos cargar tus incidencias</h3>

            <p>{errorIncidencias}</p>

            <button
              type="button"
              className="dashboard-boton-secundario"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </div>
        ) : incidencias.length === 0 ? (
          <div className="dashboard-vacio">
            <div className="dashboard-vacio-icono">▤</div>

            <h3>Aún no tienes incidencias</h3>

            <p>
              Cuando reportes un problema, podrás consultar aquí
              tus solicitudes y sus estados.
            </p>

            <Link
              to="/registrar-incidencia"
              className="dashboard-boton-secundario"
            >
              Reportar mi primera incidencia
            </Link>
          </div>
        ) : (
          <div className="dashboard-lista-incidencias">
            {incidencias.map((incidencia) => (
              <article
                className="dashboard-incidencia-item"
                key={incidencia.id}
              >
                <div className="dashboard-incidencia-info">
                  <h3>
                    {incidencia.tipo_equipo ||
                      'Equipo no especificado'}
                  </h3>

                  <p>
                    {incidencia.categoria || 'Sin categoría'}
                  </p>

                  <p>{incidencia.descripcion}</p>

                  <span className="dashboard-incidencia-fecha">
                    Registrada el{' '}
                    {formatearFecha(incidencia.creado_en)}
                  </span>
                </div>

                <div className="dashboard-incidencia-acciones">
                  <span
                    className={`dashboard-incidencia-estado estado-${obtenerClaseEstado(incidencia.estado)}`}
                  >
                    {formatearEstado(incidencia.estado)}
                  </span>

                  <Link
                    to={`/incidencias/${incidencia.id}`}
                    className="dashboard-enlace"
                  >
                    Ver detalle →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      )}
      {/* MIS RESERVAS - NUEVA SECCIÓN */}
      {pestanaActiva === 'reservas' && (
      <section className="dashboard-incidencias">
        <div className="dashboard-seccion-header">
          <div>
            <h2>Mis reservas</h2>

            <p>
              Consulta tus citas programadas con los técnicos.
            </p>
          </div>

          {!cargandoReservas && !errorReservas && (
            <span className="dashboard-proximamente">
              {reservas.length}{' '}
              {reservas.length === 1
                ? 'reserva registrada'
                : 'reservas registradas'}
            </span>
          )}
        </div>

        {cargandoReservas ? (
          <div className="dashboard-vacio">
            <h3>Cargando tus reservas...</h3>

            <p>
              Estamos consultando tus citas programadas.
            </p>
          </div>
        ) : errorReservas ? (
          <div className="dashboard-vacio">
            <h3>No pudimos cargar tus reservas</h3>

            <p>{errorReservas}</p>

            <button
              type="button"
              className="dashboard-boton-secundario"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </div>
        ) : reservas.length === 0 ? (
          <div className="dashboard-vacio">
            <div className="dashboard-vacio-icono">▤</div>

            <h3>Aún no tienes reservas</h3>

            <p>
              Busca un técnico y programa tu primera atención.
            </p>

            <Link
              to="/technicians"
              className="dashboard-boton-secundario"
            >
              Buscar técnicos
            </Link>
          </div>
        ) : (
          <div className="dashboard-lista-incidencias">
            {reservas.map((reserva) => (
              <article
                className="dashboard-incidencia-item"
                key={reserva.id}
              >
                <div className="dashboard-incidencia-info">
                  <h3>
                    {reserva.tecnico_nombre ||
                      'Técnico no disponible'}
                  </h3>

                  <p>
                    <strong>Incidencia:</strong>{' '}
                    {reserva.incidencia_descripcion ||
                      'Sin descripción'}
                  </p>

                  <p>
                    <strong>Modalidad:</strong>{' '}
                    {reserva.modalidad ||
                      'No especificada'}
                  </p>

                  <p>
                    <strong>Fecha:</strong>{' '}
                    {formatearFechaReserva(
                      reserva.inicia_en
                    )}
                  </p>

                  <p>
                    <strong>Horario:</strong>{' '}
                    {formatearHoraReserva(
                      reserva.inicia_en
                    )}
                    {' - '}
                    {formatearHoraReserva(
                      reserva.termina_en
                    )}
                  </p>

                  <p>
                    <strong>Precio estimado:</strong>{' '}
                    S/ {reserva.precio_est_min}
                    {' - '}
                    S/ {reserva.precio_est_max}
                  </p>
                </div>

                <div className="dashboard-incidencia-acciones">
                  <span
                    className={`dashboard-incidencia-estado estado-${obtenerClaseEstado(
                      reserva.estado
                    )}`}
                  >
                    {formatearEstado(reserva.estado)}
                  </span>

                  <Link
                    to={`/mis-reservas/${reserva.id}`}
                    className="dashboard-enlace"
                  >
                    Ver detalle →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      )}

    </div>
  )
}

export default DashboardCliente
