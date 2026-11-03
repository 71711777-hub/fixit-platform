import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  obtenerPreguntasTriaje,
  guardarRespuestasTriaje
} from '../services/api'
import './Triaje.css'


function Triaje() {
  const navigate = useNavigate()

  const [preguntas, setPreguntas] = useState([])
  const [preguntaActual, setPreguntaActual] = useState(0)
  const [respuestas, setRespuestas] = useState({})
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargarPreguntas() {
      try {
        setCargando(true)
        setError('')

        const datos = await obtenerPreguntasTriaje()

        if (!activo) return

        setPreguntas(datos)
      } catch (err) {
        if (activo) {
          setError(err.message || 'No se pudieron cargar las preguntas.')
        }
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargarPreguntas()

    return () => {
      activo = false
    }
  }, [])

  const porcentajeProgreso = preguntas.length
    ? ((preguntaActual + 1) / preguntas.length) * 100
    : 0

  const handleSeleccionarOpcion = (opcionId) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaActual]: opcionId
    }))
  }

  const handleSiguiente = async () => {
  if (respuestas[preguntaActual] === undefined || enviando) return

  if (preguntaActual < preguntas.length - 1) {
    setPreguntaActual((prev) => prev + 1)
    return
  }

  const incidenciaId = sessionStorage.getItem('fixit_incidencia_id')

  if (!incidenciaId) {
    setErrorEnvio(
      'No encontramos la incidencia asociada. Registra una incidencia antes de continuar.'
    )
    return
  }

  const respuestasPayload = preguntas.map((pregunta, indice) => ({
      pregunta_id: pregunta.id,
      opcion_id: respuestas[indice]
    }))

    try {
      setEnviando(true)
      setErrorEnvio('')

      const resultado = await guardarRespuestasTriaje(
        incidenciaId,
        respuestasPayload
      )

      // Conservar el resultado para la siguiente pantalla
      sessionStorage.setItem(
        'fixit_resultado_triaje',
        JSON.stringify(resultado)
      )

      navigate('/resultado-diagnostico')
    } catch (err) {
      setErrorEnvio(
        err.message || 'No se pudieron guardar las respuestas del triaje.'
      )
    } finally {
      setEnviando(false)
    }
  }

  const handleAtras = () => {
    if (preguntaActual > 0) {
      setPreguntaActual((prev) => prev - 1)
    } else {
      navigate('/registrar-incidencia')
    }
  }

  if (cargando) {
    return (
      <div className="triaje-container">
        <div className="triaje-card">
          <p role="status">Cargando preguntas del triaje...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="triaje-container">
        <div className="triaje-card">
          <p role="alert">{error}</p>
          <button
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            Volver a intentar
          </button>
        </div>
      </div>
    )
  }

  if (preguntas.length === 0) {
    return (
      <div className="triaje-container">
        <div className="triaje-card">
          <p>No hay preguntas de triaje disponibles.</p>
          <button
            className="btn-texto"
            onClick={() => navigate('/registrar-incidencia')}
          >
            ← Volver
          </button>
        </div>
      </div>
    )
  }

  const preguntaActiva = preguntas[preguntaActual]
  const opcionSeleccionada = respuestas[preguntaActual]

  return (
    <div className="triaje-container">
      <div className="triaje-card">
        <div className="triaje-header">
          <div className="progreso-info">
            <span className="progreso-texto">Triaje de diagnóstico</span>
            <span className="progreso-contador">
              Pregunta {preguntaActual + 1} de {preguntas.length}
            </span>
          </div>

          <div className="progreso-barra-fondo">
            <div
              className="progreso-barra-relleno"
              style={{ width: `${porcentajeProgreso}%` }}
            />
          </div>
        </div>

        <div className="pregunta-contenido">
          <h2>{preguntaActiva.titulo}</h2>

          <div className="opciones-lista">
            {preguntaActiva.opciones.map((opcion) => (
              <div
                key={opcion.id}
                role="button"
                tabIndex={0}
                aria-pressed={opcionSeleccionada === opcion.id}
                className={`opcion-card ${
                  opcionSeleccionada === opcion.id ? 'seleccionada' : ''
                }`}
                onClick={() => handleSeleccionarOpcion(opcion.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSeleccionarOpcion(opcion.id)
                  }
                }}
              >
                <div
                  className={`radio-circle ${
                    opcionSeleccionada === opcion.id ? 'active' : ''
                  }`}
                >
                  {opcionSeleccionada === opcion.id && (
                    <div className="radio-inner" />
                  )}
                </div>

                <span>{opcion.texto}</span>
              </div>
            ))}
          </div>
        </div>
        {errorEnvio && (
          <p role="alert" className="error-message">
            {errorEnvio}
          </p>
        )}
        <div className="triaje-acciones">
          <button className="btn-texto" onClick={handleAtras}>
            ← Atrás
          </button>

          <button
          className="btn-primary"
          onClick={handleSiguiente}
          disabled={opcionSeleccionada === undefined || enviando}
        >
          {enviando
            ? 'Guardando...'
            : preguntaActual === preguntas.length - 1
              ? 'Finalizar'
              : 'Siguiente →'}
        </button>
        </div>
      </div>
    </div>
  )
}

export default Triaje
