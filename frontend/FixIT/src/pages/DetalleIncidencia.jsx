
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { obtenerDetalleIncidencia } from '../services/api'
import './DetalleIncidencia.css'

function DetalleIncidencia() {
  const { id } = useParams()

  const [incidencia, setIncidencia] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargarDetalle() {
      setCargando(true)
      setError('')

      try {
        const datos = await obtenerDetalleIncidencia(id)

        if (activo) {
          setIncidencia(datos)
        }
      } catch (err) {
        if (activo) {
          setError(
            err.message || 'No se pudo cargar la incidencia.'
          )
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    cargarDetalle()

    return () => {
      activo = false
    }
  }, [id])

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No disponible'

    const fechaValida = new Date(fecha)

    if (Number.isNaN(fechaValida.getTime())) {
      return 'No disponible'
    }

    return fechaValida.toLocaleString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  if (cargando) {
    return (
      <main className="detalle-incidencia">
        <div className="detalle-mensaje">
          <div className="detalle-cargando-icono">↻</div>
          <h1>Cargando incidencia</h1>
          <p>Estamos recuperando los detalles de tu solicitud.</p>
        </div>
      </main>
    )
  }

  if (error || !incidencia) {
    return (
      <main className="detalle-incidencia">
        <div className="detalle-mensaje">
          <div className="detalle-cargando-icono">!</div>
          <h1>No encontramos la incidencia</h1>
          <p>
            {error ||
              'La solicitud no existe o no tienes permiso para consultarla.'}
          </p>
          <Link
            to="/dashboard-cliente"
            className="detalle-boton-principal"
          >
            Volver al dashboard
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="detalle-incidencia">
      <Link
        to="/dashboard-cliente"
        className="detalle-volver"
      >
        ← Volver a mis incidencias
      </Link>

      <section className="detalle-encabezado">
        <div>
          <span className="detalle-etiqueta">
            DETALLE DE SOLICITUD
          </span>

          <h1>Detalle de tu incidencia</h1>

          <p>
            Consulta la información registrada de tu solicitud de soporte.
          </p>
        </div>

        <span
          className={`detalle-estado estado-${obtenerClaseEstado(incidencia.estado)}`}
        >
          {formatearEstado(incidencia.estado)}
        </span>
      </section>

      <section className="detalle-tarjeta">
        <div className="detalle-tarjeta-titulo">
          <div className="detalle-icono">▤</div>
          <div>
            <h2>Información del problema</h2>
            <p>Datos que registraste al crear la solicitud.</p>
          </div>
        </div>

        <div className="detalle-datos">
          <div className="detalle-campo">
            <span>Tipo de equipo</span>
            <strong>
              {incidencia.tipo_equipo || 'No especificado'}
            </strong>
          </div>

          <div className="detalle-campo">
            <span>Categoría</span>
            <strong>
              {incidencia.categoria || 'Sin categoría'}
            </strong>
          </div>

          <div className="detalle-campo detalle-campo-completo">
            <span>Descripción del problema</span>
            <p className="detalle-descripcion">
              {incidencia.descripcion}
            </p>
          </div>
        </div>
      </section>

      <section className="detalle-tarjeta">
        <div className="detalle-tarjeta-titulo">
          <div className="detalle-icono">◷</div>
          <div>
            <h2>Seguimiento de la solicitud</h2>
            <p>Fechas y estado actual de tu incidencia.</p>
          </div>
        </div>

        <div className="detalle-datos">
          <div className="detalle-campo">
            <span>Fecha de registro</span>
            <strong>
              {formatearFecha(incidencia.creado_en)}
            </strong>
          </div>

          <div className="detalle-campo">
            <span>Última actualización</span>
            <strong>
              {formatearFecha(incidencia.actualizado_en)}
            </strong>
          </div>

          <div className="detalle-campo detalle-campo-completo">
            <span>Identificador de la incidencia</span>
            <code className="detalle-id">{incidencia.id}</code>
          </div>
        </div>
      </section>

      <div className="detalle-pie">
        <p>
          ¿Necesitas revisar otra solicitud? Puedes regresar a tu historial.
        </p>

        <Link
          to="/dashboard-cliente"
          className="detalle-boton-principal"
        >
          Ir a mis incidencias
        </Link>
      </div>
    </main>
  )
}

export default DetalleIncidencia
