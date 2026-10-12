import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  obtenerCatalogosIncidencia,
  registrarIncidencia
} from '../services/api'
import './RegistrarIncidencia.css'

function RegistrarIncidencia() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    tipo_equipo: '',
    categoria: '',
    descripcion: ''
  })

  const [tiposEquipo, setTiposEquipo] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  const maxCaracteres = 500

  useEffect(() => {
    let activo = true

    async function cargarCatalogos() {
      try {
        setCargando(true)
        setError('')

        const datos = await obtenerCatalogosIncidencia()

        if (!activo) return

        setTiposEquipo(datos.tiposEquipo)
        setCategorias(datos.categorias)
      } catch (err) {
        if (activo) {
          setError(err.message || 'No se pudieron cargar las opciones')
        }
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargarCatalogos()

    return () => {
      activo = false
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'descripcion' && value.length > maxCaracteres) {
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (enviando || cargando) return

    setError('')
    setEnviando(true)

    try {
      const incidencia = await registrarIncidencia({
        tipo_equipo_id: formData.tipo_equipo,
        categoria_id: formData.categoria,
        descripcion: formData.descripcion.trim()
      })

      // Guardar el ID para utilizarlo durante el triaje
      sessionStorage.setItem('fixit_incidencia_id', incidencia.id)

      // Ir al triaje solamente si el registro fue exitoso
      navigate('/triaje')
    } catch (err) {
      setError(
        err.message || 'No se pudo registrar la incidencia. Inténtalo nuevamente.'
      )
    } finally {
      setEnviando(false)
    }
  }

  const handleCancelar = () => {
    navigate('/')
  }

  return (
    <div className="incidencia-container">
      <div className="incidencia-card">
        <div className="incidencia-header">
          <h2>Registrar Incidencia</h2>
          <p>
            Cuéntanos sobre tu problema técnico para guiarte en el
            diagnóstico preliminar.
          </p>
        </div>

        {error && (
          <div role="alert" className="error-message">
            {error}
          </div>
        )}

        {cargando && (
          <p role="status">Cargando equipos y categorías...</p>
        )}

        <form onSubmit={handleSubmit} className="incidencia-form">
          <div className="form-group">
            <label htmlFor="tipo_equipo">Tipo de equipo</label>
            <div className="select-wrapper">
              <select
                id="tipo_equipo"
                name="tipo_equipo"
                value={formData.tipo_equipo}
                onChange={handleChange}
                required
                disabled={cargando || !!error || enviando}
              >
                <option value="" disabled>
                  Selecciona un equipo
                </option>

                {tiposEquipo.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="categoria">Categoría del problema</label>
            <div className="select-wrapper">
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
                disabled={cargando || !!error || enviando}
              >
                <option value="" disabled>
                  Selecciona una categoría
                </option>

                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción del problema</label>
            <textarea
              id="descripcion"
              name="descripcion"
              placeholder="Describe detalladamente qué sucede con tu equipo..."
              value={formData.descripcion}
              onChange={handleChange}
              rows="4"
              maxLength={maxCaracteres}
              required
              disabled={enviando}
            />

            <div className="char-counter">
              {formData.descripcion.length} / {maxCaracteres}
            </div>
          </div>

          <div className="form-group">
            <label>Adjuntar imagen (Opcional)</label>
            <div className="upload-area">
              <span className="upload-icon">☁️</span>
              <p>Arrastra una imagen aquí o haz clic para buscar</p>
              <small>Formatos soportados: PNG, JPG (Máx. 5MB)</small>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCancelar}
              disabled={enviando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={cargando || !!error || enviando}
            >
              {enviando ? 'Registrando...' : 'Continuar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegistrarIncidencia
