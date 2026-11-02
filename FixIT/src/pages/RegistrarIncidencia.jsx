import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { obtenerCatalogosIncidencia } from '../services/api'
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
  const [fotos, setFotos] = useState([]);

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
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Permite sumar fotos nuevas sin borrar las anteriores (máximo 3)
  const handleFileChange = (e) => {
    if (!e.target.files.length) return

    const nuevosArchivos = Array.from(e.target.files)

    setFotos((prevFotos) => {
      const combinados = [...prevFotos, ...nuevosArchivos]
      if (combinados.length > 3) {
        alert('Solo puedes adjuntar un máximo de 3 imágenes por incidencia.')
      }
      return combinados.slice(0, 3) // Mantiene solo los primeros 3
    })

    // Limpia el input para permitir seleccionar el mismo archivo si se desea
    e.target.value = ''
  }

  // Permite quitar una foto de la lista antes de enviar
  const handleEliminarFoto = (indexAEliminar) => {
    setFotos((prevFotos) => prevFotos.filter((_, index) => index !== indexAEliminar))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (enviando || cargando) return

    setError('')
    setEnviando(true)

    try {
      const formPayload = new FormData()
      formPayload.append('tipo_equipo_id', formData.tipo_equipo)
      formPayload.append('categoria_id', formData.categoria)
      formPayload.append('descripcion', formData.descripcion.trim())

      if (fotos.length > 0) {
        for (let i = 0; i < fotos.length; i++) {
          formPayload.append('fotos', fotos[i])
        }
      }

      const token = localStorage.getItem('fixit_token') || '' // Ajusta la key si es que cambia

      const respuesta = await fetch('http://localhost:3000/api/incidencias', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formPayload
      })

      const data = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(data.message || 'Error al registrar la incidencia')
      }

      // Guardar el ID para utilizarlo durante el triaje
      sessionStorage.setItem('fixit_incidencia_id', data.data.id)

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
            <label>Adjuntar imágenes (Opcional - Máx. 3)</label>
            <div className="upload-area" style={{ position: 'relative' }}>
              <span className="upload-icon">☁️</span>
              <p>Haz clic aquí para seleccionar o agregar imágenes JPG/PNG</p>

              <input 
                type="file" 
                accept="image/jpeg, image/png, image/jpg"
                multiple 
                onChange={handleFileChange}
                disabled={enviando || fotos.length >= 3}
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  opacity: 0, 
                  cursor: fotos.length >= 3 ? 'not-allowed' : 'pointer' 
                }}
              />
            </div>

            {/* Muestra la lista detallada de archivos adjuntos */}
            {fotos.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <small style={{ fontWeight: 'bold', color: '#16a34a', display: 'block', marginBottom: '6px' }}>
                  Archivos adjuntos ({fotos.length}/3):
                </small>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {fotos.map((foto, index) => (
                    <li key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#f3f4f6',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      marginBottom: '4px',
                      fontSize: '0.85rem'
                    }}>
                      <span>📷 {foto.name} <small style={{ color: '#6b7280' }}>({(foto.size / 1024 / 1024).toFixed(2)} MB)</small></span>
                      <button 
                        type="button" 
                        onClick={() => handleEliminarFoto(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '1rem'
                        }}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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