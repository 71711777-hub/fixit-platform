import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './TechnicianProfile.css'

function TechnicianProfile() {
  const navigate = useNavigate()
  const { id } = useParams()
  

  // 1. Reemplazamos el Mock estático por Estados
  const [tecnico, setTecnico] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // 2. Usamos useEffect para llamar al backend apenas cargue la página
  useEffect(() => {
    const obtenerPerfilTecnico = async () => {
      try {
        const respuesta = await fetch(`http://localhost:3000/api/tecnicos/${id}`)
        
        if (!respuesta.ok) {
          throw new Error('No se pudo encontrar el perfil del técnico')
        }

        const json = await respuesta.json() // Obtenemos el JSON completo
        
        if (json.success && json.data) {
           setTecnico(json.data) 
        } else {
           throw new Error(json.message || 'Error al obtener datos')
        }

      } catch (err) {
        console.error("Error al cargar el perfil:", err)
        setError(err.message)
      } finally {
        setCargando(false)
      }
    }

    obtenerPerfilTecnico()
  }, [id])
  // ... (código posterior)

  const handleVolver = () => {
    navigate(-1)
  }

  // 3. Manejo visual de la carga y errores
  if (cargando) {
    return <div className="loading-container"><h2>Cargando perfil del técnico...</h2></div>
  }

  if (error || !tecnico) {
    return <div className="error-container"><h2>Error: {error}</h2><button onClick={handleVolver}>Volver</button></div>
  }

  // 4. El renderizado
  return (
    <div className="profile-container">
      <div className="profile-card">
        
        <button className="btn-back" onClick={handleVolver}>← Volver a resultados</button>

        {/* --- CABECERA (FOTO Y TÍTULO) --- */}
        <div className="profile-header">
          <div className="profile-avatar-large">
          {tecnico.avatar_url ? (
            <img
              src={tecnico.avatar_url}
              alt={`Foto de ${tecnico.nombre}`}
              className="profile-avatar-image"
            />
          ) : (
            <span>{tecnico.nombre?.charAt(0).toUpperCase()}</span>
          )}
        </div>
          <div className="profile-title-area">
            <div className="profile-title-row">
              <h2>{tecnico.nombre}</h2>
              {tecnico.acepta_reservas === 1 && (
                <span style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  Disponible hoy
                </span>
              )}
            </div>
            <div className="profile-specialty">
              {tecnico.especialidades?.join(' - ') || 'Especialista Técnico'}
            </div>
            <div className="profile-location">
              📍 Zonas de atención:{' '}
              {tecnico.zonas_atencion?.length > 0
                ? tecnico.zonas_atencion
                    .map((zona) => zona.distrito)
                    .join(' · ')
                : 'No registradas'}
            </div>
          </div>
        </div>

        {/* --- GRILLA DE ESTADÍSTICAS --- */}
        <div className="profile-stats-grid">
          <div className="stat-box">
            <span className="stat-value">★ {tecnico.calificacion}</span>
            <span className="stat-label">RESEÑAS ({tecnico.resenas})</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{tecnico.anios_experiencia} años</span>
            <span className="stat-label">EXPERIENCIA</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{tecnico.certificaciones?.length || 0}</span>
            <span className="stat-label">CERTIFICACIONES</span>
          </div>
        </div>

        <hr className="profile-divider" />

        {/* --- CONTENIDO (BIOGRAFÍA Y CERTIFICADOS) --- */}
        <div className="profile-content">
          <div className="content-section">
            <h3>Sobre mí</h3>
            <p>{tecnico.biografia}</p>
          </div>

          <div className="content-section">
            <h3>Certificaciones y Estudios</h3>
            {tecnico.certificaciones && tecnico.certificaciones.length > 0 ? (
              <ul className="certifications-list">
                {tecnico.certificaciones.map((cert, index) => (
                  <li key={index}>
                    🎓 {cert.nombre} {cert.verificada === 1 && '✅'}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Sin certificaciones registradas.</p>
            )}
          </div>
        </div>

        <hr className="profile-divider" />

        {/* --- FOOTER (TARIFA Y BOTÓN) --- */}
        <div className="profile-footer">
          <div className="price-info">
            <span className="price-label">TARIFA DE VISITA TÉCNICA</span>
            {/* Forzamos a convertir el valor de la BD a número con 2 decimales */}
            <span className="price-value">
              S/ {tecnico.tarifa_hora_min ? Number(tecnico.tarifa_hora_min).toFixed(2) : '0.00'}
            </span>
          </div>
          <button
            className="btn-primary"
            onClick={() => navigate(`/reservar/${id}`)}
          >
            Solicitar Servicio
          </button>
        </div>

      </div>
    </div>
  )
}

export default TechnicianProfile