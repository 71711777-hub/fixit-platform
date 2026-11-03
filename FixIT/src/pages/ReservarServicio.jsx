import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './ReservarServicio.css'

function ReservarServicio() {
  const { tecnicoId } = useParams()
  const navigate = useNavigate()

  const [incidencias, setIncidencias] = useState([])
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState('')
  const [cargandoIncidencias, setCargandoIncidencias] = useState(true)
  const [errorIncidencias, setErrorIncidencias] = useState('')
  const [modalidades, setModalidades] = useState([])
  const [modalidadSeleccionada, setModalidadSeleccionada] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [fecha, setFecha] = useState('')
  const [horarios, setHorarios] = useState([])
  const [horaSeleccionada, setHoraSeleccionada] = useState('')
  const [cargandoHorarios, setCargandoHorarios] = useState(false)
  const [errorHorarios, setErrorHorarios] = useState('')
  const [guardandoReserva, setGuardandoReserva] = useState(false)
  const [errorReserva, setErrorReserva] = useState('')
  const [reservaCreada, setReservaCreada] = useState(null)

  useEffect(() => {
    const controlador = new AbortController()
    async function cargarModalidades() {
      try {
        setCargando(true)
        setError('')
        const respuesta = await fetch(
          `http://localhost:3000/api/citas/modalidades/${tecnicoId}`,
          { signal: controlador.signal }
        )
        const resultado = await respuesta.json()
        if (!respuesta.ok || !resultado.ok) {
          throw new Error(resultado.message || 'No se pudieron cargar las modalidades.')
        }
        if (!controlador.signal.aborted) setModalidades(resultado.data)
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message)
      } finally {
        if (!controlador.signal.aborted) setCargando(false)
      }
    }
    cargarModalidades()
    return () => controlador.abort()
  }, [tecnicoId])

  useEffect(() => {
    if (!fecha) {
      setHorarios([])
      setHoraSeleccionada('')
      setErrorHorarios('')
      return
    }
    const controlador = new AbortController()
    async function cargarHorarios() {
      try {
        setCargandoHorarios(true)
        setErrorHorarios('')
        setHorarios([])
        setHoraSeleccionada('')
        const respuesta = await fetch(
          `http://localhost:3000/api/citas/horarios/${tecnicoId}?fecha=${fecha}`,
          { signal: controlador.signal }
        )
        const resultado = await respuesta.json()
        if (!respuesta.ok || !resultado.ok) {
          throw new Error(resultado.message || 'No se pudieron cargar los horarios.')
        }
        if (!controlador.signal.aborted) setHorarios(resultado.data.horarios)
      } catch (err) {
        if (err.name !== 'AbortError') setErrorHorarios(err.message)
      } finally {
        if (!controlador.signal.aborted) setCargandoHorarios(false)
      }
    }
    cargarHorarios()
    return () => controlador.abort()
  }, [fecha, tecnicoId])

  useEffect(() => {
    const controlador = new AbortController()
    async function cargarIncidencias() {
      try {
        setCargandoIncidencias(true)
        setErrorIncidencias('')
        const token = localStorage.getItem('fixit_token')
        if (!token) throw new Error('Debes iniciar sesión para reservar un servicio.')
        const respuesta = await fetch(
          'http://localhost:3000/api/incidencias/mis-incidencias',
          { headers: { Authorization: `Bearer ${token}` }, signal: controlador.signal }
        )
        const resultado = await respuesta.json()
        if (!respuesta.ok || resultado.success !== true) {
          throw new Error(resultado.message || 'No se pudieron cargar tus incidencias.')
        }
        const datos = resultado.data
        if (!controlador.signal.aborted) {
          setIncidencias(
            Array.isArray(datos) ? datos :
            Array.isArray(datos?.incidencias) ? datos.incidencias : []
          )
        }
      } catch (err) {
        if (err.name !== 'AbortError') setErrorIncidencias(err.message)
      } finally {
        if (!controlador.signal.aborted) setCargandoIncidencias(false)
      }
    }
    cargarIncidencias()
    return () => controlador.abort()
  }, [])

  useEffect(() => {
    if (!reservaCreada) return
    const cerrarConEscape = (event) => {
      if (event.key === 'Escape') setReservaCreada(null)
    }
    document.addEventListener('keydown', cerrarConEscape)
    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', cerrarConEscape)
      document.body.style.overflow = overflowAnterior
    }
  }, [reservaCreada])

  const confirmarReserva = async () => {
    if (guardandoReserva || reservaCreada) return
    if (!incidenciaSeleccionada || !modalidadSeleccionada || !fecha || !horaSeleccionada) {
      setErrorReserva('Completa todos los datos de la reserva.')
      return
    }
    const modalidad = modalidades.find(item => item.id === modalidadSeleccionada)
    if (modalidad?.codigo === 'DOMICILIO') {
      setErrorReserva(
        'Las reservas a domicilio requieren seleccionar una dirección. Próximamente agregaremos esa opción.'
      )
      return
    }
    try {
      setGuardandoReserva(true)
      setErrorReserva('')
      const token = localStorage.getItem('fixit_token')
      if (!token) throw new Error('Debes iniciar sesión para reservar.')
      const respuesta = await fetch('http://localhost:3000/api/citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          incidencia_id: incidenciaSeleccionada,
          tecnico_id: tecnicoId,
          modalidad_id: modalidadSeleccionada,
          fecha,
          hora: horaSeleccionada
        })
      })
      const resultado = await respuesta.json()
      if (!respuesta.ok || resultado.ok !== true) {
        throw new Error(resultado.message || 'No se pudo registrar la reserva.')
      }
      setReservaCreada(resultado.data)
    } catch (err) {
      setErrorReserva(err.message)
    } finally {
      setGuardandoReserva(false)
    }
  }

  // Las fechas MySQL se presentan como texto para conservar la hora local.
  const fechaLegible = (valor) => {
    if (typeof valor !== 'string') return 'No disponible'
    const [anio, mes, dia] = valor.slice(0, 10).split('-')
    return anio && mes && dia ? `${dia}/${mes}/${anio}` : 'No disponible'
  }
  const horaLegible = (valor) =>
    typeof valor === 'string' && valor.length >= 16 ? valor.slice(11, 16) : '--:--'

  const incidenciaElegida = incidencias.find(item => item.id === incidenciaSeleccionada)
  const modalidadElegida = modalidades.find(item => item.id === modalidadSeleccionada)
  const inicio = reservaCreada?.inicia_en
  const fin = reservaCreada?.termina_en
  const fechaMinima = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString().slice(0, 10)

  return (
    <main className="reserva-pagina">
      <div className="reserva-contenedor">
        <button type="button" className="reserva-volver" onClick={() => navigate(-1)}>
          ← Volver al perfil
        </button>

        <header className="reserva-encabezado">
          <span className="reserva-etiqueta">FIXIT · AGENDA DE SERVICIOS</span>
          <h1>Reserva tu atención técnica</h1>
          <p>Selecciona tu incidencia, modalidad y el horario que prefieras.</p>
        </header>

        <div className="reserva-layout">
          <div className="reserva-formulario">
            <section className="reserva-panel">
              <div className="reserva-panel-titulo">
                <span className="reserva-paso">01</span>
                <div>
                  <h2>¿Qué problema necesitas resolver?</h2>
                  <p>Selecciona una incidencia que hayas registrado.</p>
                </div>
              </div>
              {cargandoIncidencias && <p className="reserva-ayuda">Cargando tus incidencias...</p>}
              {errorIncidencias && <p className="reserva-alerta" role="alert">{errorIncidencias}</p>}
              {!cargandoIncidencias && !errorIncidencias && (
                incidencias.length === 0 ? (
                  <p className="reserva-ayuda">Todavía no tienes incidencias registradas. Primero registra un problema técnico.</p>
                ) : (
                  <label className="reserva-campo">
                    <span>Incidencia</span>
                    <select
                      value={incidenciaSeleccionada}
                      onChange={event => setIncidenciaSeleccionada(event.target.value)}
                    >
                      <option value="">Selecciona una incidencia</option>
                      {incidencias.map(incidencia => (
                        <option key={incidencia.id} value={incidencia.id}>
                          {incidencia.descripcion || `Incidencia ${incidencia.id}`}
                        </option>
                      ))}
                    </select>
                  </label>
                )
              )}
              {incidenciaSeleccionada && <p className="reserva-confirmacion">✓ Incidencia seleccionada</p>}
            </section>

            <section className="reserva-panel">
              <div className="reserva-panel-titulo">
                <span className="reserva-paso">02</span>
                <div>
                  <h2>Modalidad de atención</h2>
                  <p>Elige cómo prefieres recibir el servicio.</p>
                </div>
              </div>
              {cargando && <p className="reserva-ayuda">Cargando modalidades...</p>}
              {error && <p className="reserva-alerta" role="alert">{error}</p>}
              {!cargando && !error && (
                <div className="reserva-opciones">
                  {modalidades.map(modalidad => (
                    <button
                      key={modalidad.id}
                      type="button"
                      aria-pressed={modalidadSeleccionada === modalidad.id}
                      className={`reserva-opcion ${modalidadSeleccionada === modalidad.id ? 'seleccionada' : ''}`}
                      onClick={() => setModalidadSeleccionada(modalidad.id)}
                    >
                      <span className="reserva-radio" aria-hidden="true" />
                      {modalidad.nombre}
                    </button>
                  ))}
                </div>
              )}
              {modalidadSeleccionada && <p className="reserva-confirmacion">✓ Modalidad seleccionada</p>}
            </section>

            <section className="reserva-panel">
              <div className="reserva-panel-titulo">
                <span className="reserva-paso">03</span>
                <div>
                  <h2>Fecha y horario</h2>
                  <p>Consulta los espacios disponibles.</p>
                </div>
              </div>
              <label className="reserva-campo reserva-fecha">
                <span>Fecha de atención</span>
                <input
                  type="date"
                  min={fechaMinima}
                  value={fecha}
                  onChange={event => setFecha(event.target.value)}
                />
              </label>
              {fecha && (
                <div className="reserva-horarios">
                  <h3>Horarios disponibles</h3>
                  {cargandoHorarios && <p className="reserva-ayuda">Consultando horarios...</p>}
                  {errorHorarios && <p className="reserva-alerta" role="alert">{errorHorarios}</p>}
                  {!cargandoHorarios && !errorHorarios && horarios.length === 0 && (
                    <p className="reserva-ayuda">No hay horarios disponibles para esta fecha.</p>
                  )}
                  {!cargandoHorarios && !errorHorarios && horarios.length > 0 && (
                    <div className="reserva-opciones-hora">
                      {horarios.map(hora => (
                        <button
                          key={hora}
                          type="button"
                          aria-pressed={horaSeleccionada === hora}
                          className={`reserva-hora ${horaSeleccionada === hora ? 'seleccionada' : ''}`}
                          onClick={() => setHoraSeleccionada(hora)}
                        >
                          {hora}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>

          <aside className="reserva-resumen">
            <span className="reserva-resumen-etiqueta">TU RESERVA</span>
            <h2>Resumen</h2>
            <div className="reserva-resumen-fila">
              <span>Incidencia</span>
              <strong>{incidenciaElegida?.descripcion || 'Por seleccionar'}</strong>
            </div>
            <div className="reserva-resumen-fila">
              <span>Modalidad</span>
              <strong>{modalidadElegida?.nombre || 'Por seleccionar'}</strong>
            </div>
            <div className="reserva-resumen-fila">
              <span>Fecha</span>
              <strong>{fecha ? fechaLegible(fecha) : 'Por seleccionar'}</strong>
            </div>
            <div className="reserva-resumen-fila">
              <span>Horario</span>
              <strong>{horaSeleccionada || 'Por seleccionar'}</strong>
            </div>
            <div className="reserva-resumen-nota">
              El precio estimado aparecerá al confirmar la reserva.
            </div>
            {errorReserva && <p className="reserva-alerta" role="alert">{errorReserva}</p>}
            <button
              type="button"
              className="reserva-boton-confirmar"
              onClick={confirmarReserva}
              disabled={
                guardandoReserva || !!reservaCreada ||
                !incidenciaSeleccionada || !modalidadSeleccionada ||
                !fecha || !horaSeleccionada || cargandoHorarios
              }
            >
              {guardandoReserva ? 'Registrando reserva...' : 'Confirmar reserva →'}
            </button>
            <p className="reserva-resumen-pie">La reserva se registra únicamente al confirmar.</p>
          </aside>
        </div>
      </div>

      {reservaCreada && (
        <div
          className="reserva-modal-fondo"
          onMouseDown={event => {
            if (event.target === event.currentTarget) navigate('/dashboard-cliente')
          }}
        >
          <section
            className="reserva-ticket"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reserva-ticket-titulo"
          >
            <button
              type="button"
              className="reserva-ticket-cerrar"
              aria-label="Cerrar comprobante e ir al dashboard"
              onClick={() => navigate('/dashboard-cliente')}
            >
              ×
            </button>
            <div className="reserva-ticket-cabecera">
              <span className="reserva-ticket-icono">✓</span>
              <span className="reserva-ticket-marca">FIXIT</span>
              <h2 id="reserva-ticket-titulo">¡Reserva registrada correctamente!</h2>
              <p>Tu solicitud de atención técnica ha sido registrada.</p>
            </div>
            <div className="reserva-ticket-cuerpo">
              {reservaCreada.id && (
                <div className="reserva-ticket-identificador">
                  <span>N.º de reserva</span>
                  <strong>{reservaCreada.id}</strong>
                </div>
              )}
              <div className="reserva-ticket-linea">
                <span>Incidencia</span>
                <strong>{incidenciaElegida?.descripcion || 'No disponible'}</strong>
              </div>
              <div className="reserva-ticket-linea">
                <span>Modalidad</span>
                <strong>{modalidadElegida?.nombre || 'No disponible'}</strong>
              </div>
              <div className="reserva-ticket-linea">
                <span>Fecha</span>
                <strong>{fechaLegible(inicio || fecha)}</strong>
              </div>
              <div className="reserva-ticket-linea">
                <span>Horario</span>
                <strong>
                  {inicio ? horaLegible(inicio) : horaSeleccionada}
                  {fin ? ` – ${horaLegible(fin)}` : ''}
                </strong>
              </div>
              <div className="reserva-ticket-linea">
                <span>Estado</span>
                <strong>{reservaCreada.estado || 'Registrada'}</strong>
              </div>
              <div className="reserva-ticket-precio">
                <span>Precio estimado</span>
                <strong>
                  {reservaCreada.precio_est_min != null && reservaCreada.precio_est_max != null
                    ? `S/ ${reservaCreada.precio_est_min} – S/ ${reservaCreada.precio_est_max}`
                    : 'Por confirmar'}
                </strong>
              </div>
            </div>
            <div className="reserva-ticket-pie">
              <button
                type="button"
                className="reserva-boton-confirmar"
                onClick={() => navigate('/dashboard-cliente')}
              >
                Ir a mi dashboard →
              </button>
              <p>Consulta el seguimiento de tu reserva desde tu dashboard.</p>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export default ReservarServicio
