
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './ResultadoDiagnostico.css'

function ResultadoDiagnostico() {
  const navigate = useNavigate()
  const [diagnostico] = useState(() => {
    const resultadoGuardado = sessionStorage.getItem(
      'fixit_resultado_triaje'
    )

    if (!resultadoGuardado) return null

    try {
      return JSON.parse(resultadoGuardado)
    } catch {
      return null
    }
  })

  const handleBuscarTecnicos = () => {
    navigate('/technicians')
  }

  const handleVolverInicio = () => {
    navigate('/')
  }

  return (
    <div className="diagnostico-container">
      <div className="diagnostico-card">

        {/* CABECERA */}
        <h2 className="diagnostico-titulo">
          Resultado de Diagnóstico
        </h2>

        <hr className="diagnostico-divider" />

        {diagnostico ? (
          <>
            <div className="diagnostico-seccion">
              <h3 className="seccion-label">
                CATEGORÍA PRELIMINAR
              </h3>

              <span className="categoria-tag">
                {diagnostico.categoria_nombre || 'Sin clasificar'}
              </span>
            </div>

            <div className="diagnostico-seccion">
              <h3 className="seccion-label">
                REVISIÓN RECOMENDADA
              </h3>

              <p className="recomendacion-texto">
                {diagnostico.recomendacion}
              </p>
            </div>

            <div className="diagnostico-seccion">
              <h3 className="seccion-label">
                PRECIO ESTIMADO DE REPARACIÓN
              </h3>

              <p className="precio-texto">
                S/ {Number(diagnostico.precio_min).toFixed(2)}
                {' - '}
                S/ {Number(diagnostico.precio_max).toFixed(2)}
              </p>
            </div>

            <div className="alerta-informativa">
              <span className="alerta-icono">ℹ️</span>
              <p>
                Este es un diagnóstico referencial basado en el
                triaje automático. El soporte técnico realizará
                una evaluación definitiva antes de confirmar el costo.
              </p>
            </div>
          </>
        ) : (
          <div className="diagnostico-seccion">
            <h3 className="seccion-label">
              No hay un diagnóstico disponible
            </h3>

            <p className="recomendacion-texto">
              Para consultar un resultado, primero registra una
              incidencia y completa las preguntas del triaje.
            </p>
          </div>
        )}

        {/* BOTONES DE ACCIÓN */}
        <div className="diagnostico-acciones">
          <button
            className="btn-secondary"
            onClick={handleVolverInicio}
          >
            Volver a Inicio
          </button>

          {diagnostico ? (
            <button
              className="btn-primary"
              onClick={handleBuscarTecnicos}
            >
              Buscar Técnicos Disponibles
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={() => navigate('/triaje')}
            >
              Ir al Triaje
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default ResultadoDiagnostico
