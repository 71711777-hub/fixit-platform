import { useParams, useNavigate } from 'react-router-dom'
import './TechnicianProfile.css'

function TechnicianProfile() {
  // HOOKS DE ENRUTAMIENTO
  const navigate = useNavigate()
  
  // Si la ruta es /technician/1, 'id' valdrá "1".
  const { id } = useParams()

  // DATOS SIMULADOS (MOCK)
  // TODO: Crear el endpoint GET /api/tecnicos/:id. 
  // Aquí usaríamos un useEffect para buscar en la BD al técnico que coincida con el 'id' de la URL.
  const perfilMock = {
    id: id,
    nombre: 'Juan Pérez',
    especialidad: 'Especialista en Hardware & PCs',
    disponibilidad: 'Disponible hoy',
    calificacion: 4.8,
    resenas: 24,
    trabajosCompletados: 156,
    experiencia: '5 años',
    ubicacion: 'Miraflores (2.5 km)',
    biografia: 'Técnico superior en computación e informática con más de 5 años de experiencia reparando equipos de escritorio y laptops. Especializado en diagnóstico de placas, cambio de componentes y optimización de hardware para alto rendimiento y gaming.',
    certificaciones: [
      'CompTIA A+',
      'Especialista en Soporte IT - Google',
      'Ensamblaje y Mantenimiento Avanzado'
    ],
    tarifaVisita: 35.00
  }

  // MANEJADORES DE ACCIÓN
  const handleVolver = () => {
    navigate(-1)
  }

  const handleSolicitarServicio = () => {
    // TODO: POST /api/solicitudes (Crear la orden de servicio oficial enlazando cliente_id, tecnico_id e incidencia_id)
    alert(`¡Servicio solicitado a ${perfilMock.nombre}! Se ha notificado al técnico.`)
    navigate('/') // Redirige al Home (o a un futuro panel de usuario)
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        
        {/* BOTÓN DE RETROCESO */}
        <button className="btn-back" onClick={handleVolver}>
          ← Volver a resultados
        </button>

        {/* CABECERA DEL PERFIL */}
        <div className="profile-header">
          <div className="profile-avatar-large">
            {/* TODO: Reemplazar por <img> cuando tengamos fotos reales */}
            Avatar
          </div>
          
          <div className="profile-title-area">
            <div className="profile-title-row">
              <h2>{perfilMock.nombre}</h2>
              <span className={`status-tag ${perfilMock.disponibilidad === 'Disponible hoy' ? 'tag-today' : 'tag-tomorrow'}`}>
                {perfilMock.disponibilidad}
              </span>
            </div>
            <p className="profile-specialty">{perfilMock.especialidad}</p>
            <span className="profile-location">📍 {perfilMock.ubicacion}</span>
          </div>
        </div>

        {/* MÉTRICAS RÁPIDAS */}
        <div className="profile-stats-grid">
          <div className="stat-box">
            <span className="stat-value">★ {perfilMock.calificacion}</span>
            <span className="stat-label">{perfilMock.resenas} reseñas</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{perfilMock.trabajosCompletados}</span>
            <span className="stat-label">Trabajos</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{perfilMock.experiencia}</span>
            <span className="stat-label">Experiencia</span>
          </div>
        </div>

        <hr className="profile-divider" />

        {/* BIOGRAFÍA Y CERTIFICACIONES */}
        <div className="profile-content">
          <div className="content-section">
            <h3>Sobre mí</h3>
            <p>{perfilMock.biografia}</p>
          </div>

          <div className="content-section">
            <h3>Certificaciones y Estudios</h3>
            <ul className="certifications-list">
              {perfilMock.certificaciones.map((cert, index) => (
                <li key={index}>🎓 {cert}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* PIE DE TARJETA: PRECIO Y ACCIÓN */}
        <div className="profile-footer">
          <div className="price-info">
            <span className="price-label">Tarifa de visita técnica</span>
            <span className="price-value">S/ {perfilMock.tarifaVisita.toFixed(2)}</span>
          </div>
          <button className="btn-primary" onClick={handleSolicitarServicio}>
            Solicitar Servicio
          </button>
        </div>

      </div>
    </div>
  )
}

export default TechnicianProfile