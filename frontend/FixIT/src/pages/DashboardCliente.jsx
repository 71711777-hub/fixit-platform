
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  obtenerUsuarioActual,
  obtenerMisIncidencias,
} from '../services/api'
import './DashboardCliente.css'

function DashboardCliente() {
  const [usuario, setUsuario] = useState(null)
  const [incidencias, setIncidencias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorIncidencias, setErrorIncidencias] = useState('')

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

    cargarDashboard()

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
      <section className="dashboard-bienvenida">
        <div>
          <span className="dashboard-etiqueta">PANEL DEL CLIENTE</span>

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
          <span className="dashboard-enlace">Crear solicitud →</span>
        </Link>

        <Link to="/technicians" className="dashboard-card">
          <span className="dashboard-icono">⌕</span>
          <h2>Buscar técnicos</h2>
          <p>
            Consulta los especialistas, sus servicios y sus tarifas.
          </p>
          <span className="dashboard-enlace">Ver técnicos →</span>
        </Link>

        <Link to="/mi-cuenta" className="dashboard-card">
          <span className="dashboard-icono">♙</span>
          <h2>Mi perfil</h2>
          <p>Consulta y administra la información de tu cuenta.</p>
          <span className="dashboard-enlace">Ver mi perfil →</span>
        </Link>
      </section>

      <section className="dashboard-incidencias">
        <div className="dashboard-seccion-header">
          <div>
            <h2>Mis incidencias</h2>
            <p>Consulta el estado de tus solicitudes de soporte.</p>
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
            <p>Estamos consultando tus datos y solicitudes.</p>
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
                    {incidencia.tipo_equipo || 'Equipo no especificado'}
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
    </div>
  )
}

export default DashboardCliente
